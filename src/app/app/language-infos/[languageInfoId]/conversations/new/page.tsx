import { db } from "@/drizzle/db"
import { LanguageInfoTable } from "@/drizzle/schema"
import { getLanguageInfoTag } from "@/features/languageInfos/dbCache"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { and, eq } from "drizzle-orm"
import { get } from "http"
import { Loader2Icon } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default async function NewConversationPage({
  params,
}: {
  params: Promise<{ languageInfoId: string }>
}) {
  const { languageInfoId } = await params
  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      }
    >
      <SuspendedComponent languageInfoId={languageInfoId} />
    </Suspense>
  )
}

async function SuspendedComponent({ languageInfoId }: { languageInfoId: string }) {
  const { userId, redirectToSignIn, user } = await getCurrentUser({ allData: true })
  if (userId == null || user == null) {
    return redirectToSignIn()
  }
  const languageInfo = await getLanguageInfo(languageInfoId, userId)
  if (languageInfo == null) return notFound()
}

async function getLanguageInfo(id: string, userId: string) {
  "use cache"
  cacheTag(getLanguageInfoTag(id))

  return db.query.LanguageInfoTable.findFirst({
    where: and(eq(LanguageInfoTable.id, id), eq(LanguageInfoTable.userId, userId)),
  })
}
