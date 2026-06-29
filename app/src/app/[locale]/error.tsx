"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/base";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-4">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold text-destructive">{t("title")}</h2>
      <p className="text-muted-foreground max-w-md">{t("message")}</p>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button onClick={() => reset()}>{t("retry")}</Button>
        <Button asChild variant="outline">
          <Link href="/">{t("home")}</Link>
        </Button>
      </div>
    </div>
  );
}