import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
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
