import { pgTable, serial, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const volunteers = pgTable('volunteers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  vitEmail: varchar('vit_email', { length: 255 }).notNull(),
  prn: varchar('prn', { length: 50 }).notNull(),
  contact: varchar('contact', { length: 15 }).notNull(),
  campus: varchar('campus', { length: 50 }).notNull(),
  branch: varchar('branch', { length: 50 }).notNull(),
  division: varchar('division', { length: 10 }).notNull(),
  domains: jsonb('domains').notNull(), // Array of selected domains
  experience: text('experience').notNull(),
  newIdea: text('new_idea').notNull(),
  whyCSI: text('why_csi').notNull(),
  questions: text('questions'),
  additionalInfo: text('additional_info'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Volunteer = typeof volunteers.$inferSelect;
export type NewVolunteer = typeof volunteers.$inferInsert;