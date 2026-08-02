"use server"

import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getLanguageInfoTag } from "../languageInfos/dbCache"
import { ConversationTable, LanguageInfoTable } from "@/drizzle/schema"
import { db } from "@/drizzle/db"
import { and, eq } from "drizzle-orm"
import { insertConversation, updateConversation as updateConversationDb } from "./db"
import { getConversationIdTag } from "./dbCache"

export async function createConversation({
  languageInfoId,
}: {
  languageInfoId: string
}): Promise<{ error: true; message?: string } | { error: false; id: string }> {
  const { userId } = await getCurrentUser()
  if (userId == null) {
    return { error: true, message: "You don't have permission." }
  }
  // TODO: permissions
  // TODO:Rate limit
  // language info
  const languageInfo = await getLanguageInfo(languageInfoId, userId)
  if (languageInfo == null) {
    return { error: true, message: "You don't have permission." }
  }

  // create conversation in the databse
  const conversation = await insertConversation({ languageInfoId, duration: "00:00:00" })

  return { error: false, id: conversation.id }
}

export async function updateConversation(
  id: string,
  data: { humeChatId?: string; duration?: string }
) {
  const { userId } = await getCurrentUser()
  if (userId == null) {
    return { error: true, message: "You don't have permission." }
  }
  const conversation = await getConversation(id, userId)

  if (conversation == null) {
    return { error: true, message: "You don't have permission." }
  }

  // TODO: permissions
  // TODO:Rate limit
  // update conversation in the database
  // Assuming you have a function updateConversationInDb to handle the actual update
  await updateConversationDb(id, data)

  return { error: false }
}

//const { userId } = await getCurrentUser()

async function getLanguageInfo(id: string, userId: string) {
  "use cache"
  cacheTag(getLanguageInfoTag(id))
  return db.query.LanguageInfoTable.findFirst({
    where: and(eq(LanguageInfoTable.id, id), eq(LanguageInfoTable.userId, userId)),
  })
}

async function getConversation(id: string, userId: string) {
  "use cache"
  cacheTag(getConversationIdTag(id))
  const conversation = await db.query.ConversationTable.findFirst({
    where: eq(ConversationTable.id, id),
    with: { languageInfo: { columns: { id: true, userId: true } } },
  })

  if (conversation == null) return null

  cacheTag(getLanguageInfoTag(conversation.languageInfo.id))

  if (conversation.languageInfo.userId !== userId) {
    return null
  }

  return conversation
}
