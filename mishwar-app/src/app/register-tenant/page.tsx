"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bus,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Phone,
  FileText,
  CreditCard,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function RegisterTenantPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("310");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("9665");
  const [supportPhone, setSupportPhone] = useState("05");
  const [iban, setIban] = useState("SA");
  const [city, setCity] = useState("الرياض");
  const [primaryColor, setPrimaryColor] = useState("#0F172A");
  const [monthlyFee, setMonthlyFee] = useState("650");
  const [districts, setDistricts] = useState("حي الياسمين، حي النرجس، حي الملقا");
  const [planTier, setPlanTier] = useState("pro");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/tenant-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "REGISTER_TENANT",
          payload: {
            name,
            slug,
            crNumber,
            vatNumber,
            licenseNumber,
            whatsappPhone,
            supportPhone,
            iban,
            city,
            primaryColor,
            monthlyFee: Number(monthlyFee),
            districts,
            planTier,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "حدث خطأ أثناء التسجيل");
        setIsSubmitting(false);
        return;
      }

      // Redirect directly to the newly created company's dashboard!
      router.push(`/dashboard?tenant=${data.tenant.slug}`);
    } catch {
      setErrorMsg("تعذر الاتصال بالخادم");
      setIsSubmitting(false);
    }
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
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              تأسيس موقع ونظام مؤسسة نقل جديدة
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">العودة للوحة الإدارة</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-10 w-full">
        <Card className="shadow-xl border-border/80">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                14 يوم تجربة مجانية
              </Badge>
              <Badge variant="secondary">إصدار فوري لموقع المؤسسة والفوترة الضريبية</Badge>
            </div>
            <CardTitle className="text-2xl font-black">
              تسجيل مؤسسة نقل جديدة وإعداد بياناتها الأساسية
            </CardTitle>
            <CardDescription className="text-xs">
              جميع البيانات المدخلة هنا (الرقم الضريبي، رقم الواتساب، السجل التجاري، وترخيص هيئة النقل) ستُعتمد تلقائياً في موقع مؤسستك وفي فواتير ZATCA وإشعارات أولياء الأمور.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive text-destructive text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              {/* Section 1: Identity & Slug */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-primary">
                  <Building2 className="w-4 h-4" />
                  <span>1. الهوية الرسمية والرابط الخاص بالمؤسسة</span>
                </div>
                <Separator />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="orgName" className="text-xs font-bold">
                      اسم المؤسسة / الشركة (كما في السجل التجاري) *
                    </Label>
                    <Input
                      id="orgName"
                      required
                      placeholder="مثال: شركة الفرسان للنقل الجامعي"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="slug" className="text-xs font-bold">
                      عنوان الموقع الخاص (Slug) *
                    </Label>
                    <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
                      <span className="px-2.5 text-xs text-muted-foreground font-mono dir-ltr select-none border-l bg-muted/30 h-9 flex items-center">
                        mishwar.sa/
                      </span>
                      <input
                        id="slug"
                        required
                        dir="ltr"
                        placeholder="al-fursan"
                        value={slug}
                        onChange={(e) =>
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                        }
                        className="flex-1 px-3 py-1.5 text-xs font-mono outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Legal, Tax (ZATCA) & TGA Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-primary">
                  <FileText className="w-4 h-4" />
                  <span>2. البيانات الضريبية والنظامية (للفوترة الإلكترونية ZATCA وهيئة النقل)</span>
                </div>
                <Separator />

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="vatNumber" className="text-xs font-bold">
                      الرقم الضريبي (15 رقماً - ZATCA) *
                    </Label>
                    <Input
                      id="vatNumber"
                      required
                      maxLength={15}
                      dir="ltr"
                      placeholder="310123456700003"
                      value={vatNumber}
                      onChange={(e) => setVatNumber(e.target.value)}
                      className="font-mono text-right"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="crNumber" className="text-xs font-bold">
                      رقم السجل التجاري (CR) *
                    </Label>
                    <Input
                      id="crNumber"
                      required
                      dir="ltr"
                      placeholder="1010XXXXXX"
                      value={crNumber}
                      onChange={(e) => setCrNumber(e.target.value)}
                      className="font-mono text-right"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="license" className="text-xs font-bold">
                      رقم ترخيص الهيئة العامة للنقل *
                    </Label>
                    <Input
                      id="license"
                      required
                      placeholder="ت-50231-نقل"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: WhatsApp & Contact & IBAN */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-primary">
                  <Phone className="w-4 h-4" />
                  <span>3. أرقام الواتساب والتواصل والحساب البنكي (IBAN)</span>
                </div>
                <Separator />

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp" className="text-xs font-bold">
                      رقم الواتساب الرسمي للمؤسسة *
                    </Label>
                    <Input
                      id="whatsapp"
                      required
                      dir="ltr"
                      placeholder="96650XXXXXXX"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      className="font-mono text-right"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="support" className="text-xs font-bold">
                      جوال خدمة العملاء والاتصال *
                    </Label>
                    <Input
                      id="support"
                      required
                      dir="ltr"
                      placeholder="05XXXXXXXX"
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      className="font-mono text-right"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="iban" className="text-xs font-bold">
                      رقم الآيبان البنكي للتحصيل (IBAN)
                    </Label>
                    <Input
                      id="iban"
                      dir="ltr"
                      placeholder="SA0000000000000000000000"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      className="font-mono text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Operations, Pricing, Districts & Brand Color */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-primary">
                  <Palette className="w-4 h-4" />
                  <span>4. إعدادات التسعير والأحياء المخدومة ولون الموقع</span>
                </div>
                <Separator />

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="monthlyFee" className="text-xs font-bold">
                      سعر الاشتراك الشهري للطالبة (ر.س) *
                    </Label>
                    <Input
                      id="monthlyFee"
                      type="number"
                      required
                      value={monthlyFee}
                      onChange={(e) => setMonthlyFee(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-bold">
                      المدينة
                    </Label>
                    <Input
                      id="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="color" className="text-xs font-bold">
                      لون هوية الموقع
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="color"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-9 rounded border cursor-pointer"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="font-mono text-xs dir-ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="districts" className="text-xs font-bold">
                    الأحياء المخدومة (افصل بينها بفاصلة) *
                  </Label>
                  <Input
                    id="districts"
                    required
                    placeholder="حي الياسمين، حي النرجس، حي الملقا، حي الصحافة"
                    value={districts}
                    onChange={(e) => setDistricts(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-4 flex flex-col gap-3">
              <Button type="submit" size="lg" className="w-full font-bold" disabled={isSubmitting}>
                {isSubmitting
                  ? "جاري إنشاء موقع المؤسسة وتجهيز الفوترة الضريبية..."
                  : "اعتماد وإنشاء موقع المؤسسة والانتقال للوحة التحكم"}
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>يمكنك تعديل جميع هذه البيانات لاحقاً من داخل قسم «بيانات وإعدادات المؤسسة» في الداشبورد</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t bg-card">
        منظومة صَرْحِي (Sarhy) لإدارة نقل الطالبات • المملكة العربية السعودية © 2026
      </footer>
    </div>
  );
}
