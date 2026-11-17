"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bus,
  Send,
  CheckCircle2,
  Bot,
  X,
  Loader2,
  UserCheck,
  MapPin,
  Terminal,
  ArrowUpLeft,
  GraduationCap,
  FileCheck2,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExecutedActionPayload {
  widgetType: string;
  summary: string;
  data?: Record<string, unknown> | Array<Record<string, unknown>>;
  navigateToSection?: string;
}

interface InteractiveFormSpec {
  formType: "student-form" | "bus-form" | "driver-form" | "route-form";
  prefill?: Record<string, unknown>;
  submitted?: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  action?: ExecutedActionPayload;
  interactiveForm?: InteractiveFormSpec;
}

export function MishwarAICopilot({
  tenantSlug = "darb-alaman",
  onActionCompleted,
  onNavigateSection,
}: {
  tenantSlug?: string;
  onActionCompleted?: (summary: string) => void;
  onNavigateSection?: (section: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [interactionId, setInteractionId] = useState<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form states for inline Generative UI Slot-Filling Cards
  const [studentDraft, setStudentDraft] = useState({
    name: "",
    phone: "05",
    guardianPhone: "05",
    district: "حي الياسمين",
    university: "جامعة الأميرة نورة بنت عبدالرحمن",
    bus: "حافلة 01",
    amount: "650",
  });

  const [busDraft, setBusDraft] = useState({
    plate: "",
    model: "تويوتا كوستر 2026",
    capacity: "30",
    assignedDriver: "سعد القحطاني",
    route: "مسار الياسمين والنرجس ➔ جامعة نورة",
    cardNo: "TGA-90120",
    cardExpiry: "2027-12-30",
  });

  const [driverDraft, setDriverDraft] = useState({
    name: "",
    phone: "05",
    nationalId: "10",
    busAssigned: "حافلة 01 (أ ب ج 1234)",
    licenseExpiry: "2028-06-30",
  });

  const [routeDraft, setRouteDraft] = useState({
    name: "",
    districts: "",
    university: "جامعة الأميرة نورة بنت عبدالرحمن",
    monthlyPrice: "650",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      text: "أهلاً بك! أنا وكيل مشوار التفاعلي (Interactive AI Agent).\nقل لي مثلاً: «أضف طالبة» أو «أضف باص» أو «سجل سائق» وسأعطيك بطاقة البيانات اللازمة لتعبئتها واعتمادها فوراً في الموقع وقاعدة بيانات Firebase!",
      timestamp: "الآن",
    },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const sendAgentMessage = async (
    textInput: string,
    directTool?: { name: string; args?: Record<string, unknown> },
    markFormMsgId?: string
  ) => {
    if (markFormMsgId) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === markFormMsgId && m.interactiveForm
            ? { ...m, interactiveForm: { ...m.interactiveForm, submitted: true } }
            : m
        )
      );
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: textInput,
      timestamp: new Date().toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textInput,
          tenantSlug,
          previousInteractionId: interactionId,
          directTool,
        }),
      });

      const data = await res.json();
      if (data.interactionId) {
        setInteractionId(data.interactionId);
      }

      if (data.interactiveForm?.prefill?.name) {
        setStudentDraft((prev) => ({
          ...prev,
          name: String(data.interactiveForm.prefill.name),
        }));
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: data.reply || "تفضل بتعبئة البيانات اللازمة:",
        timestamp: new Date().toLocaleTimeString("ar-SA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: data.actionExecuted,
        interactiveForm: data.interactiveForm,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.actionExecuted) {
        onActionCompleted?.(data.actionExecuted.summary);
        if (data.actionExecuted.navigateToSection) {
          onNavigateSection?.(data.actionExecuted.navigateToSection);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "تعذر الاتصال بمحرك الذكاء الاصطناعي، يرجى المحاولة مرة أخرى.",
          timestamp: "الآن",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <>
      {/* Floating Pro Max AI Agent Launcher */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full h-14 px-6 shadow-2xl royal-gradient hover:opacity-95 text-white border border-emerald-500/40 gap-3 emerald-glow transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
          </div>
          <div className="text-right">
            <div className="font-bold text-xs leading-none">وكيل صَرْحِي التفاعلي (AI Agent)</div>
            <div className="text-[10px] text-emerald-300/90 font-normal mt-1">
              اطلب إضافة طالبة أو باص أو سائق وتفاعل معه
            </div>
          </div>
          <Badge className="bg-emerald-500/25 text-emerald-200 border-emerald-400/30 text-[10px] font-mono">
            Interactive
          </Badge>
        </Button>
      </div>

      {/* Generative UI Interactive Agent Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-[94vw] sm:w-[475px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Card className="border-slate-800 bg-[#0B1120] text-slate-100 shadow-2xl overflow-hidden rounded-2xl ring-1 ring-emerald-500/30">
            {/* Agent Header */}
            <CardHeader className="royal-gradient border-b border-slate-800/90 py-3.5 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                      <span>وكيل صَرْحِي للعمليات التفاعلية (Sarhy AI)</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </CardTitle>
                    <CardDescription className="text-[11px] text-slate-300">
                      يفتح لك نماذج الإدخال الذكية داخل الشات ويعتمدها في Firebase
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Interactive Trigger Chips (Opens Slot-Filling Forms!) */}
            <div className="px-3.5 py-2.5 bg-slate-900/95 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                disabled={isStreaming}
                onClick={() => sendAgentMessage("أضف طالبة جديدة")}
                className="text-[11px] px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/70 font-bold whitespace-nowrap transition flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3" />
                <span>إضافة طالبة</span>
              </button>

              <button
                type="button"
                disabled={isStreaming}
                onClick={() => sendAgentMessage("أضف باص جديد")}
                className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-500/40 whitespace-nowrap transition flex items-center gap-1"
              >
                <Bus className="w-3 h-3 text-emerald-400" />
                <span>إضافة باص</span>
              </button>

              <button
                type="button"
                disabled={isStreaming}
                onClick={() => sendAgentMessage("سجل سائق جديد")}
                className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-500/40 whitespace-nowrap transition flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>تسجيل سائق</span>
              </button>

              <button
                type="button"
                disabled={isStreaming}
                onClick={() => sendAgentMessage("أضف مسار جديد")}
                className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-500/40 whitespace-nowrap transition flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>إضافة مسار</span>
              </button>
            </div>

            {/* Streamed Conversation & Interactive Inline Forms */}
            <CardContent
              ref={scrollRef}
              className="p-4 space-y-3.5 max-h-[420px] overflow-y-auto scroll-smooth"
            >
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2.5">
                  <div
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-start" : "items-end"
                    }`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-emerald-600 text-white font-semibold rounded-tr-xs"
                          : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs"
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                      <div
                        className={`text-[9px] mt-1 ${
                          msg.role === "user" ? "text-emerald-200" : "text-slate-500"
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* 1. INTERACTIVE INLINE FORM: ADD STUDENT */}
                  {msg.interactiveForm?.formType === "student-form" && !msg.interactiveForm.submitted && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendAgentMessage(
                          `اعتماد تسجيل الطالبة: ${studentDraft.name} (${studentDraft.district})`,
                          {
                            name: "create_student",
                            args: {
                              ...studentDraft,
                              amount: Number(studentDraft.amount) || 650,
                            },
                          },
                          msg.id
                        );
                        setStudentDraft({
                          name: "",
                          phone: "05",
                          guardianPhone: "05",
                          district: "حي الياسمين",
                          university: "جامعة الأميرة نورة بنت عبدالرحمن",
                          bus: "حافلة 01",
                          amount: "650",
                        });
                      }}
                      className="rounded-xl border border-emerald-500/40 bg-slate-900/95 p-3.5 space-y-3 animate-in zoom-in-95 duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-emerald-400" />
                          <span>بطاقة تسجيل طالبة جديدة وإصدار فاتورة ZATCA</span>
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px]">
                          نموذج تفاعلي
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <Label className="text-[11px] text-slate-300">اسم الطالبة الثلاثي *</Label>
                          <Input
                            required
                            placeholder="مثال: ريم بنت فهد العتيبي"
                            value={studentDraft.name}
                            onChange={(e) => setStudentDraft({ ...studentDraft, name: e.target.value })}
                            className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[11px] text-slate-300">جوال الطالبة *</Label>
                            <Input
                              required
                              dir="ltr"
                              placeholder="05XXXXXXXX"
                              value={studentDraft.phone}
                              onChange={(e) => setStudentDraft({ ...studentDraft, phone: e.target.value })}
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white font-mono text-right mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-slate-300">جوال ولي الأمر (للواتساب) *</Label>
                            <Input
                              required
                              dir="ltr"
                              placeholder="05XXXXXXXX"
                              value={studentDraft.guardianPhone}
                              onChange={(e) =>
                                setStudentDraft({ ...studentDraft, guardianPhone: e.target.value })
                              }
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white font-mono text-right mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[11px] text-slate-300">الحي السكني *</Label>
                            <Input
                              required
                              placeholder="حي الياسمين"
                              value={studentDraft.district}
                              onChange={(e) =>
                                setStudentDraft({ ...studentDraft, district: e.target.value })
                              }
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-slate-300">الجامعة *</Label>
                            <Input
                              required
                              value={studentDraft.university}
                              onChange={(e) =>
                                setStudentDraft({ ...studentDraft, university: e.target.value })
                              }
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[11px] text-slate-300">الحافلة المخصصة</Label>
                            <Input
                              value={studentDraft.bus}
                              onChange={(e) => setStudentDraft({ ...studentDraft, bus: e.target.value })}
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-slate-300">الاشتراك الشهري (ر.س)</Label>
                            <Input
                              type="number"
                              required
                              value={studentDraft.amount}
                              onChange={(e) =>
                                setStudentDraft({ ...studentDraft, amount: e.target.value })
                              }
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white font-mono mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="sm"
                        className="w-full h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>اعتماد وتسجيل الطالبة في النظام و Firebase</span>
                      </Button>
                    </form>
                  )}

                  {/* 2. INTERACTIVE INLINE FORM: ADD BUS */}
                  {msg.interactiveForm?.formType === "bus-form" && !msg.interactiveForm.submitted && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendAgentMessage(
                          `اعتماد إضافة الباص: ${busDraft.model} لوحة (${busDraft.plate})`,
                          {
                            name: "add_bus",
                            args: {
                              ...busDraft,
                              capacity: Number(busDraft.capacity) || 30,
                            },
                          },
                          msg.id
                        );
                        setBusDraft({
                          plate: "",
                          model: "تويوتا كوستر 2026",
                          capacity: "30",
                          assignedDriver: "سعد القحطاني",
                          route: "مسار الياسمين والنرجس ➔ جامعة نورة",
                          cardNo: "TGA-90120",
                          cardExpiry: "2027-12-30",
                        });
                      }}
                      className="rounded-xl border border-emerald-500/40 bg-slate-900/95 p-3.5 space-y-3 animate-in zoom-in-95 duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <Bus className="w-4 h-4 text-emerald-400" />
                          <span>بطاقة إضافة باص جديد للأسطول</span>
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px]">
                          نموذج تفاعلي
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[11px] text-slate-300">رقم اللوحة *</Label>
                            <Input
                              required
                              placeholder="مثال: ر ي ض 2030"
                              value={busDraft.plate}
                              onChange={(e) => setBusDraft({ ...busDraft, plate: e.target.value })}
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-slate-300">عدد المقاعد *</Label>
                            <Input
                              type="number"
                              required
                              value={busDraft.capacity}
                              onChange={(e) => setBusDraft({ ...busDraft, capacity: e.target.value })}
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white font-mono mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-[11px] text-slate-300">نوع وموديل الحافلة *</Label>
                          <Input
                            required
                            placeholder="تويوتا كوستر 2026"
                            value={busDraft.model}
                            onChange={(e) => setBusDraft({ ...busDraft, model: e.target.value })}
                            className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[11px] text-slate-300">رقم بطاقة التشغيل TGA</Label>
                            <Input
                              value={busDraft.cardNo}
                              onChange={(e) => setBusDraft({ ...busDraft, cardNo: e.target.value })}
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white font-mono mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-slate-300">انتهاء بطاقة التشغيل</Label>
                            <Input
                              type="date"
                              required
                              value={busDraft.cardExpiry}
                              onChange={(e) => setBusDraft({ ...busDraft, cardExpiry: e.target.value })}
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white font-mono mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="sm"
                        className="w-full h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>حفظ وإضافة الباص في الأسطول و Firebase</span>
                      </Button>
                    </form>
                  )}

                  {/* 3. INTERACTIVE INLINE FORM: ADD DRIVER */}
                  {msg.interactiveForm?.formType === "driver-form" && !msg.interactiveForm.submitted && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendAgentMessage(
                          `اعتماد تسجيل السائق: ${driverDraft.name} (${driverDraft.phone})`,
                          {
                            name: "add_driver",
                            args: driverDraft,
                          },
                          msg.id
                        );
                        setDriverDraft({
                          name: "",
                          phone: "05",
                          nationalId: "10",
                          busAssigned: "حافلة 01 (أ ب ج 1234)",
                          licenseExpiry: "2028-06-30",
                        });
                      }}
                      className="rounded-xl border border-emerald-500/40 bg-slate-900/95 p-3.5 space-y-3 animate-in zoom-in-95 duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span>بطاقة تسجيل سائق جديد للمؤسسة</span>
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px]">
                          نموذج تفاعلي
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <Label className="text-[11px] text-slate-300">اسم السائق الثلاثي *</Label>
                          <Input
                            required
                            placeholder="مثال: فهد عبدالرحمن القحطاني"
                            value={driverDraft.name}
                            onChange={(e) => setDriverDraft({ ...driverDraft, name: e.target.value })}
                            className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[11px] text-slate-300">رقم الجوال *</Label>
                            <Input
                              required
                              dir="ltr"
                              placeholder="05XXXXXXXX"
                              value={driverDraft.phone}
                              onChange={(e) => setDriverDraft({ ...driverDraft, phone: e.target.value })}
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white font-mono text-right mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-slate-300">رقم الهوية / الإقامة *</Label>
                            <Input
                              required
                              dir="ltr"
                              placeholder="10XXXXXXXX"
                              value={driverDraft.nationalId}
                              onChange={(e) =>
                                setDriverDraft({ ...driverDraft, nationalId: e.target.value })
                              }
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white font-mono text-right mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[11px] text-slate-300">الباص المسند</Label>
                            <Input
                              value={driverDraft.busAssigned}
                              onChange={(e) =>
                                setDriverDraft({ ...driverDraft, busAssigned: e.target.value })
                              }
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-slate-300">انتهاء رخصة القيادة</Label>
                            <Input
                              type="date"
                              required
                              value={driverDraft.licenseExpiry}
                              onChange={(e) =>
                                setDriverDraft({ ...driverDraft, licenseExpiry: e.target.value })
                              }
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white font-mono mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="sm"
                        className="w-full h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>اعتماد وتسجيل السائق في Firebase</span>
                      </Button>
                    </form>
                  )}

                  {/* 4. INTERACTIVE INLINE FORM: ADD ROUTE */}
                  {msg.interactiveForm?.formType === "route-form" && !msg.interactiveForm.submitted && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendAgentMessage(
                          `اعتماد إضافة المسار: ${routeDraft.name} (${routeDraft.districts})`,
                          {
                            name: "add_route",
                            args: {
                              ...routeDraft,
                              monthlyPrice: Number(routeDraft.monthlyPrice) || 650,
                            },
                          },
                          msg.id
                        );
                        setRouteDraft({
                          name: "",
                          districts: "",
                          university: "جامعة الأميرة نورة بنت عبدالرحمن",
                          monthlyPrice: "650",
                        });
                      }}
                      className="rounded-xl border border-emerald-500/40 bg-slate-900/95 p-3.5 space-y-3 animate-in zoom-in-95 duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span>بطاقة إضافة مسار نقل جديد</span>
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px]">
                          نموذج تفاعلي
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <Label className="text-[11px] text-slate-300">اسم المسار *</Label>
                          <Input
                            required
                            placeholder="مثال: مسار أحياء شرق الرياض"
                            value={routeDraft.name}
                            onChange={(e) => setRouteDraft({ ...routeDraft, name: e.target.value })}
                            className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-[11px] text-slate-300">الأحياء المشمولة *</Label>
                          <Input
                            required
                            placeholder="حي الروضة، حي الخليج، حي القدس"
                            value={routeDraft.districts}
                            onChange={(e) =>
                              setRouteDraft({ ...routeDraft, districts: e.target.value })
                            }
                            className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[11px] text-slate-300">الجامعة</Label>
                            <Input
                              required
                              value={routeDraft.university}
                              onChange={(e) =>
                                setRouteDraft({ ...routeDraft, university: e.target.value })
                              }
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px] text-slate-300">السعر الشهري (ر.س)</Label>
                            <Input
                              type="number"
                              required
                              value={routeDraft.monthlyPrice}
                              onChange={(e) =>
                                setRouteDraft({ ...routeDraft, monthlyPrice: e.target.value })
                              }
                              className="h-8 text-xs bg-slate-950 border-slate-700 text-white font-mono mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="sm"
                        className="w-full h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>نشر المسار في موقع الطالبات و Firebase</span>
                      </Button>
                    </form>
                  )}

                  {/* Executed Confirmation Card */}
                  {msg.action && (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 space-y-2.5 animate-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          <span>تم الحفظ الفعلي في النظام و Firebase</span>
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px] font-mono">
                          SYNCED ✓
                        </Badge>
                      </div>

                      {msg.action.widgetType === "student-created" &&
                        msg.action.data &&
                        !Array.isArray(msg.action.data) && (
                          <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <div>
                                <div className="font-bold text-white">
                                  {String(msg.action.data.name)}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {String(msg.action.data.district)} ➔{" "}
                                  {String(msg.action.data.university)}
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px] text-emerald-300 border-emerald-500/40"
                            >
                              {String(msg.action.data.invoiceNo)}
                            </Badge>
                          </div>
                        )}

                      {msg.action.navigateToSection && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onNavigateSection?.(msg.action!.navigateToSection!)}
                          className="w-full h-7 text-[11px] bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white gap-1"
                        >
                          <span>عرض السجل المضاف في الجدول الآن</span>
                          <ArrowUpLeft className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isStreaming && (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center gap-3 text-slate-300">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
                  <span className="text-xs">جاري التفاعل وتجهيز النموذج...</span>
                </div>
              )}
            </CardContent>

            {/* Conversational Input Footer */}
            <CardFooter className="p-3 bg-slate-900/95 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!prompt.trim() || isStreaming) return;
                  const currentPrompt = prompt;
                  setPrompt("");
                  sendAgentMessage(currentPrompt);
                }}
                className="flex w-full items-center gap-2"
              >
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="اكتب مثلاً: «أضف طالبة» أو «أضف باص» أو «سجل سائق»..."
                  className="h-9 text-xs bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isStreaming}
                  className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
