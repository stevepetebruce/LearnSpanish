"use server"

import { db } from "@/drizzle/db";
import { LanguageInfoTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { getLanguageInfoTag } from "./dbCache";
import { redirect } from "next/navigation"
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { languageInfoSchema } from "./schemas";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { insertLanguageInfo, updateLanguageInfo as updateLanguageInfoDb } from "./db";

export async function createLanguageInfo(unsafeData: z.infer<typeof languageInfoSchema>) {
    const { userId } = await getCurrentUser();
    if (userId == null ) {
        return { error: true, message: "User not authenticated" };
    }

    const {success, data} = languageInfoSchema.safeParse(unsafeData);
    if (!success) {
        return { error: true, message: "Invalid job data" };
    }

    const languageInfo = await insertLanguageInfo({...data, userId});
    
    redirect(`/app/language-infos/${languageInfo.id}`);
}

export async function updateLanguageInfo(id: string, unsafeData: z.infer<typeof languageInfoSchema> ) {
    const { userId } = await getCurrentUser();

    if (userId == null) {
        return { error: true, message: "User not authenticated" };
    }

    const {success, data} = languageInfoSchema.safeParse(unsafeData);
    if (!success) {
        return { error: true, message: "Invalid job data" };
    }

    const existingLanguageInfo = await getLanguageInfo(id, userId);
    if(existingLanguageInfo == null) {
        return { error: true, message: "You do not have permission to update this language info" };
    }

    const languageInfo = await updateLanguageInfoDb(id, data);
    
    redirect(`/app/language-infos/${languageInfo.id}`);
}

async function getLanguageInfo(id: string, userId: string  ) {
    "use cache"
    cacheTag(getLanguageInfoTag(id))
    return db.query.LanguageInfoTable.findFirst({
        where: and(eq(LanguageInfoTable.id, id), eq(LanguageInfoTable.userId, userId))
    })
}
