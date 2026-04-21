import { db } from "@/drizzle/db"
import { ConversationTable } from "@/drizzle/schema"
import { getConversationLanguageInfoTag } from "@/features/conversations/dbCache"
import { LanguageInfoBackLink } from "@/features/languageInfos/components/LanguageInfoBackLink"
import { getLanguageInfoTag } from "@/features/languageInfos/dbCache"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { and, desc, eq, isNotNull } from "drizzle-orm"
import { Loader2 } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { redirect } from "next/navigation"
import { cache, Suspense } from "react"

export default async function ConversationsPage({
  params,
}: {
  params: Promise<{ languageInfoId: string }>
}) {
  const { languageInfoId } = await params
  return (
    <div className="container py-4 gap-4 h-screen-header flex flex-col items-start">
      <LanguageInfoBackLink languageInfoId={languageInfoId} />

      <Suspense fallback={<Loader2 className="animate-spin size-24 m-auto" />}>
        <SuspendedPage languageInfoId={languageInfoId} />
      </Suspense>
    </div>
  )
}

async function SuspendedPage({ languageInfoId }: { languageInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser()
  if (userId == null) {
    return redirectToSignIn()
  }
  const conversations = await getConversations(languageInfoId, userId)
  if (conversations.length === 0) {
    return redirect(`/app/language-infos/${languageInfoId}/conversations/new`)
  }
  return <div>Conversations for {languageInfoId}</div>
}

async function getConversations(languageInfoId: string, userId: string) {
  "use cache"
  cacheTag(getConversationLanguageInfoTag(languageInfoId))
  cacheTag(getLanguageInfoTag(languageInfoId))

  const data = await db.query.ConversationTable.findMany({
    where: and(
      eq(ConversationTable.languageInfoId, languageInfoId),
      isNotNull(ConversationTable.humeChatId)
    ),
    with: { languageInfo: { columns: { userId: true } } },
    orderBy: desc(ConversationTable.updatedAt),
  })

  return data.filter((conversation) => conversation.languageInfo.userId === userId)
}
