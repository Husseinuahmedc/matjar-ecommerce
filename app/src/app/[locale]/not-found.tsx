import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6">
      <div className="text-8xl font-extrabold text-muted-foreground/20">404</div>
      <h1 className="text-3xl font-bold text-foreground">
        {t("title")}
      </h1>
      <p className="text-muted-foreground max-w-md text-lg">
        {t("message")}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
        >
          {t("home")}
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-lg border px-6 py-3 text-sm font-bold text-foreground shadow-sm hover:bg-secondary transition-all"
        >
          {t("browseProducts")}
        </Link>
      </div>
    </div>
  );
}