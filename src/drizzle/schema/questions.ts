

import { createdAt, id, updatedAt } from "../schemaHelpers";
import {  pgEnum, pgTable, varchar , uuid} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { LanguageInfoTable } from "./languageInfo";

export const questionDifficulties = ['easy', 'medium', 'hard'] as const;
export type QuestionDifficulty = (typeof questionDifficulties)[number];
export const questionDifficultyEnum = pgEnum('questions_question_difficulty', questionDifficulties);

export const QuestionTable = pgTable('questions', {
    id: id,
    languageInfoId: uuid().references(() => LanguageInfoTable.id, { onDelete : 'cascade' }).notNull(),
    text: varchar().notNull(),
    difficulty: questionDifficultyEnum().notNull(),
    createdAt: createdAt,
    updatedAt: updatedAt,

});

export const questionsRelations = relations(QuestionTable, ({one}) => ({
    user: one(LanguageInfoTable, {
        fields: [QuestionTable.languageInfoId],
        references: [LanguageInfoTable.id],
    }),
}));