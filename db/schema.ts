import {
  pgTable, serial, bigserial, integer, bigint, smallint, real,
  text, boolean, uuid, timestamp, index, uniqueIndex,
} from 'drizzle-orm/pg-core';

const ts = (name: string) => timestamp(name, { withTimezone: true });

export const phrases = pgTable('phrases', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  triggers: text('triggers').array().notNull(),
  keywords: text('keywords').array().notNull(),
  category: text('category').notNull(),
  meaning: text('meaning').notNull(),
  question: text('question').notNull(),
  reply: text('reply').notNull(),
  risk: text('risk').notNull(), // low | medium | high
  active: boolean('active').notNull().default(true),
  createdAt: ts('created_at').notNull().defaultNow(),
  updatedAt: ts('updated_at').notNull().defaultNow(),
});

export const translations = pgTable('translations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sessionId: uuid('session_id').notNull(),
  inputText: text('input_text').notNull(),
  phraseId: integer('phrase_id').references(() => phrases.id, { onDelete: 'set null' }),
  confidence: real('confidence'),
  createdAt: ts('created_at').notNull().defaultNow(),
}, (t) => [
  index('translations_created_at_idx').on(t.createdAt),
  index('translations_phrase_id_idx').on(t.phraseId),
]);

export const feedback = pgTable('feedback', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  translationId: bigint('translation_id', { mode: 'number' })
    .notNull().references(() => translations.id, { onDelete: 'cascade' }),
  vote: smallint('vote').notNull(), // 1 | -1
  createdAt: ts('created_at').notNull().defaultNow(),
}, (t) => [
  uniqueIndex('feedback_translation_id_uq').on(t.translationId),
]);

export const suggestions = pgTable('suggestions', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  email: text('email'),
  status: text('status').notNull().default('new'), // new | added | rejected
  createdAt: ts('created_at').notNull().defaultNow(),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  source: text('source').notNull(), // bar | library
  consentAt: ts('consent_at').notNull(),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  unsubscribedAt: ts('unsubscribed_at'),
  createdAt: ts('created_at').notNull().defaultNow(),
});

export const counters = pgTable('counters', {
  key: text('key').primaryKey(),
  value: bigint('value', { mode: 'number' }).notNull().default(0),
});
