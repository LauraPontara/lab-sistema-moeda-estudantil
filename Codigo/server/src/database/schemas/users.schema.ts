import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { UserRole } from './user-role.enum';

export const userRoleEnum = pgEnum('user_role', [
  UserRole.STUDENT,
  UserRole.PARTNER_COMPANY,
  UserRole.PROFESSOR,
  UserRole.ADMIN,
]);

export const institutions = pgTable('institutions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 160 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 160 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  coinBalance: integer('coin_balance').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const studentProfiles = pgTable('student_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 160 }).notNull(),
  cpf: varchar('cpf', { length: 14 }).notNull().unique(),
  rg: varchar('rg', { length: 30 }).notNull(),
  address: text('address').notNull(),
  cep: varchar('cep', { length: 9 }).notNull(),
  course: varchar('course', { length: 120 }).notNull(),
  institutionId: uuid('institution_id')
    .notNull()
    .references(() => institutions.id),
});

export const partnerCompanyProfiles = pgTable('partner_company_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  cnpj: varchar('cnpj', { length: 18 }).notNull().unique(),
  tradeName: varchar('trade_name', { length: 160 }).notNull(),
  address: text('address').notNull(),
  contactPhone: varchar('contact_phone', { length: 30 }),
});

export const professorProfiles = pgTable('professor_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 160 }).notNull(),
  cpf: varchar('cpf', { length: 14 }).notNull().unique(),
  department: varchar('department', { length: 120 }).notNull(),
  institutionId: uuid('institution_id')
    .notNull()
    .references(() => institutions.id),
});

export const administratorProfiles = pgTable('administrator_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const coinTransfers = pgTable('coin_transfers', {
  id: uuid('id').defaultRandom().primaryKey(),
  professorId: uuid('professor_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const professorSemesterAllowances = pgTable(
  'professor_semester_allowances',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    professorId: uuid('professor_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    semesterCode: varchar('semester_code', { length: 8 }).notNull(),
    amount: integer('amount').notNull().default(1000),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    professorSemesterUnique: uniqueIndex(
      'professor_semester_allowances_professor_semester_unique',
    ).on(table.professorId, table.semesterCode),
  }),
);

export const userRelations = relations(users, ({ one }) => ({
  studentProfile: one(studentProfiles),
  partnerCompanyProfile: one(partnerCompanyProfiles),
  professorProfile: one(professorProfiles),
  administratorProfile: one(administratorProfiles),
}));

export const institutionRelations = relations(institutions, ({ many }) => ({
  studentProfiles: many(studentProfiles),
  professorProfiles: many(professorProfiles),
}));
