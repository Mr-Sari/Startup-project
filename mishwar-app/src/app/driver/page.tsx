"use client";

import { useState } from "react";
import { Check, X, Bell, Bus, MapPin, CheckCircle2, PhoneCall, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function DriverAppPage() {
  const [students, setStudents] = useState([
    { id: "1", name: "ريم فهد القحطاني", district: "حي الياسمين - شارع القلعة", status: "none", guardian: "0501112233" },
    { id: "2", name: "شهد الشمري", district: "حي الياسمين - قرب جامع الهدى", status: "none", guardian: "0554445566" },
    { id: "3", name: "سارة العتيبي", district: "حي الياسمين - فيلا 42", status: "none", guardian: "0567778899" },
    { id: "4", name: "نورة المطيري", district: "حي الصحافة - مخرج 5", status: "suspended", guardian: "0532223344" },
  ]);

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [tripCompleted, setTripCompleted] = useState(false);

  const handleStatusChange = (studentId: string, status: "boarded" | "missed", studentName: string, guardianPhone: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );

    if (status === "boarded") {
      setNotificationMsg(`تم إرسال تنبيه لولي أمر (${studentName}) على الرقم ${guardianPhone}: «ركبت الطالبة الباص بأمان متجهة إلى الجامعة»`);
    } else {
      setNotificationMsg(`تم تسجيل «ما ركبت» للطالبة (${studentName}) وإشعار ولي الأمر.`);
    }

    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col max-w-md mx-auto border-x border-slate-800 shadow-2xl">
      {/* Driver Top Bar */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black text-white">حافلة (01) — السائق: محمد السعيد</div>
            <div className="text-[11px] text-slate-400">مسار حي الياسمين ➔ جامعة الأميرة نورة</div>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild className="h-8 text-xs border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
          <Link href="/dashboard">لوحة الإدارة</Link>
        </Button>
      </header>

      {/* Live Guardian Alert Banner */}
      {notificationMsg && (
        <div className="p-3 bg-emerald-600 text-white text-xs flex items-center gap-2 shadow-md">
          <Bell className="w-4 h-4 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Student Boarding List */}
      <main className="p-4 flex-1 space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-400 px-1">
          <span>كشف الجولة الصباحية (تأشير الركوب):</span>
          <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
            {students.filter((s) => s.status === "boarded").length} / 3 صعدن
          </Badge>
        </div>

        {students.map((student, idx) => {
          const isSuspended = student.status === "suspended";
          const isBoarded = student.status === "boarded";
          const isMissed = student.status === "missed";

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
                      <span>{student.district}</span>
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
                      onClick={() => handleStatusChange(student.id, "boarded", student.name, student.guardian)}
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
                      onClick={() => handleStatusChange(student.id, "missed", student.name, student.guardian)}
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

      {/* Driver Footer */}
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
