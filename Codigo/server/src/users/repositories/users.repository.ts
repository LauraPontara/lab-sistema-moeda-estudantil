import { Inject, Injectable } from '@nestjs/common';
import { and, eq, ne, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE_CONNECTION } from '../../database/database.constants';
import {
  administratorProfiles,
  professorSemesterAllowances,
  partnerCompanyProfiles,
  professorProfiles,
  studentProfiles,
  UserRole,
  users,
} from '../../database/schemas';
import * as schema from '../../database/schemas';
import { semesterCode } from '../../common/utils/semester.util';
import { SEMESTER_COIN_ALLOWANCE } from '../../coins/coins.constants';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { CreatePartnerCompanyDto } from '../dto/create-partner-company.dto';
import { CreateProfessorDto } from '../dto/create-professor.dto';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthenticatedUser } from '../models/user.model';

type Database = PostgresJsDatabase<typeof schema>;
type StudentProfile = typeof studentProfiles.$inferSelect;
type PartnerCompanyProfile = typeof partnerCompanyProfiles.$inferSelect;
type ProfessorProfile = typeof professorProfiles.$inferSelect;
type AdministratorProfile = typeof administratorProfiles.$inferSelect;

export type UserWithStudentProfile = {
  user: AuthenticatedUser;
  profile: StudentProfile;
};

export type UserWithPartnerCompanyProfile = {
  user: AuthenticatedUser;
  profile: PartnerCompanyProfile;
};

export type UserWithProfessorProfile = {
  user: AuthenticatedUser;
  profile: ProfessorProfile;
};

export type UserWithAdministratorProfile = {
  user: AuthenticatedUser;
  profile: AdministratorProfile;
};

