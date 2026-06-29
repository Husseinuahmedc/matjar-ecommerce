import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface BuyerLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function BuyerLayout({ children }: BuyerLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        userProfile={{ fullName: "Demo User", role: "BUYER" }}
        activeOrdersCount={2}
      />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
