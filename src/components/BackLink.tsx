import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export function BackLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Button variant="ghost" asChild size="sm" className={cn("-ml-3", className)}>
      <Link href={href} className="flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeftIcon />
        {children}
      </Link>
    </Button>
  )
}
