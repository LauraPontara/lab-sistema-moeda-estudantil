import { Inject, Injectable } from '@nestjs/common';
import { and, eq, ne } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE_CONNECTION } from '../../database/database.constants';
import {
  administratorProfiles,
  partnerCompanyProfiles,
  professorProfiles,
  studentProfiles,
  UserRole,
  users,
} from '../../database/schemas';
import * as schema from '../../database/schemas';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { CreatePartnerCompanyDto } from '../dto/create-partner-company.dto';
import { CreateProfessorDto } from '../dto/create-professor.dto';
import { CreateStudentDto } from '../dto/create-student.dto';
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

  async findProfessors(): Promise<UserWithProfessorProfile[]> {
    return this.db
      .select({ user: users, profile: professorProfiles })
      .from(users)
      .innerJoin(professorProfiles, eq(professorProfiles.userId, users.id))
      .orderBy(professorProfiles.name);
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
          coinBalance: 1000,
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
}
