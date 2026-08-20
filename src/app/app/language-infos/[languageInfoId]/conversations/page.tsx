import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { ConversationTable } from "@/drizzle/schema"
import { getConversationLanguageInfoTag } from "@/features/conversations/dbCache"
import { LanguageInfoBackLink } from "@/features/languageInfos/components/LanguageInfoBackLink"
import { getLanguageInfoTag } from "@/features/languageInfos/dbCache"
import { formatDateTime } from "@/lib/formatters"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { and, desc, eq, isNotNull } from "drizzle-orm"
import { ArrowRightIcon, Loader2, PlusIcon } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import Link from "next/link"
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
  return (
    <div className="space-y-6 w-full">
      <div className="flex gap-2 justify-between">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">Conversations</h1>
        <Button asChild>
          <Link href="{`/app/language-infos/${languageInfoId}/conversations/new`}">
            <PlusIcon />
            New Conversation
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 has-hover:*:not-hover:opacity-70">
        <Link href={`/app/language-infos/${languageInfoId}/conversations/new`}>
          <Card className="h-full items-center justify-center border-dashed border-3 bg-transparent hover:border-primary/50 transition-colors shadow-none ">
            <div className="flex text-lg items-center justify-center gap-2">
              <PlusIcon className="size-6" />
              New Conversation
            </div>
          </Card>
        </Link>
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/app/language-infos/${languageInfoId}/conversations/${conversation.id}`}
            className="hover:scale-[1.02] transition-[transform_opacity]"
          >
            <Card className="h-full">
              <div className="flex items-center justify-between h-full">
                <CardHeader className="gap-1 flex-grow">
                  <CardTitle className="text-lg truncate">
                    {formatDateTime(conversation.createdAt)}
                  </CardTitle>
                  <CardDescription>{conversation.duration}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ArrowRightIcon className="size-6" />
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
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
