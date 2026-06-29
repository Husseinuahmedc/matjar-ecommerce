"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button, Card, CardContent } from "@/components/ui/base";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { ShoppingCart, Star } from "lucide-react";
import { useLocale } from "next-intl";

interface Product {
  id: string;
  titleEn: string;
  titleAr: string;
  slug: string;
  price: number | string | { toNumber(): number };
  images: { url: string }[];
  category: {
    nameEn: string;
    nameAr: string;
  };
}

interface RecommendationsGridProps {
  products: Product[];
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.35, ease: "easeOut" as const },
  }),
};

export function RecommendationsGrid({ products }: RecommendationsGridProps) {
  const locale = useLocale();

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.1)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="overflow-hidden h-full flex flex-col">
            <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
              <Image
                src={product.images[0]?.url || "/images/placeholder.svg"}
                alt={locale === "ar" ? product.titleAr : product.titleEn}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <CardContent className="p-4 flex flex-col flex-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                {locale === "ar" ? product.category.nameAr : product.category.nameEn}
              </p>
              <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                <h4 className="line-clamp-1 font-semibold text-sm">
                  {locale === "ar" ? product.titleAr : product.titleEn}
                </h4>
              </Link>

              <div className="mt-1 flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-muted-foreground">4.5</span>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between">
                <p className="font-bold text-primary">
                  {formatPrice(Number(product.price))}
                </p>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
