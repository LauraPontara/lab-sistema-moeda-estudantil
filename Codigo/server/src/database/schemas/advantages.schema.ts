import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const ADVANTAGE_CATEGORIES = [
  'ALIMENTACAO',
  'EDUCACAO',
  'MATERIAL',
  'LAZER',
  'SERVICOS',
  'OUTROS',
] as const;

export type AdvantageCategory = (typeof ADVANTAGE_CATEGORIES)[number];

export const advantageCategoryEnum = pgEnum(
  'advantage_category',
  ADVANTAGE_CATEGORIES,
);

export const advantages = pgTable('advantages', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 160 }).notNull(),
  description: text('description').notNull(),
  category: advantageCategoryEnum('category').notNull(),
  icon: varchar('icon', { length: 60 }).notNull(),
  costXp: integer('cost_xp').notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const advantageRedemptions = pgTable('advantage_redemptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  advantageId: uuid('advantage_id')
    .notNull()
    .references(() => advantages.id),
  studentId: uuid('student_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  couponCode: varchar('coupon_code', { length: 16 }).notNull().unique(),
  xpSpent: integer('xp_spent').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const advantageRelations = relations(advantages, ({ one, many }) => ({
  company: one(users, {
    fields: [advantages.companyId],
    references: [users.id],
  }),
  redemptions: many(advantageRedemptions),
}));
