import { BackLink } from "@/components/BackLink"
import { db } from "@/drizzle/db"
import { LanguageInfoTable } from "@/drizzle/schema"
import { cn } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { Suspense } from "react"
import { getLanguageInfoTag } from "../dbCache"

export function LanguageInfoBackLink({
  languageInfoId,
  className,
}: {
  languageInfoId: string
  className?: string
}) {
  return (
    <BackLink href={`/app/language-infos/${languageInfoId}`} className={cn("mb-4", className)}>
      <Suspense fallback="Language Description">
        <LanguageName languageInfoId={languageInfoId} />{" "}
      </Suspense>
    </BackLink>
  )
}

async function LanguageName({ languageInfoId }: { languageInfoId: string }) {
  const languageInfo = await getLanguageInfo(languageInfoId)
  return languageInfo?.name ?? "Language Description"
}

async function getLanguageInfo(id: string) {
  "use cache"
  cacheTag(getLanguageInfoTag(id))
  return db.query.LanguageInfoTable.findFirst({
    where: eq(LanguageInfoTable.id, id),
  })
}
