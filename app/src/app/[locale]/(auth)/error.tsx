"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui"
import { AlertTriangle } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AuthError({ error, reset }: ErrorProps) {
  const t = useTranslations("errors")

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 p-8 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-xl font-bold text-destructive">{t("title")}</h2>
      <p className="text-muted-foreground text-sm">{error.message || t("message")}</p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>{t("retry")}</Button>
        <Button asChild variant="outline">
          <Link href="/">{t("home")}</Link>
        </Button>
      </div>
    </div>
  )
}