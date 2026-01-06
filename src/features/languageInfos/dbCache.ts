import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getLanguageInfoGlobalTag() {
    return getGlobalTag("users")
}

export function getLanguageInfoUserTag(userId: string) {
    return getUserTag("users", userId)
}

export function getLanguageInfoTag(id: string) {
    return getIdTag("users", id)
}

export function revalidateLanguageInfoCache(id: string, userId: string) {
    revalidateTag(getLanguageInfoGlobalTag())
    revalidateTag(getLanguageInfoUserTag(userId))
    revalidateTag(getLanguageInfoTag(id))
    
}