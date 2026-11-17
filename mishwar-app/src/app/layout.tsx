import type { Metadata } from "next";
import { Readex_Pro, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-readex",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "صَرْحِي | المنظومة السحابية لإدارة وتشغيل نقل الطالبات للمؤسسات المرخصة",
  description:
    "نظام B2B SaaS سحابي متكامل يمنح كل مؤسسة نقل موقعها المستقل لإدارة الحافلات والسائقين والاشتراكات والفوترة الضريبية ZATCA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn(
        "antialiased scroll-smooth",
        readexPro.variable,
        ibmPlexArabic.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="min-h-screen bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
