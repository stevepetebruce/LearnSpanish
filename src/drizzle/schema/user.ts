
import { pgTable, varchar } from "drizzle-orm/pg-core";
import{createdAt, updatedAt} from '../schemaHelpers';
import { relations } from "drizzle-orm";
import { LanguageInfoTable } from "./languageInfo";

export const UserTable = pgTable("users", {
    id: varchar("id").primaryKey(),
    email: varchar("email").notNull().unique(),
    name: varchar("name").notNull(),
    imageURL: varchar("image_url").notNull(),
    createdAt,
    updatedAt
});

export const UserRelations = relations(UserTable, ({ many }) => ({
    languageInfos: many(LanguageInfoTable),
}));