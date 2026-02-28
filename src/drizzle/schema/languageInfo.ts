import { createdAt, id, updatedAt } from "../schemaHelpers"
import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core"
import { UserTable } from "./user"
import { relations } from "drizzle-orm"
import { QuestionTable } from "./questions"
import { ConversationTable } from "./conversations"

export const experienceLevels = ["beginner", "intermediate", "advanced"] as const
export type ExperienceLevel = (typeof experienceLevels)[number]
export const experienceLevelEnum = pgEnum("language_info_experience_level", experienceLevels)

export const LanguageInfoTable = pgTable("language_info", {
  id: id,
  title: varchar(),
  name: varchar().notNull(),
  experienceLevel: experienceLevelEnum().notNull(),
  description: varchar().notNull(),
  userId: varchar()
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: createdAt,
  updatedAt: updatedAt,
})

export const languageInfoRelations = relations(LanguageInfoTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [LanguageInfoTable.userId],
    references: [UserTable.id],
  }),
  conversations: many(ConversationTable),
  questions: many(QuestionTable),
}))
