import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE_CONNECTION } from '../database/database.constants';
import * as schema from '../database/schemas';
import {
  advantageRedemptions,
  advantages,
  partnerCompanyProfiles,
  studentProfiles,
  UserRole,
  users,
} from '../database/schemas';
import { generateCoupon } from './coupon.util';
import { CreateAdvantageDto } from './dto/create-advantage.dto';
import { AdvantageMapper } from './mappers/advantage.mapper';
import { AdvantageModel } from './models/advantage.model';
import { RedemptionEvent } from './redemption-event.type';

type Database = PostgresJsDatabase<typeof schema>;

type RedemptionWriteResult =
  | {
      status: 'ok';
      balanceAfter: number;
      couponCode: string;
      event: RedemptionEvent;
    }
  | {
      status: 'not_found' | 'advantage_unavailable' | 'insufficient_balance';
      balanceAfter: number;
      couponCode: null;
      event: null;
    };

@Injectable()
export class AdvantagesRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  private selectAdvantageFields() {
    return {
      id: advantages.id,
      companyId: advantages.companyId,
      companyName: partnerCompanyProfiles.tradeName,
      title: advantages.title,
      description: advantages.description,
      category: advantages.category,
      icon: advantages.icon,
      costXp: advantages.costXp,
      active: advantages.active,
      createdAt: advantages.createdAt,
      updatedAt: advantages.updatedAt,
    };
  }

  async create(
    companyId: string,
    dto: CreateAdvantageDto,
  ): Promise<AdvantageModel> {
    const [inserted] = await this.db
      .insert(advantages)
      .values({
        companyId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        icon: dto.icon,
        costXp: dto.costXp,
      })
      .returning({ id: advantages.id });

    const created = await this.findById(inserted.id);

    if (!created) {
      throw new Error('Falha ao carregar vantagem criada.');
    }

    return created;
  }

  async findByCompany(companyId: string): Promise<AdvantageModel[]> {
    const rows = await this.db
      .select(this.selectAdvantageFields())
      .from(advantages)
      .innerJoin(
        partnerCompanyProfiles,
        eq(partnerCompanyProfiles.userId, advantages.companyId),
      )
      .where(
        and(eq(advantages.companyId, companyId), eq(advantages.active, true)),
      )
      .orderBy(desc(advantages.createdAt));

    return rows.map((row) => AdvantageMapper.toModel(row));
  }

  async findActiveCatalog(): Promise<AdvantageModel[]> {
    const rows = await this.db
      .select(this.selectAdvantageFields())
      .from(advantages)
      .innerJoin(
        partnerCompanyProfiles,
        eq(partnerCompanyProfiles.userId, advantages.companyId),
      )
      .where(eq(advantages.active, true))
      .orderBy(desc(advantages.createdAt));

    return rows.map((row) => AdvantageMapper.toModel(row));
  }

  async softDelete(id: string, companyId: string): Promise<boolean> {
    const deleted = await this.db
      .update(advantages)
      .set({
        active: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(advantages.id, id),
          eq(advantages.companyId, companyId),
          eq(advantages.active, true),
        ),
      )
      .returning({ id: advantages.id });

    return deleted.length > 0;
  }

  async findById(id: string): Promise<AdvantageModel | null> {
    const [row] = await this.db
      .select(this.selectAdvantageFields())
      .from(advantages)
      .innerJoin(
        partnerCompanyProfiles,
        eq(partnerCompanyProfiles.userId, advantages.companyId),
      )
      .where(eq(advantages.id, id))
      .limit(1);

    return row ? AdvantageMapper.toModel(row) : null;
  }

  async redeem(
    studentId: string,
    advantageId: string,
  ): Promise<RedemptionWriteResult> {
    return this.db.transaction(async (tx) => {
      const [student] = await tx
        .select({
          id: users.id,
          email: users.email,
          whatsappPhone: users.whatsappPhone,
          role: users.role,
          coinBalance: users.coinBalance,
          name: studentProfiles.name,
        })
        .from(users)
        .innerJoin(studentProfiles, eq(studentProfiles.userId, users.id))
        .where(eq(users.id, studentId))
        .limit(1);

      if (!student || student.role !== UserRole.STUDENT) {
        return {
          status: 'not_found',
          balanceAfter: 0,
          couponCode: null,
          event: null,
        };
      }

      const [advantage] = await tx
        .select({
          id: advantages.id,
          companyId: advantages.companyId,
          companyEmail: users.email,
          companyWhatsappPhone: users.whatsappPhone,
          companyTradeName: partnerCompanyProfiles.tradeName,
          title: advantages.title,
          costXp: advantages.costXp,
          active: advantages.active,
        })
        .from(advantages)
        .innerJoin(users, eq(users.id, advantages.companyId))
        .innerJoin(
          partnerCompanyProfiles,
          eq(partnerCompanyProfiles.userId, advantages.companyId),
        )
        .where(eq(advantages.id, advantageId))
        .limit(1);

      if (!advantage || !advantage.active) {
        return {
          status: 'advantage_unavailable',
          balanceAfter: student.coinBalance,
          couponCode: null,
          event: null,
        };
      }

      if (student.coinBalance < advantage.costXp) {
        return {
          status: 'insufficient_balance',
          balanceAfter: student.coinBalance,
          couponCode: null,
          event: null,
        };
      }

      const [updatedStudent] = await tx
        .update(users)
        .set({
          coinBalance: sql`${users.coinBalance} - ${advantage.costXp}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(users.id, studentId),
            gte(users.coinBalance, advantage.costXp),
          ),
        )
        .returning({ id: users.id, coinBalance: users.coinBalance });

      if (!updatedStudent) {
        return {
          status: 'insufficient_balance',
          balanceAfter: student.coinBalance,
          couponCode: null,
          event: null,
        };
      }

      const couponCode = generateCoupon();
      const [redemption] = await tx
        .insert(advantageRedemptions)
        .values({
          advantageId: advantage.id,
          studentId: student.id,
          couponCode,
          xpSpent: advantage.costXp,
        })
        .returning({
          id: advantageRedemptions.id,
          createdAt: advantageRedemptions.createdAt,
        });

      return {
        status: 'ok',
        balanceAfter: updatedStudent.coinBalance,
        couponCode,
        event: {
          redemptionId: redemption.id,
          couponCode,
          redeemedAt: redemption.createdAt.toISOString(),
          advantage: {
            id: advantage.id,
            title: advantage.title,
            costXp: advantage.costXp,
          },
          student: {
            id: student.id,
            name: student.name,
            email: student.email,
            whatsappPhone: student.whatsappPhone,
            balanceAfter: updatedStudent.coinBalance,
          },
          company: {
            id: advantage.companyId,
            tradeName: advantage.companyTradeName,
            email: advantage.companyEmail,
            whatsappPhone: advantage.companyWhatsappPhone,
          },
        },
      };
    });
  }
}
