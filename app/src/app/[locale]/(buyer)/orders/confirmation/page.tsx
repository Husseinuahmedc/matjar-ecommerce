import React from "react";
import { Link } from "@/i18n/routing";
import { CheckCircle2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تأكيد الطلب | Order Confirmed",
};

export default async function OrderConfirmationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-8">
        <CheckCircle2 className="h-20 w-20 text-primary animate-in zoom-in duration-500" />
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">
        {locale === "ar" ? "تم استلام طلبك بنجاح!" : "Order Received!"}
      </h1>
      
      <p className="text-xl text-muted-foreground mb-12 max-w-lg">
        {locale === "ar" 
          ? "شكراً لتسوقك معنا. تم إنشاء طلبك وهو الآن قيد المراجعة. ستتلقى تحديثاً عبر الواتساب قريباً."
          : "Thank you for your purchase. Your order has been placed successfully and is being processed. You will receive a WhatsApp update shortly."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/orders">
          <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-primary/90 transition-all w-full sm:w-auto">
            <ShoppingBag className="h-5 w-5" />
            {locale === "ar" ? "عرض طلباتي" : "View My Orders"}
          </button>
        </Link>
        <Link href="/products">
          <button className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-bold py-3 px-8 rounded-lg shadow hover:bg-secondary/80 transition-all w-full sm:w-auto">
            {locale === "ar" ? "العودة للتسوق" : "Back to Shopping"}
            {locale === "ar" ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </button>
        </Link>
      </div>
    </div>
  );
}
