import { db } from "@/drizzle/db"
import { ConversationTable } from "@/drizzle/schema"
import { revalidateConversationCache } from "./dbCache"
import { eq } from "drizzle-orm"

export async function insertConversation(conversation: typeof ConversationTable.$inferInsert) {
  const [newConversation] = await db
    .insert(ConversationTable)
    .values(conversation)
    .returning({ id: ConversationTable.id, languageInfoId: ConversationTable.languageInfoId })

  revalidateConversationCache(newConversation)

  return newConversation
}

export async function updateConversation(
  id: string,
  conversation: Partial<typeof ConversationTable.$inferInsert>
) {
  const [newConversation] = await db
    .update(ConversationTable)
    .set(conversation)
    .where(eq(ConversationTable.id, id))
    .returning({ id: ConversationTable.id, languageInfoId: ConversationTable.languageInfoId })

  revalidateConversationCache(newConversation)

  return newConversation
}
