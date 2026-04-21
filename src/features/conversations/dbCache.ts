import { getGlobalTag, getIdTag, getLanguageInfoTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getConversationGlobalTag() {
  return getGlobalTag("conversations")
}

export function getConversationLanguageInfoTag(languageInfoId: string) {
  return getLanguageInfoTag("conversations", languageInfoId)
}

export function getConversationIdTag(id: string) {
  return getIdTag("conversations", id)
}

export function revalidateConversationCache({
  id,
  languageInfoId,
}: {
  id: string
  languageInfoId: string
}) {
  revalidateTag(getConversationGlobalTag())
  revalidateTag(getConversationLanguageInfoTag(languageInfoId))
  revalidateTag(getConversationIdTag(id))
}
