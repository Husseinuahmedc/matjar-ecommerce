"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui"
import { AlertTriangle } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BuyerError({ error, reset }: ErrorProps) {
  const t = useTranslations("errors")

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-xl font-bold text-destructive">{t("title")}</h2>
      <p className="text-muted-foreground text-sm max-w-md text-center">{error.message || t("message")}</p>
      <div className="flex gap-3">
        <Button onClick={reset}>{t("retry")}</Button>
        <Button asChild variant="outline">
          <Link href="/buyer/dashboard">{t("home")}</Link>
        </Button>
      </div>
    </div>
  )
}