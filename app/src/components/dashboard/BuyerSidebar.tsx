"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { signOut } from "@/actions/auth";

interface BuyerSidebarProps {
  className?: string;
  onItemClick?: () => void;
}

const stagger = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" as const },
  }),
};

export function BuyerSidebar({ className, onItemClick }: BuyerSidebarProps) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  const routes = [
    {
      label: t("sidebar.dashboard"),
      icon: LayoutDashboard,
      href: "/buyer/dashboard",
      active: pathname.startsWith("/buyer/dashboard"),
    },
    {
      label: t("sidebar.orders"),
      icon: ShoppingBag,
      href: "/orders",
      active: pathname.startsWith("/orders"),
    },
    {
      label: t("sidebar.wishlist"),
      icon: Heart,
      href: "/buyer/wishlist",
      active: pathname.startsWith("/buyer/wishlist"),
    },
    {
      label: t("sidebar.addresses"),
      icon: MapPin,
      href: "/buyer/addresses",
      active: pathname.startsWith("/buyer/addresses"),
    },
    {
      label: t("sidebar.settings"),
      icon: Settings,
      href: "/buyer/settings",
      active: pathname.startsWith("/buyer/settings"),
    },
  ];

  return (
    <aside className={cn("flex w-64 flex-col border-r bg-card", className)}>
      <div className="flex-1 space-y-1 p-4">
        {routes.map((route, i) => (
          <motion.div
            key={route.href}
            custom={i}
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <Link
              href={route.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all relative overflow-hidden",
                route.active
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {route.active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <motion.span
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative z-10"
              >
                <route.icon
                  className={cn(
                    "h-4 w-4",
                    route.active ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </motion.span>
              <span className="relative z-10">{route.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="border-t p-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          onClick={() => {
            if (onItemClick) onItemClick();
            signOut();
          }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          {t("sidebar.logout")}
        </motion.button>
      </div>
    </aside>
  );
}
