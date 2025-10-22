import { createdAt, id, updatedAt } from "../schemaHelpers";
import {  pgTable, varchar , uuid} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { LanguageInfoTable } from "./languageInfo";

export const ConversationTable = pgTable('conversations', {
    id: id,
    languageInfoId: uuid().references(() => LanguageInfoTable.id, { onDelete : 'cascade' }).notNull(),
    duration: varchar().notNull(),
    humeChatId: varchar(),
    feedback: varchar(),
    createdAt: createdAt,
    updatedAt: updatedAt,
 
});
 
export const conversationRelations = relations(ConversationTable, ({one}) => ({
    user: one(LanguageInfoTable, {
        fields: [ConversationTable.languageInfoId],
        references: [LanguageInfoTable.id],
    }),
}));