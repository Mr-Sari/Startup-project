"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bus,
  ChevronRight,
  ChevronLeft,
  Download,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowLeft,
  Presentation,
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

interface SlideData {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  points: { heading: string; detail: string }[];
  highlightMetric?: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    tag: "الشريحة 1 من 12 • الغلاف والوعد الأساسي",
    title: "مِشـوار | نظام التشغيل السحابي المستقل لمؤسسات النقل الجامعي",
    subtitle: "كل مؤسسة نقل تأخذ موقعها الخاص باسمها وهويتها ورقمها الضريبي، وتدير منه شغلها كله",
    highlightMetric: "B2B Vertical SaaS • 0% عمولة على المقاعد",
    points: [
      {
        heading: "موقع مستقل لكل مؤسسة (mishwar.sa/slug)",
        detail: "يظهر بشعار المؤسسة ولونها وأسعارها ومواعيدها، بدون عرض أي منافس بجانبها.",
      },
      {
        heading: "ربط متكامل بين الإدارة والطالبة والسائق",
        detail: "طلبات واشتراكات، إيقاف تلقائي لمن لم تدفع، تأشير السائق (ركبت/ما ركبت)، وتنبيهات الرخص.",
      },
    ],
  },
  {
    id: 2,
    tag: "الشريحة 2 من 12 • المشكلة في السوق",
    title: "3,500+ مؤسسة نقل تدير ملايين الريالات بـ «الإكسل والواتساب»",
    subtitle: "فوضى التحصيل اليدوي، غرامات هيئة النقل، ورفض المؤسسات لدفع عمولات للتطبيقات الوسيطة",
    highlightMetric: "18% تسرب إيرادات بسبب التأخر في التحصيل اليدوي",
    points: [
      {
        heading: "نزيف مالي وتأخر في التحصيل",
        detail: "متابعة التحويلات البنكية وإيصالات الواتساب لمئات الطالبات يدوياً يؤدي لركوب طالبات غير مسددات.",
      },
      {
        heading: "غرامات هيئة النقل المفاجئة (5,000 ر.س للمخالفة)",
        detail: "نسيان موعد انتهاء بطاقة تشغيل حافلة أو رخصة سائق يكبد المؤسسة غرامات فورية.",
      },
      {
        heading: "رفض التطبيقات التجميعية (Marketplaces)",
        detail: "المؤسسات ترفض التطبيقات الوسيطة لأنها تقتطع 15%-20% عمولة وتعرض المؤسسة بجانب منافسيها.",
      },
    ],
  },
  {
    id: 3,
    tag: "الشريحة 3 من 12 • الحل",
    title: "موقع خاص ونظام تشغيل متكامل لكل مؤسسة في 3 دقائق",
    subtitle: "استقلالية تامة للمؤسسة بهويتها ورقمها الضريبي وواتسابها الخاص",
    highlightMetric: "تجربة مجانية 14 يوم • بدون عمولة على اشتراكات الطالبات",
    points: [
      {
        heading: "تحصيل إلكتروني وإيقاف تلقائي",
        detail: "دفع عبر مدى وApple Pay، مع تذكير واتساب آلي وحجب مقعد من لم تدفع من شاشة السائق تلقائياً.",
      },
      {
        heading: "تأشير السائق («ركبت» / «ما ركبت»)",
        detail: "واجهة جوال فائقة البساطة للسائق بزرين فقط ترسل تنبيه واتساب فوري لولي الأمر.",
      },
      {
        heading: "تنبيهات الرخص + فوترة ضريبية ZATCA",
        detail: "تنبيه قبل انتهاء رخص السائقين وبطاقات التشغيل، وإصدار فاتورة ضريبية بباركود ZATCA باسم المؤسسة.",
      },
    ],
  },
  {
    id: 4,
    tag: "الشريحة 4 من 12 • طريقة العمل",
    title: "كيف يشتغل نظام «مشوار» في 3 خطوات مترابطة؟",
    subtitle: "مزامنة لحظية بين لوحة المؤسسة وموقع الطالبة وشاشة السائق",
    points: [
      {
        heading: "1. صاحب المؤسسة يسجل ويختار عنوانه",
        detail: "يدخل الاسم، الرقم الضريبي، رقم الواتساب، وترخيص هيئة النقل، ويختار رابطه (mishwar.sa/darb-alaman).",
      },
      {
        heading: "2. الطالبة تحجز مقعدها وتدفع اشتراكها",
        detail: "تصل من رابط المؤسسة أو QR أو الواتساب، تسجل بجوالها وتدفع وتصدر لها فاتورة ZATCA وبطاقة صعود.",
      },
      {
        heading: "3. السائق يؤشر وولي الأمر يتطمن",
        detail: "تظهر المسددات فقط في كشف السائق، يضغط «ركبت» فيصل تنبيه فوري لولي الأمر.",
      },
    ],
  },
  {
    id: 5,
    tag: "الشريحة 5 من 12 • لماذا الآن؟",
    title: "تحولات تنظيمية ورقمية في السعودية تجعل «مشوار» ضرورة حتمية",
    subtitle: "تقاطع مثالي بين إلزامية الفوترة الإلكترونية واشتراطات هيئة النقل",
    points: [
      {
        heading: "إلزامية الفوترة الإلكترونية (ZATCA)",
        detail: "مؤسسات النقل مطالبة قانونياً بإصدار فواتير ضريبية إلكترونية بباركود مشفر لكل اشتراك طالبة.",
      },
      {
        heading: "رقابة الهيئة العامة للنقل (TGA)",
        detail: "اشتراطات صارمة على سريان بطاقات التشغيل ورخص القيادة المهنية وتوثيق قوائم الركاب.",
      },
      {
        heading: "أكثر من 700,000 طالبة جامعية",
        detail: "نمو مستمر في أعداد الطالبات المعتمدات على عقود النقل الشهري والفصلي.",
      },
    ],
  },
  {
    id: 6,
    tag: "الشريحة 6 من 12 • حجم السوق السعودي والخليجي",
    title: "حجم السوق المستهدف (TAM / SAM / SOM)",
    subtitle: "حسابات مبنية من القاعدة للقمة لقطاع النقل التعليمي والجامعي",
    highlightMetric: "SOM: 5.0 مليون ر.س ARR خلال 3 سنوات",
    points: [
      {
        heading: "TAM (السوق الكلي — 4.2 مليار ر.س سنوياً)",
        detail: "إجمالي إنفاق قطاع النقل التعليمي والجامعي الخاص في السعودية ودول الخليج.",
      },
      {
        heading: "SAM (سوق برمجيات إدارة النقل — 180 مليون ر.س سنوياً)",
        detail: "~15,000 منشأة ومشغل نقل تعليمي وجامعي × متوسط اشتراك برمجي 12,000 ر.س سنوياً.",
      },
      {
        heading: "SOM (الحصة المستهدفة — 5.0 مليون ر.س سنوياً)",
        detail: "استقطاب أول 550 مؤسسة نقل مرخصة في المدن الرئيسية (الرياض، جدة، مكة، الشرقية، القصيم).",
      },
    ],
  },
  {
    id: 7,
    tag: "الشريحة 7 من 12 • نموذج العمل والباقات",
    title: "اشتراك شهري ثابت (SaaS) • 14 يوم تجربة مجانية • 0% عمولة",
    subtitle: "الدخل: اشتراك شهري تدفعه المؤسسة حسب باقتها",
    points: [
      {
        heading: "Basic — التشغيل الأساسي (399 ر.س / شهرياً)",
        detail: "موقع خاص للمؤسسة، طلبات واشتراكات وتحصيل، إيقاف تلقائي لمن لم تدفع، شاشة السائق وتنبيهات الرخص.",
      },
      {
        heading: "Pro — الأكثر طلباً (899 ر.س / شهرياً)",
        detail: "يزيد عليها صلاحيات فريق العمل، المسارات المتعددة، التقارير والفواتير الضريبية، ومساعد AI الذكي.",
      },
      {
        heading: "Enterprise — للشركات الكبرى (بعرض سعر)",
        detail: "بدون حد لعدد الباصات، ربط مخصص ببوابة دفع الشركة، ومدير حساب مخصص.",
      },
    ],
  },
  {
    id: 8,
    tag: "الشريحة 8 من 12 • التوقعات المالية واقتصاديات الوحدة",
    title: "هامش ربح إجمالي 91% واسترداد تكلفة العميل خلال 1.3 شهر",
    subtitle: "نموذج مالي متنامٍ على مدار 3 سنوات",
    highlightMetric: "LTV:CAC = 27x  |  ARPU = 750 ر.س/شهرياً",
    points: [
      {
        heading: "السنة الأولى: 60 مؤسسة مشتركة",
        detail: "480 حافلة مدارة • إيراد سنوي متكرر (ARR): 540,000 ر.س • صافي ربح تشغيلي: +260,000 ر.س.",
      },
      {
        heading: "السنة الثانية: 220 مؤسسة مشتركة",
        detail: "1,980 حافلة مدارة • إيراد سنوي متكرر (ARR): 1,980,000 ر.س • صافي ربح تشغيلي: +1,260,000 ر.س.",
      },
      {
        heading: "السنة الثالثة: 550 مؤسسة مشتركة",
        detail: "5,500 حافلة مدارة • إيراد سنوي متكرر (ARR): 4,950,000 ر.س • صافي ربح تشغيلي: +3,500,000 ر.س.",
      },
    ],
  },
  {
    id: 9,
    tag: "الشريحة 9 من 12 • الميزة التنافسية",
    title: "لماذا تتفوق «مشوار» على التطبيقات الوسيطة وشركات الـ GPS؟",
    subtitle: "نحن الشريك التقني للمؤسسة ولسنا وسيطاً يشاركها أرباح مقاعدها",
    points: [
      {
        heading: "استقلالية كاملة (Zero Marketplace Competition)",
        detail: "لا يوجد بحث عام يعرض المؤسسة بجانب منافسيها؛ كل مؤسسة لها موقعها وعلامتها المستقلة.",
      },
      {
        heading: "بدون عمولة على اشتراكات الطالبات (0% Commission)",
        detail: "بينما تأخذ التطبيقات الأخرى 15%-20% من كل مقعد، تكتفي مشوار باشتراك شهري ثابت.",
      },
      {
        heading: "ربط السداد بشاشة السائق آلياً",
        detail: "ميزة حصرية تحجب اسم الطالبة غير المسددة من كشف السائق فوراً دون إحراج للإدارة.",
      },
    ],
  },
  {
    id: 10,
    tag: "الشريحة 10 من 12 • خطة الدخول للسوق (Go-To-Market)",
    title: "كيف نستقطب أول 100 مؤسسة نقل مرخصة؟",
    subtitle: "قنوات استحواذ مباشرة وسريعة التحويل",
    points: [
      {
        heading: "1. الاستهداف المباشر حول الجامعات الكبرى",
        detail: "التواصل المباشر مع مشغلي النقل في جامعات (نورة، الملك سعود، الإمام، الملك عبدالعزيز، أم القرى).",
      },
      {
        heading: "2. النمو الفيروسي عبر إشعارات أولياء الأمور",
        detail: "كل رسالة واتساب يومية تصل لولي الأمر عند صعود ابنته تزيد الوعي بالمنصة لدى أولياء الأمور والمؤسسات.",
      },
      {
        heading: "3. شراكات وكالات ومعارض الحافلات",
        detail: "تقديم 3 أشهر مجانية مع كل حافلة جديدة يتم شراؤها من وكلاء الحافلات التجارية.",
      },
    ],
  },
  {
    id: 11,
    tag: "الشريحة 11 من 12 • الجاهزية التقنية والمنتج الحي",
    title: "منتج مكتمل (Full-Stack MVP) يعمل حياً وجاهز للتشغيل",
    subtitle: "تم بناء واختبار كامل المنظومة بنجاح",
    points: [
      {
        heading: "بوابة تأسيس المؤسسات وإعداد البيانات الضريبية (/register-tenant)",
        detail: "إعداد الاسم، الرقم الضريبي، رقم الواتساب، السجل التجاري، وترخيص هيئة النقل في دقيقتين.",
      },
      {
        heading: "موقع الطالبة وفاتورة ZATCA المبسطة (/[slug])",
        detail: "حجز ودفع مدى/Apple Pay وإصدار فاتورة ضريبية بباركود ZATCA TLV Base64 حقيقي قابل للمسح.",
      },
      {
        heading: "داشبورد المؤسسة + شاشة السائق + مساعد AI Copilot",
        detail: "إدارة الباصات والسائقين والمسارات وتأشير الركوب الفوري.",
      },
    ],
  },
  {
    id: 12,
    tag: "الشريحة 12 من 12 • الطلب الاستثماري (The Ask)",
    title: "جولة Pre-Seed بقيمة 750,000 ر.س (200,000 دولار)",
    subtitle: "للوصول إلى 100 مؤسسة نقل مشتركة و ~900,000 ر.س ARR خلال 12 شهراً",
    highlightMetric: "18 شهراً Runway تشغيلي",
    points: [
      {
        heading: "40% (300,000 ر.س) — المبيعات وتطوير الأعمال",
        detail: "التوسع الميداني في الرياض، جدة، مكة، والشرقية واستقطاب أول 100 مؤسسة نقل.",
      },
      {
        heading: "35% (262,500 ر.س) — التطوير التقني والربط المباشر",
        detail: "الربط المباشر مع بوابات الدفع، WhatsApp Business API، ومنصة وصل.",
      },
      {
        heading: "25% (187,500 ر.س) — العمليات والتسويق ونجاح العملاء",
        detail: "حملات بداية الفصول الدراسية والدعم الفني المباشر للمؤسسات المشتركة.",
      },
    ],
  },
];