@Injectable()
export class UsersRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async findById(id: string): Promise<AuthenticatedUser | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<AuthenticatedUser | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user ?? null;
  }

  async findAll(role?: UserRole): Promise<AuthenticatedUser[]> {
    if (role) {
      return this.db
        .select()
        .from(users)
        .where(eq(users.role, role))
        .orderBy(users.email);
    }

    return this.db.select().from(users).orderBy(users.email);
  }

  async findStudents(): Promise<UserWithStudentProfile[]> {
    return this.db
      .select({ user: users, profile: studentProfiles })
      .from(users)
      .innerJoin(studentProfiles, eq(studentProfiles.userId, users.id))
      .orderBy(studentProfiles.name);
  }

  async findStudentByUserId(
    userId: string,
  ): Promise<UserWithStudentProfile | null> {
    const [row] = await this.db
      .select({ user: users, profile: studentProfiles })
      .from(users)
      .innerJoin(studentProfiles, eq(studentProfiles.userId, users.id))
      .where(eq(users.id, userId))
      .limit(1);
    return row ?? null;
  }

  async findPartnerCompanies(): Promise<UserWithPartnerCompanyProfile[]> {
    return this.db
      .select({ user: users, profile: partnerCompanyProfiles })
      .from(users)
      .innerJoin(
        partnerCompanyProfiles,
        eq(partnerCompanyProfiles.userId, users.id),
      )
      .orderBy(partnerCompanyProfiles.tradeName);
  }

  async findPartnerCompanyByUserId(
    userId: string,
  ): Promise<UserWithPartnerCompanyProfile | null> {
    const [row] = await this.db
      .select({ user: users, profile: partnerCompanyProfiles })
      .from(users)
      .innerJoin(
        partnerCompanyProfiles,
        eq(partnerCompanyProfiles.userId, users.id),
      )
      .where(eq(users.id, userId))
      .limit(1);
    return row ?? null;
  }

  async findProfessors(): Promise<UserWithProfessorProfile[]> {
    return this.db
      .select({ user: users, profile: professorProfiles })
      .from(users)
      .innerJoin(professorProfiles, eq(professorProfiles.userId, users.id))
      .orderBy(professorProfiles.name);
  }

  async findProfessorByUserId(
    userId: string,
  ): Promise<UserWithProfessorProfile | null> {
    const [row] = await this.db
      .select({ user: users, profile: professorProfiles })
      .from(users)
      .innerJoin(professorProfiles, eq(professorProfiles.userId, users.id))
      .where(eq(users.id, userId))
      .limit(1);
    return row ?? null;
  }

  async findAdministrators(): Promise<UserWithAdministratorProfile[]> {
    return this.db
      .select({ user: users, profile: administratorProfiles })
      .from(users)
      .innerJoin(
        administratorProfiles,
        eq(administratorProfiles.userId, users.id),
      )
      .orderBy(users.email);
  }

  async createStudent(
    dto: CreateStudentDto,
    passwordHash: string,
  ): Promise<UserWithStudentProfile> {
    return this.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: dto.email,
          passwordHash,
          role: UserRole.STUDENT,
          whatsappPhone: dto.whatsappPhone ?? null,
        })
        .returning();

      const [profile] = await tx
        .insert(studentProfiles)
        .values({
          userId: user.id,
          name: dto.name,
          cpf: dto.cpf,
          rg: dto.rg,
          address: dto.address,
          cep: dto.cep,
          course: dto.course,
          institutionId: dto.institutionId,
        })
        .returning();

      return { user, profile };
    });
  }

  async createPartnerCompany(
    dto: CreatePartnerCompanyDto,
    passwordHash: string,
  ): Promise<UserWithPartnerCompanyProfile> {
    return this.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: dto.email,
          passwordHash,
          role: UserRole.PARTNER_COMPANY,
        })
        .returning();

      const [profile] = await tx
        .insert(partnerCompanyProfiles)
        .values({
          userId: user.id,
          cnpj: dto.cnpj,
          tradeName: dto.tradeName,
          address: dto.address,
          contactPhone: dto.contactPhone ?? null,
        })
        .returning();

      return { user, profile };
    });
  }

  async createProfessor(
    dto: CreateProfessorDto,
    passwordHash: string,
  ): Promise<UserWithProfessorProfile> {
    return this.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: dto.email,
          passwordHash,
          role: UserRole.PROFESSOR,
          coinBalance: SEMESTER_COIN_ALLOWANCE,
          whatsappPhone: dto.whatsappPhone ?? null,
        })
        .returning();

      const [profile] = await tx
        .insert(professorProfiles)
        .values({
          userId: user.id,
          name: dto.name,
          cpf: dto.cpf,
          department: dto.department,
          institutionId: dto.institutionId,
        })
        .returning();

      await tx.insert(professorSemesterAllowances).values({
        professorId: user.id,
        semesterCode: semesterCode(new Date()),
        amount: SEMESTER_COIN_ALLOWANCE,
      });

      return { user, profile };
    });
  }

  async createAdmin(
    dto: CreateAdminDto,
    passwordHash: string,
  ): Promise<UserWithAdministratorProfile> {
    return this.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: dto.email,
          passwordHash,
          role: UserRole.ADMIN,
        })
        .returning();

      const [profile] = await tx
        .insert(administratorProfiles)
        .values({ userId: user.id })
        .returning();

      return { user, profile };
    });
  }

  async update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<AuthenticatedUser | null> {
    const [user] = await this.db
      .update(users)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return user ?? null;
  }

  async updateStudentProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserWithStudentProfile | null> {
    const updates: Partial<typeof studentProfiles.$inferInsert> = {};

    if (dto.displayName !== undefined) updates.name = dto.displayName;
    if (dto.document !== undefined) updates.cpf = dto.document;
    if (dto.rg !== undefined) updates.rg = dto.rg;
    if (dto.address !== undefined) updates.address = dto.address;
    if (dto.cep !== undefined) updates.cep = dto.cep;
    if (dto.course !== undefined) updates.course = dto.course;
    if (dto.institutionId !== undefined) {
      updates.institutionId = dto.institutionId;
    }

    if (Object.keys(updates).length === 0) {
      return this.findStudentByUserId(userId);
    }

    return this.db.transaction(async (tx) => {
      const [profile] = await tx
        .update(studentProfiles)
        .set(updates)
        .where(eq(studentProfiles.userId, userId))
        .returning();

      if (!profile) {
        return null;
      }

      await tx
        .update(users)
        .set({ updatedAt: new Date() })
        .where(eq(users.id, userId));

      const [row] = await tx
        .select({ user: users, profile: studentProfiles })
        .from(users)
        .innerJoin(studentProfiles, eq(studentProfiles.userId, users.id))
        .where(eq(users.id, userId))
        .limit(1);

      return row ?? null;
    });
  }

  async updatePartnerCompanyProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserWithPartnerCompanyProfile | null> {
    const updates: Partial<typeof partnerCompanyProfiles.$inferInsert> = {};

    if (dto.displayName !== undefined) updates.tradeName = dto.displayName;
    if (dto.document !== undefined) updates.cnpj = dto.document;
    if (dto.address !== undefined) updates.address = dto.address;
    if (dto.contactPhone !== undefined) updates.contactPhone = dto.contactPhone;

    if (Object.keys(updates).length === 0) {
      return this.findPartnerCompanyByUserId(userId);
    }

    return this.db.transaction(async (tx) => {
      const [profile] = await tx
        .update(partnerCompanyProfiles)
        .set(updates)
        .where(eq(partnerCompanyProfiles.userId, userId))
        .returning();

      if (!profile) {
        return null;
      }

      await tx
        .update(users)
        .set({ updatedAt: new Date() })
        .where(eq(users.id, userId));

      const [row] = await tx
        .select({ user: users, profile: partnerCompanyProfiles })
        .from(users)
        .innerJoin(
          partnerCompanyProfiles,
          eq(partnerCompanyProfiles.userId, users.id),
        )
        .where(eq(users.id, userId))
        .limit(1);

      return row ?? null;
    });
  }

  async updateProfessorProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserWithProfessorProfile | null> {
    const updates: Partial<typeof professorProfiles.$inferInsert> = {};

    if (dto.displayName !== undefined) updates.name = dto.displayName;
    if (dto.document !== undefined) updates.cpf = dto.document;
    if (dto.department !== undefined) updates.department = dto.department;
    if (dto.institutionId !== undefined) {
      updates.institutionId = dto.institutionId;
    }

    if (Object.keys(updates).length === 0) {
      return this.findProfessorByUserId(userId);
    }

    return this.db.transaction(async (tx) => {
      const [profile] = await tx
        .update(professorProfiles)
        .set(updates)
        .where(eq(professorProfiles.userId, userId))
        .returning();

      if (!profile) {
        return null;
      }

      await tx
        .update(users)
        .set({ updatedAt: new Date() })
        .where(eq(users.id, userId));

      const [row] = await tx
        .select({ user: users, profile: professorProfiles })
        .from(users)
        .innerJoin(professorProfiles, eq(professorProfiles.userId, users.id))
        .where(eq(users.id, userId))
        .limit(1);

      return row ?? null;
    });
  }

  async delete(id: string): Promise<boolean> {
    const deletedUsers = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    return deletedUsers.length > 0;
  }

  async existsByEmail(email: string, ignoredUserId?: string): Promise<boolean> {
    const where = ignoredUserId
      ? and(eq(users.email, email), ne(users.id, ignoredUserId))
      : eq(users.email, email);
    const [user] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(where)
      .limit(1);
    return Boolean(user);
  }

  async countByInstitutionId(institutionId: string): Promise<number> {
    const [row] = await this.db.execute<{ total: number }>(
      sql`
        SELECT (
          (SELECT COUNT(*) FROM professor_profiles WHERE institution_id = ${institutionId}) +
          (SELECT COUNT(*) FROM student_profiles   WHERE institution_id = ${institutionId})
        )::int AS total
      `,
    );
    return row?.total ?? 0;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.db
      .update(users)
      .set({ passwordHash: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}
