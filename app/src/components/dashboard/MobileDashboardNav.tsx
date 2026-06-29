"use client";

import { useRouter } from "@/i18n/routing";
import Dock from "@/components/ui/reactbits/Dock";
import type { DockItemData } from "@/components/ui/reactbits/Dock";
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

export function MobileDashboardNav() {
  const t = useTranslations("dashboard");
  const router = useRouter();

  const items: DockItemData[] = [
    {
      icon: <LayoutDashboard className="h-6 w-6 text-white" />,
      label: t("sidebar.dashboard"),
      onClick: () => router.push("/buyer/dashboard"),
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
      label: t("sidebar.orders"),
      onClick: () => router.push("/orders"),
    },
    {
      icon: <Heart className="h-6 w-6 text-white" />,
      label: t("sidebar.wishlist"),
      onClick: () => router.push("/buyer/wishlist"),
    },
    {
      icon: <MapPin className="h-6 w-6 text-white" />,
      label: t("sidebar.addresses"),
      onClick: () => router.push("/buyer/addresses"),
    },
    {
      icon: <Settings className="h-6 w-6 text-white" />,
      label: t("sidebar.settings"),
      onClick: () => router.push("/buyer/settings"),
    },
    {
      icon: <LogOut className="h-6 w-6 text-red-400" />,
      label: t("sidebar.logout"),
      onClick: () => signOut(),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <Dock
        items={items}
        baseItemSize={44}
        magnification={60}
        distance={140}
        panelHeight={56}
        dockHeight={200}
        spring={{ mass: 0.1, stiffness: 160, damping: 14 }}
        className="bg-card/95 backdrop-blur-md border-t shadow-2xl"
      />
    </div>
  );
}
