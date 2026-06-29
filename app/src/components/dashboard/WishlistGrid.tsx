"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button, Card, CardContent } from "@/components/ui/base";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    titleEn: string;
    titleAr: string;
    slug: string;
    price: number | string | { toNumber(): number };
    images: { url: string }[];
  };
}

interface WishlistGridProps {
  items: WishlistItem[];
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.3, ease: "easeOut" as const },
  }),
};

export function WishlistGrid({ items }: WishlistGridProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center p-6"
      >
        <p className="text-sm text-muted-foreground">{t("emptyWishlist")}</p>
        <Button asChild variant="link">
          <Link href="/products">{t("browseProducts")}</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.1)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="overflow-hidden h-full">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <Image
                src={item.product.images[0]?.url || "/images/placeholder.svg"}
                alt={locale === "ar" ? item.product.titleAr : item.product.titleEn}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="line-clamp-1 font-semibold text-sm">
                {locale === "ar" ? item.product.titleAr : item.product.titleEn}
              </h4>
              <p className="mt-1 font-bold text-primary">
                {formatPrice(Number(item.product.price))}
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1 gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-xs">{t("addToCart")}</span>
                </Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
