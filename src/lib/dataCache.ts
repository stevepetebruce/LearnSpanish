type CacheTag = "users" | "languageInfo" | "conversations" | "questions"

export function getGlobalTag(tag: CacheTag) {
  return `global-${tag}` as const
}

export function getUserTag(tag: CacheTag, userId: string) {
  return `user:${userId}:${tag}` as const
}

export function getLanguageInfoTag(tag: CacheTag, languageInfoId: string) {
  return `languageInfo:${languageInfoId}:${tag}` as const
}

export function getIdTag(tag: CacheTag, id: string) {
  return `id:${id}:${tag}` as const
}
