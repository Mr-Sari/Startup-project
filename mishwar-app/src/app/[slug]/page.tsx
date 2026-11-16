"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import {
  Bus,
  ShieldCheck,
  Phone,
  CreditCard,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Loader2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ZatcaQrImage } from "@/components/zatca-qr-image";
import type { TenantProfile } from "@/lib/db";

interface IssuedInvoice {
  invoiceNo: string;
  sellerName: string;
  vatRegistrationNumber: string;
  whatsappPhone: string;
  netAmount: number;
  vatAmount: number;
  totalAmount: number;
  zatcaQrBase64: string;
  issuedAt: string;
}

function BookingContent() {
  const params = useParams();
  const slug = (params?.slug as string) || "darb-alaman";

  const [tenant, setTenant] = useState<TenantProfile | null>(null);
  const [step, setStep] = useState<"form" | "otp" | "payment" | "success">("form");
  const [phone, setPhone] = useState("");
  const [studentName, setStudentName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [university, setUniversity] = useState("جامعة الأميرة نورة بنت عبدالرحمن");
  const [period, setPeriod] = useState<"monthly" | "term">("monthly");
  const [otpCode, setOtpCode] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [issuedInvoice, setIssuedInvoice] = useState<IssuedInvoice | null>(null);

  useEffect(() => {
    fetch(`/api/tenant-data?tenant=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tenant) {
          setTenant(data.tenant);
          setDistrict(data.tenant.districts?.[0] || "حي الياسمين");
        }
      });
  }, [slug]);

  if (!tenant) {
    return (
      <div className="p-16 text-center font-bold text-muted-foreground">
        جاري تحميل الموقع الرسمي للمؤسسة...
      </div>
    );
  }

  const price = period === "monthly" ? tenant.monthlyFee : Math.round(tenant.monthlyFee * 3.5);

  const handleCheckout = async (paymentMethod: "applepay" | "mada") => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug: tenant.slug,
          studentName,
          phone,
          guardianPhone,
          district,
          university,
          amount: price,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setIssuedInvoice(data.invoice);
        setStep("success");
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Official Tenant Branded Top Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl text-white flex items-center justify-center font-bold text-base shadow-xs"
              style={{ backgroundColor: tenant.primaryColor || "#0F172A" }}
            >
              <Bus className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold">{tenant.name}</h1>
              <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ترخيص: {tenant.licenseNumber}</span>
                </span>
                <span>•</span>
                <span className="font-mono text-[11px]">الرقم الضريبي: {tenant.vatNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://wa.me/${tenant.whatsappPhone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب المؤسسة</span>
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <a href={`tel:${tenant.supportPhone}`} className="gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-mono dir-ltr">{tenant.supportPhone}</span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-xl mx-auto px-4 py-12 flex-1 w-full">
        {step === "form" && (
          <Card className="shadow-lg border-border/80">
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2 text-xs">
                حجز مقعد • {tenant.city}
              </Badge>
              <CardTitle className="text-2xl font-black">طلب اشتراك نقل جامعي</CardTitle>
              <CardDescription className="text-xs">
                التسجيل مباشر لدى <strong>{tenant.name}</strong> (سجل تجاري: {tenant.crNumber}).
              </CardDescription>
            </CardHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("otp");
              }}
            >
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="studentName" className="text-xs font-bold">
                    اسم الطالبة الثلاثي
                  </Label>
                  <Input
                    id="studentName"
                    required
                    placeholder="مثال: ريم فهد القحطاني"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold">
                      رقم جوال الطالبة
                    </Label>
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
                    <Label htmlFor="guardianPhone" className="text-xs font-bold">
                      جوال ولي الأمر (لإشعارات الصعود)
                    </Label>
                    <Input
                      id="guardianPhone"
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="05XXXXXXXX"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="text-right font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="university" className="text-xs font-bold">
                    الجامعة أو الكلية
                  </Label>
                  <select
                    id="university"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full h-9 px-3 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="جامعة الأميرة نورة بنت عبدالرحمن">
                      جامعة الأميرة نورة بنت عبدالرحمن
                    </option>
                    <option value="جامعة الملك سعود">جامعة الملك سعود</option>
                    <option value="جامعة الإمام محمد بن سعود">جامعة الإمام محمد بن سعود</option>
                    <option value="جامعة الملك عبدالعزيز">جامعة الملك عبدالعزيز</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="district" className="text-xs font-bold">
                    حي السكن المخدوم
                  </Label>
                  <select
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-9 px-3 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {tenant.districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <Label className="text-xs font-bold block mb-2">
                    نوع الاشتراك (شامل الضريبة 15%)
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPeriod("monthly")}
                      className={`p-3.5 rounded-xl border text-right transition ${
                        period === "monthly"
                          ? "border-primary bg-primary text-primary-foreground font-bold"
                          : "border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="text-xs opacity-80">اشتراك شهري</div>
                      <div className="text-lg font-black mt-0.5">{tenant.monthlyFee} ر.س</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPeriod("term")}
                      className={`p-3.5 rounded-xl border text-right transition ${
                        period === "term"
                          ? "border-primary bg-primary text-primary-foreground font-bold"
                          : "border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="text-xs opacity-80">اشتراك فصلي (خصم)</div>
                      <div className="text-lg font-black mt-0.5">{price} ر.س</div>
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-bold"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  <span>متابعة وتأكيد الحجز</span>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {step === "otp" && (
          <Card className="text-center p-6 sm:p-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold">تأكيد رقم الجوال (OTP)</CardTitle>
              <CardDescription className="text-xs">
                تم إرسال رمز تحقق مؤقت برسالة نصية إلى{" "}
                <span dir="ltr" className="font-bold text-foreground">
                  {phone || "0501234567"}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xs mx-auto">
              <Input
                type="text"
                maxLength={4}
                placeholder="• • • •"
                dir="ltr"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="text-center tracking-[1em] text-2xl font-bold h-12"
              />
              <Button onClick={() => setStep("payment")} className="w-full font-bold">
                تحقق والانتقال للدفع
              </Button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="text-xs text-muted-foreground hover:underline block mx-auto"
              >
                تعديل رقم الجوال
              </button>
            </CardContent>
          </Card>
        )}

        {step === "payment" && (
          <Card className="p-6 sm:p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-xl font-bold">سداد قيمة الاشتراك</CardTitle>
              <CardDescription className="text-xs">
                دفع مباشر لحساب <strong>{tenant.name}</strong> (الرقم الضريبي: {tenant.vatNumber})
              </CardDescription>
            </CardHeader>

            <div className="bg-muted/50 p-4 rounded-xl border border-border mb-6 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المؤسسة المشغلة:</span>
                <span className="font-bold">{tenant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الطالبة:</span>
                <span className="font-bold">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المسار:</span>
                <span className="font-bold">
                  {district} ➔ {university}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm font-black text-foreground">
                <span>المبلغ المستحق (شامل ضريبة 15%):</span>
                <span>{price} ر.س</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                disabled={isProcessingPayment}
                onClick={() => handleCheckout("applepay")}
                className="w-full h-12 bg-black text-white hover:bg-slate-900 font-bold gap-2"
              >
                {isProcessingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>الدفع السريع بواسطة Pay</span>
              </Button>
              <Button
                disabled={isProcessingPayment}
                variant="outline"
                onClick={() => handleCheckout("mada")}
                className="w-full h-12 font-bold gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>الدفع ببطاقة مـدى البنكية</span>
              </Button>
            </div>
          </Card>
        )}

        {step === "success" && issuedInvoice && (
          <Card className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 mb-2">
                تم تفعيل المقعد وإدراجه في شاشة السائق
              </Badge>
              <CardTitle className="text-2xl font-black">فاتورة ضريبية مبسطة (ZATCA)</CardTitle>
              <CardDescription className="text-xs mt-1">
                صادرة من <strong>{issuedInvoice.sellerName}</strong> • واتساب خدمة العملاء:{" "}
                <span dir="ltr" className="font-mono">
                  {issuedInvoice.whatsappPhone}
                </span>
              </CardDescription>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border mb-6 text-xs space-y-2.5">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>رقم الفاتورة:</span>
                </span>
                <span className="font-mono font-bold">{issuedInvoice.invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">اسم المورد:</span>
                <span className="font-semibold">{issuedInvoice.sellerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الرقم الضريبي للمؤسسة (VAT):</span>
                <span className="font-mono font-bold">{issuedInvoice.vatRegistrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المبلغ قبل الضريبة:</span>
                <span>{issuedInvoice.netAmount} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ضريبة القيمة المضافة (15%):</span>
                <span>{issuedInvoice.vatAmount} ر.س</span>
              </div>
              <Separator />
              <div className="flex justify-between font-black text-sm text-emerald-700">
                <span>الإجمالي شامل الضريبة:</span>
                <span>{issuedInvoice.totalAmount} ر.س</span>
              </div>

              <div className="pt-4 border-t flex flex-col sm:flex-row items-center gap-4">
                <ZatcaQrImage value={issuedInvoice.zatcaQrBase64} size={132} className="shrink-0" />
                <div className="overflow-hidden text-center sm:text-right w-full">
                  <Badge variant="outline" className="mb-1 text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                    باركود ZATCA مشفر ببيانات المؤسسة
                  </Badge>
                  <div className="font-bold text-[11px]">ختم الفوترة الإلكترونية (ZATCA TLV Base64):</div>
                  <div className="font-mono text-[10px] text-muted-foreground break-all dir-ltr mt-1 bg-background p-2 rounded border">
                    {issuedInvoice.zatcaQrBase64}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" asChild>
                <Link href={`/dashboard?tenant=${tenant.slug}`}>رؤية الطالبة في لوحة المؤسسة</Link>
              </Button>
              <Button asChild>
                <Link href={`/driver?tenant=${tenant.slug}`}>رؤية الطالبة في شاشة السائق</Link>
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t bg-card">
        {tenant.name} — سجل تجاري: {tenant.crNumber} • الرقم الضريبي: {tenant.vatNumber} • مدعوم بواسطة{" "}
        <Link href="/" className="font-bold hover:underline">
          مشوار
        </Link>
      </footer>
    </div>
  );
}

export default function TenantBookingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-muted-foreground">جاري تحميل صفحة المؤسسة...</div>}>
      <BookingContent />
    </Suspense>
  );
}
