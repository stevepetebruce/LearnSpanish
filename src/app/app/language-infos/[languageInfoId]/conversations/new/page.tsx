import { Loader2Icon } from "lucide-react"
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
  return <div>New Conversation Form for {languageInfoId}</div>
}
