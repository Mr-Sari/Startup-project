import type { Metadata } from "next";
import { Readex_Pro, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-readex",
});

export const metadata: Metadata = {
  title: "مشوار | منصة إدارة وتشغيل نقل الطالبات للمؤسسات المرخصة",
  description: "نظام سحابي متكامل يمنح كل مؤسسة نقل موقعها الخاص لإدارة الباصات والسائقين والاشتراكات وتنبيهات أولياء الأمور.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cn("antialiased", readexPro.variable, "font-sans", geist.variable)}>
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}