export default function PitchDeckPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const slide = SLIDES[currentIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Bus className="w-5 h-5" />
              </div>
              <span className="font-black text-lg text-white">مِشـوار</span>
            </Link>
            <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs">
              العرض الاستثماري التفاعلي (Pitch Deck)
            </Badge>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 gap-1.5 text-xs font-bold"
            >
              <a href="/Mishwar-Pitch-Deck.pptx" download>
                <Download className="w-3.5 h-3.5" />
                <span>تحميل ملف PowerPoint (.pptx)</span>
              </a>
            </Button>
            <Button size="sm" variant="secondary" asChild className="text-xs">
              <Link href="/dashboard">الانتقال للداشبورد</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Slide Canvas */}
      <main className="max-w-5xl mx-auto px-4 py-10 flex-1 w-full flex flex-col justify-center">
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl p-6 sm:p-10 min-h-[430px] flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
                {slide.tag}
              </Badge>
              {slide.highlightMetric && (
                <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-xs">
                  {slide.highlightMetric}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">{slide.subtitle}</p>
            <Separator className="bg-slate-800 mb-6" />

            <div className="grid gap-4">
              {slide.points.map((pt, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1"
                >
                  <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{pt.heading}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pr-6">{pt.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="pt-8 mt-6 border-t border-slate-800 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
              className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 gap-1.5"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الشريحة السابقة</span>
            </Button>

            <div className="hidden sm:flex items-center gap-1.5">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIdx ? "w-6 bg-emerald-500" : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                  title={`شريحة ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              size="sm"
              disabled={currentIdx === SLIDES.length - 1}
              onClick={() => setCurrentIdx((p) => Math.min(SLIDES.length - 1, p + 1))}
              className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 font-bold"
            >
              <span>الشريحة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        منصة مشوار (Mishwar SaaS) — يمكنك تحميل العرض بصيغة PowerPoint ورفعه مباشرة إلى Canva أو Google Slides
      </footer>
    </div>
  );
}
