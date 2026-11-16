"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, X, Bell, Bus, MapPin, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface DriverStudent {
  id: string;
  name: string;
  district: string;
  university: string;
  status: "paid" | "overdue" | "suspended";
  boardingStatus: "none" | "boarded" | "missed";
  guardianPhone: string;
  lastBoardedAt?: string;
}

function DriverContent() {
  const searchParams = useSearchParams();
  const currentSlug = searchParams?.get("tenant") || "darb-alaman";

  const [tenantName, setTenantName] = useState("مؤسسة النقل");
  const [students, setStudents] = useState<DriverStudent[]>([]);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [tripCompleted, setTripCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchManifest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tenant-data?tenant=${currentSlug}`);
      const data = await res.json();
      if (data.tenant) setTenantName(data.tenant.name);
      if (data.students) setStudents(data.students);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManifest();
  }, [currentSlug]);

  const handleStatusChange = async (
    studentId: string,
    boardingStatus: "boarded" | "missed",
    studentName: string,
    guardianPhone: string
  ) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, boardingStatus } : s))
    );

    await fetch("/api/tenant-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "DRIVER_BOARDING",
        tenantSlug: currentSlug,
        payload: { studentId, boardingStatus },
      }),
    });

    if (boardingStatus === "boarded") {
      setNotificationMsg(
        `تم إرسال تنبيه من (${tenantName}) لولي أمر (${studentName}) على الرقم ${guardianPhone}: «ركبت الطالبة الباص بأمان»`
      );
    } else {
      setNotificationMsg(`تم تسجيل «ما ركبت» للطالبة (${studentName}) وإشعار ولي الأمر.`);
    }

    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col max-w-md mx-auto border-x border-slate-800 shadow-2xl">
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black text-white">{tenantName}</div>
            <div className="text-[11px] text-slate-400">شاشة السائق الميدانية • تأشير الركوب</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchManifest}
            className="h-8 w-8 p-0 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 text-xs border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <Link href={`/dashboard?tenant=${currentSlug}`}>الإدارة</Link>
          </Button>
        </div>
      </header>

      {notificationMsg && (
        <div className="p-3 bg-emerald-600 text-white text-xs flex items-center gap-2 shadow-md">
          <Bell className="w-4 h-4 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      <main className="p-4 flex-1 space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-400 px-1">
          <span>كشف طالبات الجولة:</span>
          <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
            {students.filter((s) => s.boardingStatus === "boarded").length} /{" "}
            {students.filter((s) => s.status !== "suspended").length} صعدن
          </Badge>
        </div>

        {students.map((student, idx) => {
          const isSuspended = student.status === "suspended";
          const isBoarded = student.boardingStatus === "boarded";
          const isMissed = student.boardingStatus === "missed";

          return (
            <Card
              key={student.id}
              className={`border transition ${
                isSuspended
                  ? "bg-slate-900/40 border-red-900/50 opacity-70"
                  : isBoarded
                  ? "bg-emerald-950/30 border-emerald-500/50 text-white"
                  : "bg-slate-900 border-slate-800 text-white"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[11px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <span className={isSuspended ? "text-red-400 line-through" : "text-white"}>
                        {student.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 mr-7">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {student.district} ➔ {student.university}
                      </span>
                    </div>
                  </div>

                  {isBoarded && (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                      ✓ ركبت الباص
                    </Badge>
                  )}
                  {isMissed && (
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">
                      ما ركبت
                    </Badge>
                  )}
                </div>

                {isSuspended ? (
                  <div className="text-xs bg-red-950/60 border border-red-900/80 text-red-300 p-2.5 rounded-lg flex items-center justify-center gap-1.5 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>إيقاف تلقائي — لم يتم سداد الاشتراك</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800">
                    <Button
                      onClick={() =>
                        handleStatusChange(student.id, "boarded", student.name, student.guardianPhone)
                      }
                      className={`h-11 font-bold text-xs gap-1.5 ${
                        isBoarded
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : "bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40"
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>ركبت</span>
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleStatusChange(student.id, "missed", student.name, student.guardianPhone)
                      }
                      className={`h-11 font-bold text-xs gap-1.5 ${
                        isMissed
                          ? "bg-slate-700 text-white"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>ما ركبت</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </main>

      <footer className="p-4 bg-slate-900 border-t border-slate-800">
        {tripCompleted ? (
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold">
            ✓ تم إنهاء الجولة بنجاح وإشعار إدارة المؤسسة بالوصول للجامعة
          </div>
        ) : (
          <Button
            onClick={() => setTripCompleted(true)}
            size="lg"
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>إنهاء الجولة والوصول للجامعة</span>
          </Button>
        )}
      </footer>
    </div>
  );
}

export default function DriverAppPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-white">جاري تحميل شاشة السائق...</div>}>
      <DriverContent />
    </Suspense>
  );
}
