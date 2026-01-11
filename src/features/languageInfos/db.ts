import { db } from "@/drizzle/db";
import { LanguageInfoTable } from "@/drizzle/schema";
import { revalidateLanguageInfoCache } from "./dbCache";
import { eq } from "drizzle-orm";

export async function insertLanguageInfo(languageInfo: typeof LanguageInfoTable.$inferInsert) {
    const [newLanguageInfo] = await db.insert(LanguageInfoTable).values(languageInfo).returning({
            id: LanguageInfoTable.id,
            userId: LanguageInfoTable.userId,
    })

    revalidateLanguageInfoCache(newLanguageInfo)

    return newLanguageInfo;
}

    


export async function updateLanguageInfo(id: string, languageInfo: Partial<typeof LanguageInfoTable.$inferInsert>) {
    const [updatedLanguageInfo] = await db.update(LanguageInfoTable).set(languageInfo).where(eq(LanguageInfoTable.id, id)).returning({
            id: LanguageInfoTable.id,
            userId: LanguageInfoTable.userId,
        })
    
    revalidateLanguageInfoCache(updatedLanguageInfo)
    
    return updatedLanguageInfo;
}