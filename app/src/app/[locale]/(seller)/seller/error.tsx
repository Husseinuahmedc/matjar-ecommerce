"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui"
import { AlertTriangle } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SellerError({ error, reset }: ErrorProps) {
  const t = useTranslations("errors")

  useEffect(() => {
    console.error("[Seller Error]", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-xl font-bold text-destructive">{t("title")}</h2>
      <p className="text-muted-foreground text-sm">{error.message || t("message")}</p>
      <div className="flex gap-3">
        <Button onClick={reset}>{t("retry")}</Button>
        <Button asChild variant="outline">
          <Link href="/seller/dashboard">{t("home")}</Link>
        </Button>
      </div>
    </div>
  )
}