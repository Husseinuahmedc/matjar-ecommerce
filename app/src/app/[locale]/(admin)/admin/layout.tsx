import AdminSidebar from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen bg-background" dir={locale === "ar" ? "rtl" : "ltr"}>
      <AdminSidebar locale={locale} />
      <main className="flex-1 overflow-auto p-4 pt-20 md:p-8 md:pt-8">
        {children}
      </main>
      <Toaster position={locale === "ar" ? "top-left" : "top-right"} richColors />
    </div>
  );
}
