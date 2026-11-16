"use client";

import { useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { mockTenants } from "@/lib/mockData";
import { Bus, ShieldCheck, Phone, CreditCard, CheckCircle2, ChevronLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function BookingContent() {
  const params = useParams();
  const slug = (params?.slug as string) || "darb-alaman";
  const tenant = mockTenants[slug] || mockTenants["darb-alaman"];

  const [step, setStep] = useState<"form" | "otp" | "payment" | "success">("form");
  const [phone, setPhone] = useState("");
  const [studentName, setStudentName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [district, setDistrict] = useState(tenant.districts[0]);
  const [university, setUniversity] = useState("جامعة الأميرة نورة بنت عبدالرحمن");
  const [period, setPeriod] = useState<"monthly" | "term">("monthly");
  const [otpCode, setOtpCode] = useState("");

  const price = period === "monthly" ? tenant.monthlyFee : tenant.monthlyFee * 3.5;

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Official Top Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-xs">
              <Bus className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold">{tenant.name}</h1>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ترخيص نقل معتمد: {tenant.licenseNumber}</span>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" asChild>
            <a href={`tel:${tenant.phone}`} className="gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>خدمة العملاء</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-xl mx-auto px-4 py-12 flex-1 w-full">
        {step === "form" && (
          <Card className="shadow-lg border-border/80">
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2 text-xs">
                حجز مقعد • الفصل الحالي
              </Badge>
              <CardTitle className="text-2xl font-black">طلب اشتراك نقل جامعي</CardTitle>
              <CardDescription className="text-xs">
                يرجى إدخال بيانات الطالبة وولي الأمر بدقة لربط الحافلة وإصدار بطاقة الصعود الرقمية.
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
                  <Label htmlFor="studentName" className="text-xs font-bold">اسم الطالبة الثلاثي</Label>
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
                    <Label htmlFor="phone" className="text-xs font-bold">رقم جوال الطالبة</Label>
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
                    <Label htmlFor="guardianPhone" className="text-xs font-bold">جوال ولي الأمر (للتنبيهات)</Label>
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
                  <Label htmlFor="university" className="text-xs font-bold">الجامعة أو الكلية</Label>
                  <select
                    id="university"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full h-9 px-3 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="جامعة الأميرة نورة بنت عبدالرحمن">جامعة الأميرة نورة بنت عبدالرحمن</option>
                    <option value="جامعة الملك سعود">جامعة الملك سعود</option>
                    <option value="جامعة الإمام محمد بن سعود">جامعة الإمام محمد بن سعود</option>
                    <option value="جامعة الفيصل">جامعة الفيصل</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="district" className="text-xs font-bold">حي السكن المخدوم</Label>
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
                  <Label className="text-xs font-bold block mb-2">نوع الاشتراك</Label>
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
                <Button type="submit" size="lg" className="w-full font-bold">
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
                تم إرسال رمز تحقق مؤقت برسالة نصية إلى <span dir="ltr" className="font-bold text-foreground">{phone || "0501234567"}</span>
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
              <CardDescription className="text-xs">الدفع إلكتروني ومباشر للمؤسسة</CardDescription>
            </CardHeader>

            <div className="bg-muted/50 p-4 rounded-xl border border-border mb-6 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المؤسسة المشغلة:</span>
                <span className="font-bold">{tenant.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المسار:</span>
                <span className="font-bold">{district} ➔ {university}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm font-black text-foreground">
                <span>المبلغ المستحق:</span>
                <span>{price} ر.س</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setStep("success")}
                className="w-full h-12 bg-black text-white hover:bg-slate-900 font-bold"
              >
                الدفع السريع بواسطة Pay
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("success")}
                className="w-full h-12 font-bold gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>الدفع ببطاقة مـدى البنكية</span>
              </Button>
            </div>
          </Card>
        )}

        {step === "success" && (
          <Card className="text-center p-8">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-black mb-2">تم تأكيد حجز المقعد بنجاح</CardTitle>
            <CardDescription className="text-xs mb-6 max-w-sm mx-auto">
              تم إصدار الفاتورة الضريبية وتفاصيل الحافلة وإرسال بطاقة المقعد الرقمية إلى رقم الواتساب المسجل.
            </CardDescription>

            <div className="bg-muted/40 rounded-xl p-4 border border-border mb-6 text-xs text-right space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">رقم الاشتراك:</span>
                <span className="font-mono font-bold">#MSH-9821</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">حالة المقعد:</span>
                <span className="text-emerald-700 font-bold">🟢 مؤكد ومفعل</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تنبيهات ولي الأمر:</span>
                <span>مفعلة على هاتف {guardianPhone || "المسجل"}</span>
              </div>
            </div>

            <Button asChild>
              <Link href="/driver">معاينة شاشة السائق لتأكيد صعود الطالبة</Link>
            </Button>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t bg-card">
        مدعوم ومحمي بواسطة منظومة <Link href="/" className="font-bold hover:underline">مشوار (Mishwar SaaS)</Link> • المملكة العربية السعودية
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
