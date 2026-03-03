import { Card, CardContent } from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { LanguageInfoTable } from "@/drizzle/schema/languageInfo"
import { LanguageInfoBackLink } from "@/features/languageInfos/components/LanguageInfoBackLink"
import { LanguageInfoForm } from "@/features/languageInfos/components/LanguageInfoForm"
import { getLanguageInfoTag } from "@/features/languageInfos/dbCache"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser"
import { and, eq } from "drizzle-orm"
import { Loader2 } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default async function LanguageInfoEditPage({
  params,
}: {
  params: Promise<{ languageInfoId: string }>
}) {
  const { languageInfoId } = await params
  return (
    <div className="container my-4 max-w-5xl space-y-4">
      <LanguageInfoBackLink languageInfoId={languageInfoId} />
      <h1 className="text-3xl md:text-4xl">Edit Language Description</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<Loader2 className="animate-spin size-24 mx-auto" />}>
            <SuspendedForm languageInfoId={languageInfoId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

async function SuspendedForm({ languageInfoId }: { languageInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser()
  if (userId == null) {
    return redirectToSignIn()
  }
  const languageInfo = await getLanguageInfo(languageInfoId, userId)
  if (languageInfo == null) {
    return notFound()
  }
  return <LanguageInfoForm languageInfo={languageInfo} />
}

async function getLanguageInfo(id: string, userId: string) {
  "use cache"
  cacheTag(getLanguageInfoTag(id))
  return db.query.LanguageInfoTable.findFirst({
    where: and(eq(LanguageInfoTable.id, id), eq(LanguageInfoTable.userId, userId)),
  })
}
