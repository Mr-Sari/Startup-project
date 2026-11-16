"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bus, ShieldCheck, ArrowLeft, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RegisterTenantPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [busesCount, setBusesCount] = useState("5");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col justify-between text-foreground">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">مشوار</span>
          </Link>
          <span className="text-xs text-muted-foreground">تسجيل مؤسسة نقل جديدة • تجربة 14 يوماً مجاناً</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 py-12 w-full">
        <Card className="shadow-xl border-border/80">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                14 يوم تجربة مجانية
              </Badge>
              <Badge variant="secondary">بدون بطاقة ائتمانية</Badge>
            </div>
            <CardTitle className="text-2xl font-black">أنشئ نظام مؤسستك وموقعك الخاص</CardTitle>
            <CardDescription className="text-xs">
              اختر رابط موقعك المستقل، وفعّل التحصيل الآلي وإدارة الأسطول بدقائق معدودة.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="orgName" className="text-xs font-bold">اسم مؤسسة النقل (كما في السجل)</Label>
                <Input
                  id="orgName"
                  required
                  placeholder="مثال: مؤسسة الفرسان لنقل الطالبات"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) {
                      setSlug("al-fursan");
                    }
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug" className="text-xs font-bold">الرابط الخاص بمؤسستك</Label>
                <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
                  <span className="px-3 text-xs text-muted-foreground font-mono dir-ltr select-none border-l bg-muted/30 h-9 flex items-center">
                    mishwar.sa/
                  </span>
                  <input
                    id="slug"
                    required
                    dir="ltr"
                    placeholder="al-fursan"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="flex-1 px-3 py-1.5 text-xs font-mono outline-none bg-transparent"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">هذا هو الرابط المباشر الذي ستفتحه الطالبات لحجز مقاعدهن وسداد الاشتراكات.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold">رقم جوال المسؤول (لإشعارات الإدارة)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="05XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-right font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="license" className="text-xs font-bold">رقم ترخيص هيئة النقل</Label>
                  <Input
                    id="license"
                    placeholder="مثال: 10452-نقل"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="buses" className="text-xs font-bold">عدد الحافلات الحالية في أسطولك</Label>
                <select
                  id="buses"
                  value={busesCount}
                  onChange={(e) => setBusesCount(e.target.value)}
                  className="w-full h-9 px-3 border border-input rounded-md text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="3">1 - 3 حافلات (باقة Basic)</option>
                  <option value="5">4 - 10 حافلات (باقة Pro)</option>
                  <option value="15">11 - 25 حافلة (باقة Pro المتقدمة)</option>
                  <option value="50">أكثر من 25 حافلة (Enterprise)</option>
                </select>
              </div>
            </CardContent>

            <CardFooter className="pt-2 flex flex-col gap-3">
              <Button type="submit" size="lg" className="w-full font-bold" disabled={isSubmitting}>
                {isSubmitting ? "جاري تهيئة موقع المؤسسة ولوحة الإدارة..." : "بدء التجربة المجانية الفورية (14 يوماً)"}
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>إلغاء في أي وقت • دعم فني سعودي متواصل • بدون أي اقتطاع عمولة</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t bg-card">
        نظام مشوار لإدارة نقل الطالبات • المملكة العربية السعودية © 2026
      </footer>
    </div>
  );
}
