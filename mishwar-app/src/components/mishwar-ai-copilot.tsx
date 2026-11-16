"use client";

import { useState } from "react";
import {
  Sparkles,
  Bus,
  AlertTriangle,
  Send,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  Bot,
  X,
  ArrowUpRight,
  ShieldAlert,
  Loader2,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ZatcaQrImage } from "@/components/zatca-qr-image";

type StreamedWidgetType = "none" | "overdue-report" | "compliance-audit" | "route-optimizer" | "qr-card";

export function MishwarAICopilot({
  onTriggerAction,
}: {
  onTriggerAction?: (action: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeWidget, setActiveWidget] = useState<StreamedWidgetType>("overdue-report");
  const [streamedText, setStreamedText] = useState<string>(
    "مرحباً بك في مساعد «مشوار الذكي». قمت بتحليل بيانات مؤسستك اليوم: لديك 3 طالبات متأخرات عن السداد بقيمة إجمالية 1,950 ر.س، وبطاقة تشغيل حافلة تنتهي خلال 12 يوماً."
  );
  const [actionExecuted, setActionExecuted] = useState<string | null>(null);

  const runGenerativeTool = (tool: StreamedWidgetType, message: string) => {
    setIsStreaming(true);
    setActionExecuted(null);
    setTimeout(() => {
      setIsStreaming(false);
      setActiveWidget(tool);
      setStreamedText(message);
    }, 650);
  };

  return (
    <>
      {/* Floating Copilot Trigger Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full h-13 px-5 shadow-2xl bg-slate-950 hover:bg-slate-900 text-white border border-slate-700/80 gap-2.5"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-bold text-xs">مساعد مشوار الذكي (AI Copilot)</span>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
            Generative UI
          </Badge>
        </Button>
      </div>

      {/* Generative UI Streaming Drawer / Panel */}
      {isOpen && (
        <div className="fixed bottom-22 left-6 z-50 w-[92vw] sm:w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Card className="border-slate-800 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
            {/* Copilot Header */}
            <CardHeader className="bg-slate-900/90 border-b border-slate-800 py-3.5 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>مساعد العمليات الذكي (Mishwar AI)</span>
                    </CardTitle>
                    <CardDescription className="text-[10px] text-slate-400">
                      مبني على Vercel AI SDK • يولد مكونات تفاعلية حية
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Quick Tool Triggers */}
            <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() =>
                  runGenerativeTool(
                    "overdue-report",
                    "تم توليد بطاقة التحصيل الذكي: 3 طالبات متأخرات عن السداد. يمكنك إرسال روابط الدفع وإيقاف المقاعد بنقرة واحدة:"
                  )
                }
                className={`text-[11px] px-2.5 py-1 rounded-md border whitespace-nowrap transition ${
                  activeWidget === "overdue-report"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                💳 تحصيل المتأخرات
              </button>
              <button
                onClick={() =>
                  runGenerativeTool(
                    "compliance-audit",
                    "فحص امتثال هيئة النقل (TGA): تم رصد وثيقتين تقتربان من الانتهاء قد تسببان غرامة 5,000 ر.س:"
                  )
                }
                className={`text-[11px] px-2.5 py-1 rounded-md border whitespace-nowrap transition ${
                  activeWidget === "compliance-audit"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                🛡️ فحص رخص الهيئة
              </button>
              <button
                onClick={() =>
                  runGenerativeTool(
                    "route-optimizer",
                    "تحليل المسارات والأحياء: مسار «حي الياسمين» يعمل بنسبة إشغال 96%. إليك توصية توزيع الحافلات:"
                  )
                }
                className={`text-[11px] px-2.5 py-1 rounded-md border whitespace-nowrap transition ${
                  activeWidget === "route-optimizer"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                🚌 كفاءة المسارات
              </button>
              <button
                onClick={() =>
                  runGenerativeTool(
                    "qr-card",
                    "تم توليد رمز الاستجابة السريع (QR) الخاص بمؤسستك لمشاركته مع الطالبات في الواتساب:"
                  )
                }
                className={`text-[11px] px-2.5 py-1 rounded-md border whitespace-nowrap transition ${
                  activeWidget === "qr-card"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                📱 باركود التسجيل
              </button>
            </div>

            {/* Streamed Generative UI Content Area */}
            <CardContent className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
              {/* Streamed Text Bubble */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {streamedText}
              </div>

              {isStreaming ? (
                <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                  <span className="text-[11px]">جاري توليد واجهة البيانات التفاعلية (Streaming UI)...</span>
                </div>
              ) : (
                <>
                  {/* Generative Widget 1: Overdue Collection Card */}
                  {activeWidget === "overdue-report" && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                          <span>بطاقة استرداد الدفعات المتأخرة</span>
                        </span>
                        <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">
                          1,950 ر.س مستحقة
                        </Badge>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                          <div>
                            <div className="font-semibold text-slate-200">منيرة الدوسري (حافلة 02)</div>
                            <div className="text-slate-400">حي النرجس • متأخر 4 أيام</div>
                          </div>
                          <span className="font-bold text-amber-400">650 ر.س</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                          <div>
                            <div className="font-semibold text-slate-200">نورة المطيري (حافلة 03)</div>
                            <div className="text-slate-400">حي الصحافة • موقوف آلياً</div>
                          </div>
                          <span className="font-bold text-red-400">650 ر.س</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => {
                          setActionExecuted("تم إرسال 3 روابط دفع عبر الواتساب وتحديث قائمة السائقين بنجاح.");
                          onTriggerAction?.("bulk-reminder");
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold h-8 gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال تذكير جماعي بالواتساب (مدى / Apple Pay)</span>
                      </Button>
                    </div>
                  )}

                  {/* Generative Widget 2: TGA Compliance Audit */}
                  {activeWidget === "compliance-audit" && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          <span>فحص تراخيص الهيئة العامة للنقل</span>
                        </span>
                        <Badge className="bg-amber-500/20 text-amber-300 text-[10px]">تنبيهان عاجلان</Badge>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        <div className="p-2.5 rounded-lg bg-slate-950/90 border border-amber-500/20 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-white">حافلة (أ ب ج 1234) — مرسيدس</div>
                            <div className="text-slate-400">بطاقة التشغيل تنتهي: 2026/11/28</div>
                          </div>
                          <Badge variant="outline" className="border-amber-400/50 text-amber-300 text-[10px]">
                            12 يوم
                          </Badge>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-950/90 border border-amber-500/20 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-white">السائق: محمد السعيد</div>
                            <div className="text-slate-400">رخصة قيادة عمومي تنتهي: 2026/12/04</div>
                          </div>
                          <Badge variant="outline" className="border-amber-400/50 text-amber-300 text-[10px]">
                            18 يوم
                          </Badge>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => setActionExecuted("تم إرسال تنبيه تجديد الرخصة للسائق محمد السعيد وللمعقب الإداري.")}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold h-8"
                      >
                        إشعار السائق والمعقب للتجديد الفوري
                      </Button>
                    </div>
                  )}

                  {/* Generative Widget 3: Route Optimizer */}
                  {activeWidget === "route-optimizer" && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          <span>مؤشر إشغال المسارات والأحياء</span>
                        </span>
                        <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-300">
                          كفاءة 94%
                        </Badge>
                      </div>

                      <div className="space-y-2.5 text-[11px]">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-300">مسار الياسمين ➔ جامعة نورة</span>
                            <span className="font-mono text-emerald-400">29 / 30 مقعد</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[96%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-slate-300">مسار الملقا ➔ جامعة الملك سعود</span>
                            <span className="font-mono text-sky-400">19 / 22 مقعد</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div className="bg-sky-500 h-full w-[86%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generative Widget 4: QR Code Generator */}
                  {activeWidget === "qr-card" && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-center space-y-3">
                      <div className="mx-auto w-fit">
                        <ZatcaQrImage value="http://localhost:3000/darb-alaman" size={136} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">الرابط المباشر لمؤسسة درب الأمان (امسح بالكاميرا)</div>
                        <div className="text-[11px] font-mono text-emerald-400 dir-ltr mt-0.5">
                          https://mishwar.sa/darb-alaman
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setActionExecuted("تم نسخ رابط التسجيل وبطاقة QR لمشاركتها عبر واتساب.")}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs h-8"
                      >
                        نسخ الرابط ومشاركة البطاقة
                      </Button>
                    </div>
                  )}

                  {actionExecuted && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{actionExecuted}</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>

            {/* Input Footer */}
            <CardFooter className="p-3 bg-slate-900 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!prompt.trim()) return;
                  if (prompt.includes("رخص") || prompt.includes("هيئة")) {
                    runGenerativeTool("compliance-audit", `نتائج البحث عن "${prompt}": تم عرض حالة التراخيص:`);
                  } else if (prompt.includes("مسار") || prompt.includes("باص")) {
                    runGenerativeTool("route-optimizer", `تحليل الأسطول لـ "${prompt}":`);
                  } else {
                    runGenerativeTool("overdue-report", `تم تنفيذ طلبك "${prompt}" وتجهيز بطاقة الإجراء الفوري:`);
                  }
                  setPrompt("");
                }}
                className="flex w-full items-center gap-2"
              >
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="اطلب تقريراً أو إجراءً (مثال: فحص رخص السائقين)..."
                  className="h-8 text-xs bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
                />
                <Button type="submit" size="sm" className="h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                  إرسال
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
