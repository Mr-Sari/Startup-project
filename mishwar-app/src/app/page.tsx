import Link from "next/link";
import {
  Bus,
  ShieldCheck,
  CreditCard,
  Bell,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Lock,
  Sparkles,
  QrCode,
  FileCheck2,
  Users,
  MapPin,
  Smartphone,
  Clock,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MishwarAICopilot } from "@/components/mishwar-ai-copilot";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Top Regulatory Banner */}
      <div className="royal-gradient text-slate-200 text-[11px] py-2.5 px-4 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white">
              المنظومة السحابية لمؤسسات النقل الجامعي المرخصة في المملكة العربية السعودية
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-200/80 font-medium">
            <span>متوافق مع اشتراطات الهيئة العامة للنقل (TGA)</span>
            <span>•</span>
            <span>الفوترة الضريبية (ZATCA)</span>
            <span>•</span>
            <span>مربوط مع Google Firebase & AI Agent</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="border-b bg-card/85 backdrop-blur-xl sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl royal-gradient text-white flex items-center justify-center shadow-md ring-1 ring-emerald-500/30">
              <Bus className="w-5 h-5 stroke-[2.2] text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-foreground">صَرْحِي</span>
                <Badge className="bg-emerald-600/15 text-emerald-800 border border-emerald-600/30 text-[10px] font-bold">
                  Sarhy SaaS
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">نظام التشغيل المستقل لمؤسسات نقل الطالبات</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-muted-foreground">
            <a href="#preview" className="hover:text-primary transition">معاينة المنظومة</a>
            <a href="#how-it-works" className="hover:text-primary transition">كيف يشتغل؟</a>
            <a href="#features" className="hover:text-primary transition">مميزات المؤسسة</a>
            <a href="#pricing" className="hover:text-primary transition">الباقات والأسعار</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex font-bold">
              <Link href="/pitch">العرض الاستثماري (Pitch Deck)</Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="font-bold border-emerald-700/30 hover:bg-emerald-50">
              <Link href="/dashboard">لوحة المؤسسة + AI Agent</Link>
            </Button>
            <Button size="sm" asChild className="font-bold shadow-sm">
              <Link href="/register-tenant">تجربة مجانية 14 يوم</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-22 border-b bg-grid-pattern">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-600/25 bg-emerald-50/80 text-emerald-900 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>هوية بصرية فاخرة • وكيل ذكاء اصطناعي ينفذ الأوامر مباشرة • بدون عمولة على الاشتراكات</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.22] mb-6 max-w-4xl mx-auto text-slate-950">
            كل مؤسسة نقل تاخذ موقعها الخاص، <br />
            <span className="bg-gradient-to-l from-emerald-800 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
              وتدير أسطولها بالذكاء الاصطناعي.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-9 leading-relaxed">
            سجّل مؤسستك واختر عنوانك مثل <code className="px-2 py-0.5 rounded bg-muted text-foreground font-mono text-xs dir-ltr">mishwar.sa/darb-alaman</code>. الطالبات يسجلن ويدفعن عبر مدى وApple Pay، السائق يؤشر «ركبت» أو «ما ركبت»، والنظام ينبهك قبل انتهاء رخص السائقين وبطاقات التشغيل.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <Button size="lg" className="h-11 px-7 font-bold shadow-sm" asChild>
              <Link href="/register-tenant">
                <span>ابدأ تجربتك المجانية (14 يوم)</span>
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-6 font-semibold" asChild>
              <Link href="/dashboard">استعراض لوحة تحكم المؤسسة</Link>
            </Button>
            <Button size="lg" variant="secondary" className="h-11 px-6 font-semibold" asChild>
              <Link href="/darb-alaman">معاينة موقع الطالبة (/darb-alaman)</Link>
            </Button>
            <Button size="lg" variant="ghost" className="h-11 px-5 text-xs font-semibold border border-dashed" asChild>
              <Link href="/driver">معاينة شاشة السائق (PWA)</Link>
            </Button>
          </div>

          {/* Interactive Shadcn Tabs Product Showcase */}
          <div id="preview" className="max-w-5xl mx-auto text-right">
            <Tabs defaultValue="dashboard" className="w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 px-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                    معاينة تفاعلية حية
                  </Badge>
                  <span className="text-xs text-muted-foreground">تنقل بين شاشات النظام الثلاث:</span>
                </div>
                <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                  <TabsTrigger value="dashboard" className="text-xs px-4">1. لوحة إدارة المؤسسة</TabsTrigger>
                  <TabsTrigger value="student" className="text-xs px-4">2. موقع حجز الطالبة</TabsTrigger>
                  <TabsTrigger value="driver" className="text-xs px-4">3. شاشة السائق</TabsTrigger>
                </TabsList>
              </div>

              {/* Tab 1: Dashboard Preview */}
              <TabsContent value="dashboard">
                <Card className="shadow-xl border-border/90 overflow-hidden">
                  <CardHeader className="bg-slate-950 text-white py-3 px-5 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-mono text-slate-400 mr-2 dir-ltr">mishwar.sa/dashboard</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                        مؤسسة درب الأمان • باقة Pro
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 bg-muted/15 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardDescription className="text-[11px]">الطالبات المشتركات</CardDescription>
                          <CardTitle className="text-2xl font-black">128 طالبة</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <span className="text-[11px] text-emerald-600 font-semibold">✓ 125 مقعد مسدد ونشط</span>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardDescription className="text-[11px]">تحصيل الشهر (0% عمولة)</CardDescription>
                          <CardTitle className="text-2xl font-black">83,200 ر.س</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <span className="text-[11px] text-muted-foreground">إيداع مباشر لحساب المؤسسة</span>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardDescription className="text-[11px]">الباصات والمسارات</CardDescription>
                          <CardTitle className="text-2xl font-black">8 باصات</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <span className="text-[11px] text-muted-foreground">تغطي 14 حياً و 3 جامعات</span>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardDescription className="text-[11px]">تنبيهات هيئة النقل</CardDescription>
                          <CardTitle className="text-2xl font-black text-amber-600">2 وثائق</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <span className="text-[11px] text-amber-700 font-medium">⚠️ كارت تشغيل ينتهي بعد 12 يوم</span>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            <TableHead className="text-right text-xs font-bold">اسم الطالبة</TableHead>
                            <TableHead className="text-right text-xs font-bold">المسار والحي</TableHead>
                            <TableHead className="text-right text-xs font-bold">الاشتراك</TableHead>
                            <TableHead className="text-right text-xs font-bold">حالة الدفع</TableHead>
                            <TableHead className="text-center text-xs font-bold">الإجراء الآلي</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="text-xs">
                          <TableRow>
                            <TableCell className="font-bold">سارة العتيبي</TableCell>
                            <TableCell>حي الياسمين ➔ جامعة نورة (باص 01)</TableCell>
                            <TableCell className="font-bold">650 ر.س</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">مسدد</Badge>
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">مدرجة في جدول السائق</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-bold">نورة المطيري</TableCell>
                            <TableCell>حي الصحافة ➔ جامعة سعود (باص 03)</TableCell>
                            <TableCell className="font-bold">650 ر.س</TableCell>
                            <TableCell>
                              <Badge variant="destructive">موقوف تلقائياً</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-[11px] font-semibold text-primary underline">إرسال رابط دفع واتساب</span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 2: Student Portal Preview */}
              <TabsContent value="student">
                <Card className="shadow-xl border-border/90 overflow-hidden">
                  <CardHeader className="bg-teal-900 text-white py-3 px-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono dir-ltr">https://mishwar.sa/darb-alaman</span>
                      <Badge className="bg-white/20 text-white text-[10px]">هوية خاصة بكل مؤسسة • بدون منافسين</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 grid md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <Badge variant="outline">وصول مباشر عبر الرابط أو QR أو الواتساب</Badge>
                      <h3 className="text-xl font-black">صفحة خاصة بمؤسستك فقط</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        ما فيه بحث عام يعرض المؤسسات جنب منافسيها. الطالبة تدخل رابط مؤسستك مباشرة، تسجل برقم جوالها، تختار الحي والجامعة، وتدفع اشتراكها أونلاين وتصدر لها بطاقة صعود رقمية.
                      </p>
                      <Button asChild size="sm">
                        <Link href="/darb-alaman">تجربة صفحة الطالبة الحية ➔</Link>
                      </Button>
                    </div>
                    <Card className="p-4 bg-muted/20 border-dashed">
                      <div className="space-y-3 text-xs">
                        <div className="font-bold text-sm">نموذج حجز المقعد السريع</div>
                        <div className="p-2.5 rounded border bg-card flex justify-between">
                          <span className="text-muted-foreground">الجامعة:</span>
                          <span className="font-semibold">جامعة الأميرة نورة</span>
                        </div>
                        <div className="p-2.5 rounded border bg-card flex justify-between">
                          <span className="text-muted-foreground">الحي والمسار:</span>
                          <span className="font-semibold">حي الياسمين (باص 01)</span>
                        </div>
                        <div className="p-2.5 rounded border bg-card flex justify-between">
                          <span className="text-muted-foreground">الاشتراك الشهري:</span>
                          <span className="font-black text-emerald-700">650 ر.س</span>
                        </div>
                        <div className="bg-slate-950 text-white text-center py-2.5 rounded-lg font-bold">
                          الدفع الفوري عبر مدى / Pay
                        </div>
                      </div>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 3: Driver App Preview */}
              <TabsContent value="driver">
                <Card className="shadow-xl border-border/90 overflow-hidden">
                  <CardHeader className="bg-slate-950 text-white py-3 px-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono dir-ltr">https://mishwar.sa/driver</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">شاشة جوال للسائق + تنبيه ولي الأمر</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 grid md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <Badge variant="outline">بدون تعقيد • أزرار لمس كبيرة</Badge>
                      <h3 className="text-xl font-black">السائق يأشر «ركبت» أو «ما ركبت»</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        تظهر للسائق قائمة طالبات المسار المسددات فقط. بضغطة زر واحدة على «ركبت الباص» يوصل لولي الأمر إشعار فوري يطمنه بصعود ابنته وموعد التحرك.
                      </p>
                      <Button asChild size="sm">
                        <Link href="/driver">تجربة شاشة السائق الحية ➔</Link>
                      </Button>
                    </div>
                    <Card className="p-4 bg-slate-950 text-white">
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="font-bold">1. ريم فهد القحطاني</span>
                          <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">حي الياسمين</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-emerald-600 text-white text-center py-2 rounded-lg font-bold">✓ ركبت الباص</div>
                          <div className="bg-slate-800 text-slate-300 text-center py-2 rounded-lg font-medium">✕ ما ركبت</div>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-400">
                          🔔 إشعار ولي الأمر: «استقلت الطالبة ريم حافلة درب الأمان الساعة 06:45 ص»
                        </div>
                      </div>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-2">طريقة العمل</Badge>
          <h2 className="text-2xl sm:text-3xl font-black">كيف يشتغل نظام «مشوار» في 3 خطوات؟</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-sm mb-2">
                1
              </div>
              <CardTitle className="text-base font-bold">سجّل مؤسستك واختر رابطك</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                صاحب المؤسسة يسجل بنفسه ويختار عنوانه مثل <code className="font-mono">mishwar.sa/darb-alaman</code>، ويطلع له موقع خاص بلونه وأسعاره ومواعيده ومساراته.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-sm mb-2">
                2
              </div>
              <CardTitle className="text-base font-bold">الطالبات يوصلن لمؤسستك مباشرة</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                عبر رابط المؤسسة أو رمز QR أو الواتساب. ما فيه بحث عام يعرض المؤسسات جنب منافسيها. الطالبة تسجل بجوالها وتدفع اشتراكها أونلاين.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-sm mb-2">
                3
              </div>
              <CardTitle className="text-base font-bold">تشغيل وتحصيل وتنبيهات آلية</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                النظام يتابع الدفعات ويوقف مقعد من لم تدفع تلقائياً، السائق يأشر الصعود ويوصل تنبيه لولي الأمر، والإدارة تستلم تنبيهات الرخص.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-2">وش يقدم للمؤسسة؟</Badge>
            <h2 className="text-2xl sm:text-3xl font-black">أدوات تشغيلية متكاملة تغنيك عن الإكسل والواتساب</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card>
              <CardHeader>
                <CreditCard className="w-6 h-6 text-primary mb-2" />
                <CardTitle className="text-sm font-bold">تحصيل دفعات وإيقاف تلقائي</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  إدارة الطلبات والاشتراكات وتحصيل الدفعات مع رسائل تذكير، وإيقاف تلقائي لمقعد من لم تسدد من كشف السائق.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="w-6 h-6 text-primary mb-2" />
                <CardTitle className="text-sm font-bold">تأشير الركوب وتنبيه ولي الأمر</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  تتبع حالة الجولة، والسائق يأشر «ركبت» أو «ما ركبت» بلمسة زر، وولي الأمر يوصله تنبيه فوري بالوقت.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ShieldCheck className="w-6 h-6 text-primary mb-2" />
                <CardTitle className="text-sm font-bold">تنبيهات رخص السائقين والتشغيل</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  تنبيهات استباقية قبل انتهاء رخص قيادة السائقين وبطاقات التشغيل الصادرة من هيئة النقل لتفادي الغرامات.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileCheck2 className="w-6 h-6 text-primary mb-2" />
                <CardTitle className="text-sm font-bold">فريق عمل وتقارير وفواتير</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  إضافة فريق عمل بصلاحيات محددة (محاسب، مشرف حركة)، مع تقارير مالية وفواتير ضريبية جاهزة.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-2">باقات الاشتراك</Badge>
          <h2 className="text-2xl sm:text-3xl font-black">كل الباقات بتجربة مجانية ١٤ يوم، وبدون عمولة على اشتراكات الطالبات</h2>
          <p className="text-xs text-muted-foreground mt-2">
            اشتراك شهري واضح تدفعه المؤسسة حسب باقتها، وكامل إيرادات الطالبات تذهب لحساب المؤسسة مباشرة
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* Basic */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <Badge variant="secondary" className="w-fit text-[10px]">التشغيل الأساسي</Badge>
              <CardTitle className="text-xl font-black mt-2">Basic</CardTitle>
              <CardDescription className="text-xs">للمؤسسات الناشئة وبداية أتمتة الأسطول</CardDescription>
              <div className="pt-4">
                <span className="text-3xl font-black">399 ر.س</span>
                <span className="text-xs text-muted-foreground"> / شهرياً</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <Separator className="mb-4" />
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> موقع خاص برابط وشعار المؤسسة</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> استقبال طلبات واشتراكات الطالبات</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> تحصيل الدفعات وإيقاف تلقائي لمن لم تدفع</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> شاشة السائق لتأشير (ركبت / ما ركبت)</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> تنبيهات انتهاء رخص السائقين وكروت التشغيل</div>
            </CardContent>
            <CardFooter className="pt-6">
              <Button variant="outline" className="w-full font-bold" asChild>
                <Link href="/register-tenant?plan=basic">ابدأ تجربة 14 يوم مجاناً</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro */}
          <Card className="flex flex-col justify-between border-2 border-primary shadow-xl relative">
            <div className="absolute -top-3 right-6">
              <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-3">الأكثر اختياراً</Badge>
            </div>
            <CardHeader>
              <Badge variant="secondary" className="w-fit text-[10px]">التشغيل المتكامل والنمو</Badge>
              <CardTitle className="text-xl font-black mt-2">Pro</CardTitle>
              <CardDescription className="text-xs">يزيد عليها الفريق والتقارير والمسارات المتقدمة</CardDescription>
              <div className="pt-4">
                <span className="text-3xl font-black">899 ر.س</span>
                <span className="text-xs text-muted-foreground"> / شهرياً</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <Separator className="mb-4" />
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> كل مميزات باقة Basic</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> إدارة المسارات والأحياء المتعددة</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> حسابات فريق عمل بصلاحيات (مشرف، محاسب)</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> تقارير تحصيل ومسيرات وفواتير ضريبية</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> مساعد الذكاء الاصطناعي التشغيلي (AI Copilot)</div>
            </CardContent>
            <CardFooter className="pt-6">
              <Button className="w-full font-bold" asChild>
                <Link href="/register-tenant?plan=pro">ابدأ تجربة باقة Pro (14 يوم)</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <Badge variant="secondary" className="w-fit text-[10px]">للشركات والأساطيل المفتوحة</Badge>
              <CardTitle className="text-xl font-black mt-2">Enterprise</CardTitle>
              <CardDescription className="text-xs">بعرض سعر مخصص وبدون حد للباصات</CardDescription>
              <div className="pt-4">
                <span className="text-3xl font-black">بعرض سعر</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <Separator className="mb-4" />
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> بدون حد لعدد الباصات والسائقين</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> كل مميزات باقة Pro</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> ربط مباشر ببوابة الدفع والفوترة الخاصة</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> تخصيص كامل للنطاق (Custom Domain)</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> مدير حساب ودعم فني مخصص</div>
            </CardContent>
            <CardFooter className="pt-6">
              <Button variant="outline" className="w-full font-bold" asChild>
                <Link href="/register-tenant?plan=enterprise">اطلب عرض سعر لمؤسستك</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8 text-xs text-muted-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-[11px]">
              ص
            </div>
            <span className="font-bold text-foreground">صَرْحِي (Sarhy SaaS)</span>
            <span>— نظام إدارة وتشغيل مؤسسات النقل الجامعي المرخصة في السعودية</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-foreground">لوحة المؤسسة</Link>
            <Link href="/darb-alaman" className="hover:text-foreground">موقع الطالبة</Link>
            <Link href="/driver" className="hover:text-foreground">شاشة السائق</Link>
          </div>
        </div>
      </footer>

      {/* Real Agentic AI Chatbot across the Platform */}
      <MishwarAICopilot tenantSlug="darb-alaman" />
    </div>
  );
}
