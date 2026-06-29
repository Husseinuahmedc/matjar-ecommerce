"use client";

import { useState } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, LogOut, LayoutDashboard } from "lucide-react";
import { signOut } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  userProfile?: {
    fullName: string;
    role: string;
  } | null;
  activeOrdersCount?: number;
  sellerNewOrdersCount?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRoleBadgeClass(role: string): string {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "SELLER":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "SUPPORT":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
}

function getRoleLabel(role: string, locale: string): string {
  if (locale !== "ar") return role.charAt(0) + role.slice(1).toLowerCase();
  switch (role) {
    case "ADMIN": return "مدير";
    case "SELLER": return "بائع";
    case "BUYER": return "مشتري";
    case "SUPPORT": return "دعم";
    default: return role;
  }
}

function getDashboardHref(role: string): string {
  switch (role) {
    case "ADMIN": return "/admin/dashboard";
    case "SELLER": return "/seller/dashboard";
    case "SUPPORT": return "/support/orders";
    case "BUYER": return "/buyer/dashboard";
    default: return "/buyer/dashboard";
  }
}

function getSellerNavLinks(locale: string) {
  const isAr = locale === "ar";
  return [
    { href: "/seller/dashboard", label: isAr ? "لوحة التحكم" : "Dashboard" },
    { href: "/seller/products", label: isAr ? "المنتجات" : "Products" },
    { href: "/seller/orders", label: isAr ? "الطلبات" : "Orders" },
  ];
}

export default function Navbar({ userProfile = null, activeOrdersCount = 0, sellerNewOrdersCount = 0 }: NavbarProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { itemCount, setIsOpen: setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const isSeller = userProfile?.role === "SELLER";

  const navLinks = isSeller
    ? getSellerNavLinks(locale)
    : [
        { href: "/", label: t("home") },
        { href: "/products", label: t("products") },
        ...(userProfile?.role === "BUYER"
          ? [{ href: "/orders", label: t("orders"), badge: activeOrdersCount }]
          : []),
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center"
            >
              <Image src="/logo.svg" alt="Logo" width={140} height={40} className="h-10 w-auto" priority />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-foreground/70"
                  }`}
                >
                  {link.label}
                  {"badge" in link && link.badge !== undefined && link.badge > 0 && (
                    <span className="absolute -top-2 -end-3 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-3xs font-bold leading-none bg-primary text-primary-foreground">
                      {link.badge > 99 ? "99+" : link.badge}
                    </span>
                  )}
                  {isSeller && link.href === "/seller/orders" && sellerNewOrdersCount > 0 && (
                    <span className="absolute -top-2 -end-3 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-3xs font-bold leading-none bg-primary text-primary-foreground">
                      {sellerNewOrdersCount > 99 ? "99+" : sellerNewOrdersCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-secondary transition-colors"
                aria-label="Language switch dropdown"
              >
                <span>{locale === "ar" ? "العربية" : "English"}</span>
                <svg
                  className={`h-4 w-4 transform transition-transform duration-200 ${
                    langOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute end-0 mt-2 w-28 rounded-md border border-border bg-card shadow-lg ring-1 ring-black/5 focus:outline-none z-10 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="py-1">
                    <Link
                      href={pathname}
                      locale="ar"
                      onClick={() => setLangOpen(false)}
                      className={`block w-full text-start px-4 py-2 text-sm hover:bg-secondary ${
                        locale === "ar" ? "text-primary font-semibold" : "text-foreground/70"
                      }`}
                    >
                      العربية
                    </Link>
                    <Link
                      href={pathname}
                      locale="en"
                      onClick={() => setLangOpen(false)}
                      className={`block w-full text-start px-4 py-2 text-sm hover:bg-secondary ${
                        locale === "en" ? "text-primary font-semibold" : "text-foreground/70"
                      }`}
                    >
                      English
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon — only for BUYER */}
            {!isSeller && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative rounded-full p-2 text-foreground/70 hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <span className="sr-only">{t("cart")}</span>
                <ShoppingBag className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute top-0 end-0 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-2xs font-bold leading-none bg-primary text-primary-foreground transform translate-x-1/2 -translate-y-1/2">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* User Dropdown */}
            {userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full p-0.5 pe-2 text-sm font-medium hover:bg-secondary transition-colors cursor-pointer outline-none">
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarFallback className="text-xs">
                        {getInitials(userProfile.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline text-foreground/80 text-xs font-medium">
                      {userProfile.fullName.split(" ")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium leading-none">{userProfile.fullName}</p>
                      <span className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getRoleBadgeClass(userProfile.role)}`}>
                        {getRoleLabel(userProfile.role, locale)}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={getDashboardHref(userProfile.role)}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {t("dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={signOut} className="w-full">
                      <button type="submit" className="flex w-full items-center gap-2 cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        {t("logout")}
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-primary px-3 py-2 transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-3">
            {!isSeller && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-foreground/70 hover:text-primary transition-colors cursor-pointer"
              >
                <ShoppingBag className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute top-1 end-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-3xs font-bold leading-none bg-primary text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-foreground/70 hover:bg-secondary hover:text-primary focus:outline-none transition-colors"
              aria-label="Toggle main menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-secondary text-primary"
                    : "text-foreground/70 hover:bg-secondary/50"
                }`}
              >
                {link.label}
                {"badge" in link && link.badge !== undefined && link.badge > 0 && (
                  <span className="inline-flex items-center justify-center ms-2 px-1.5 py-0.5 rounded-full text-2xs font-bold bg-primary text-primary-foreground">
                    {link.badge}
                  </span>
                )}
                {isSeller && link.href === "/seller/orders" && sellerNewOrdersCount > 0 && (
                  <span className="inline-flex items-center justify-center ms-2 px-1.5 py-0.5 rounded-full text-2xs font-bold bg-primary text-primary-foreground">
                    {sellerNewOrdersCount}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-foreground/60">
                {locale === "ar" ? "اللغة:" : "Language:"}
              </span>
              <div className="flex gap-2">
                <Link
                  href={pathname}
                  locale="ar"
                  onClick={() => setIsOpen(false)}
                  className={`text-sm px-2.5 py-1 rounded-md transition-colors ${
                    locale === "ar" ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary text-foreground/70"
                  }`}
                >
                  العربية
                </Link>
                <Link
                  href={pathname}
                  locale="en"
                  onClick={() => setIsOpen(false)}
                  className={`text-sm px-2.5 py-1 rounded-md transition-colors ${
                    locale === "en" ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary text-foreground/70"
                  }`}
                >
                  English
                </Link>
              </div>
            </div>

            {userProfile ? (
              <div className="mt-3 px-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground/80">
                      {userProfile.fullName}
                    </span>
                    <span className="text-xs text-foreground/50">
                      {getRoleLabel(userProfile.role, locale)}
                    </span>
                  </div>
                  <form action={signOut}>
                    <button type="submit" className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors cursor-pointer">
                      {t("logout")}
                    </button>
                  </form>
                </div>
                <Link
                  href={getDashboardHref(userProfile.role)}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center rounded-md bg-secondary py-2 text-sm font-medium hover:bg-secondary/80"
                >
                  {t("dashboard")}
                </Link>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 px-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-border text-center py-2 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md bg-primary text-primary-foreground text-center py-2 text-sm font-medium hover:bg-primary/95 transition-colors"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
