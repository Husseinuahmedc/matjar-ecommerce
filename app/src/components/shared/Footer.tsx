import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

/**
 * Premium, fully responsive, RTL-aware Footer.
 * Works seamlessly in both Arabic (RTL) and English (LTR).
 * Uses CSS logical properties (pe-X, text-start) for layout alignment.
 */
export default function Footer() {
  const t = useTranslations("nav");
  const common = useTranslations("common");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-card py-12 text-foreground/80 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-primary"
            >
              {common("appName")}
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              منصة متكاملة للتسوق الإلكتروني وبيع المنتجات من مختلف المتاجر المحلية بجودة وأمان.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              {t("home")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("products")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Services */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              الدعم والمساعدة
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                  الشروط والأحكام
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                  سياسة الخصوصية
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                  تواصل معنا
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              اشترك في النشرة البريدية
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Subscribe to newsletter email field"
              />
              <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/95 transition-colors">
                اشترك
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {currentYear} {common("appName")}. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
