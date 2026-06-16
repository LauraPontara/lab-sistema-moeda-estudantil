import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE_CONNECTION } from '../database/database.constants';
import {
  advantageRedemptions,
  advantages,
  coinTransfers,
  partnerCompanyProfiles,
  professorProfiles,
  professorSemesterAllowances,
  studentProfiles,
  UserRole,
  users,
} from '../database/schemas';
import * as schema from '../database/schemas';
import { SendCoinsDto } from './dto/send-coins.dto';
import { CoinTransferEvent } from './coin-transfer-event.type';
import { CoinStatementModel } from './models/coin-statement.model';

type Database = PostgresJsDatabase<typeof schema>;

type TransferWriteResult = {
  status: 'ok' | 'not_found' | 'different_institution' | 'insufficient_balance';
  balanceAfter: number;
  event: CoinTransferEvent | null;
};

@Injectable()
export class CoinsRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async createTransferByProfessor(
    professorId: string,
    dto: SendCoinsDto,
  ): Promise<TransferWriteResult> {
    return this.db.transaction(async (tx) => {
      const [professor] = await tx
        .select({
          userId: users.id,
          email: users.email,
          role: users.role,
          coinBalance: users.coinBalance,
          whatsappPhone: users.whatsappPhone,
          name: professorProfiles.name,
          institutionId: professorProfiles.institutionId,
        })
        .from(users)
        .innerJoin(professorProfiles, eq(professorProfiles.userId, users.id))
        .where(eq(users.id, professorId))
        .limit(1);

      if (!professor || professor.role !== UserRole.PROFESSOR) {
        return {
          status: 'not_found',
          balanceAfter: 0,
          event: null,
        };
      }

      const [student] = await tx
        .select({
          userId: users.id,
          email: users.email,
          role: users.role,
          coinBalance: users.coinBalance,
          whatsappPhone: users.whatsappPhone,
          name: studentProfiles.name,
          institutionId: studentProfiles.institutionId,
        })
        .from(users)
        .innerJoin(studentProfiles, eq(studentProfiles.userId, users.id))
        .where(eq(users.id, dto.studentId))
        .limit(1);

      if (!student || student.role !== UserRole.STUDENT) {
        return {
          status: 'not_found',
          balanceAfter: professor.coinBalance,
          event: null,
        };
      }

      if (professor.institutionId !== student.institutionId) {
        return {
          status: 'different_institution',
          balanceAfter: professor.coinBalance,
          event: null,
        };
      }

      const [updatedProfessor] = await tx
        .update(users)
        .set({
          coinBalance: sql`${users.coinBalance} - ${dto.amount}`,
          updatedAt: new Date(),
        })
        .where(
          and(eq(users.id, professorId), gte(users.coinBalance, dto.amount)),
        )
        .returning({ id: users.id, coinBalance: users.coinBalance });

      if (!updatedProfessor) {
        return {
          status: 'insufficient_balance',
          balanceAfter: professor.coinBalance,
          event: null,
        };
      }

      const [updatedStudent] = await tx
        .update(users)
        .set({
          coinBalance: sql`${users.coinBalance} + ${dto.amount}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, student.userId))
        .returning({ id: users.id, coinBalance: users.coinBalance });

      const [transfer] = await tx
        .insert(coinTransfers)
        .values({
          professorId: professor.userId,
          studentId: student.userId,
          amount: dto.amount,
          message: dto.message.trim(),
        })
        .returning({
          id: coinTransfers.id,
          createdAt: coinTransfers.createdAt,
        });

      return {
        status: 'ok',
        balanceAfter: updatedProfessor.coinBalance,
        event: {
          transferId: transfer.id,
          amount: dto.amount,
          message: dto.message.trim(),
          createdAt: transfer.createdAt.toISOString(),
          professor: {
            id: professor.userId,
            name: professor.name,
            email: professor.email,
            whatsappPhone: professor.whatsappPhone ?? null,
            balanceAfter: updatedProfessor.coinBalance,
          },
          student: {
            id: student.userId,
            name: student.name,
            email: student.email,
            whatsappPhone: student.whatsappPhone ?? null,
            balanceAfter: updatedStudent?.coinBalance ?? student.coinBalance,
          },
        },
      };
    });
  }

  async getProfessorStatement(
    professorId: string,
  ): Promise<CoinStatementModel | null> {
    const [professor] = await this.db
      .select({
        id: users.id,
        role: users.role,
        balance: users.coinBalance,
      })
      .from(users)
      .where(eq(users.id, professorId))
      .limit(1);

    if (!professor || professor.role !== UserRole.PROFESSOR) {
      return null;
    }

    const rows = await this.db
      .select({
        id: coinTransfers.id,
        amount: coinTransfers.amount,
        message: coinTransfers.message,
        createdAt: coinTransfers.createdAt,
        counterpartId: studentProfiles.userId,
        counterpartName: studentProfiles.name,
        counterpartEmail: users.email,
      })
      .from(coinTransfers)
      .innerJoin(
        studentProfiles,
        eq(studentProfiles.userId, coinTransfers.studentId),
      )
      .innerJoin(users, eq(users.id, coinTransfers.studentId))
      .where(eq(coinTransfers.professorId, professorId))
      .orderBy(desc(coinTransfers.createdAt));

    return {
      role: professor.role,
      balance: professor.balance,
      entries: rows.map((row) => ({
        id: row.id,
        amount: row.amount,
        message: row.message,
        createdAt: row.createdAt,
        direction: 'OUT' as const,
        counterpartId: row.counterpartId,
        counterpartName: row.counterpartName,
        counterpartEmail: row.counterpartEmail,
      })),
    };
  }

  async getStudentStatement(
    studentId: string,
  ): Promise<CoinStatementModel | null> {
    const [student] = await this.db
      .select({
        id: users.id,
        role: users.role,
        balance: users.coinBalance,
      })
      .from(users)
      .where(eq(users.id, studentId))
      .limit(1);

    if (!student || student.role !== UserRole.STUDENT) {
      return null;
    }

    const transferRows = await this.db
      .select({
        id: coinTransfers.id,
        amount: coinTransfers.amount,
        message: coinTransfers.message,
        createdAt: coinTransfers.createdAt,
        counterpartId: professorProfiles.userId,
        counterpartName: professorProfiles.name,
        counterpartEmail: users.email,
      })
      .from(coinTransfers)
      .innerJoin(
        professorProfiles,
        eq(professorProfiles.userId, coinTransfers.professorId),
      )
      .innerJoin(users, eq(users.id, coinTransfers.professorId))
      .where(eq(coinTransfers.studentId, studentId))
      .orderBy(desc(coinTransfers.createdAt));

    const redemptionRows = await this.db
      .select({
        id: advantageRedemptions.id,
        amount: advantageRedemptions.xpSpent,
        message: advantages.title,
        createdAt: advantageRedemptions.createdAt,
        counterpartId: advantages.companyId,
        counterpartName: partnerCompanyProfiles.tradeName,
        counterpartEmail: users.email,
      })
      .from(advantageRedemptions)
      .innerJoin(
        advantages,
        eq(advantages.id, advantageRedemptions.advantageId),
      )
      .innerJoin(
        partnerCompanyProfiles,
        eq(partnerCompanyProfiles.userId, advantages.companyId),
      )
      .innerJoin(users, eq(users.id, advantages.companyId))
      .where(eq(advantageRedemptions.studentId, studentId))
      .orderBy(desc(advantageRedemptions.createdAt));

    const entries = [
      ...transferRows.map((row) => ({
        id: row.id,
        amount: row.amount,
        message: row.message,
        createdAt: row.createdAt,
        direction: 'IN' as const,
        counterpartId: row.counterpartId,
        counterpartName: row.counterpartName,
        counterpartEmail: row.counterpartEmail,
      })),
      ...redemptionRows.map((row) => ({
        id: row.id,
        amount: row.amount,
        message: row.message,
        createdAt: row.createdAt,
        direction: 'OUT' as const,
        counterpartId: row.counterpartId,
        counterpartName: row.counterpartName,
        counterpartEmail: row.counterpartEmail,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      role: student.role,
      balance: student.balance,
      entries,
    };
  }

  async creditSemesterAllowances(semesterCode: string): Promise<number> {
    const professors = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, UserRole.PROFESSOR));

    let creditedCount = 0;

    await this.db.transaction(async (tx) => {
      for (const professor of professors) {
        const inserted = await tx
          .insert(professorSemesterAllowances)
          .values({
            professorId: professor.id,
            semesterCode,
            amount: 1000,
          })
          .onConflictDoNothing()
          .returning({ id: professorSemesterAllowances.id });

        if (inserted.length === 0) {
          continue;
        }

        creditedCount += 1;

        await tx
          .update(users)
          .set({
            coinBalance: sql`${users.coinBalance} + 1000`,
            updatedAt: new Date(),
          })
          .where(eq(users.id, professor.id));
      }
    });

    return creditedCount;
  }
}
