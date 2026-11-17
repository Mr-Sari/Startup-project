"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  Bus,
  AlertTriangle,
  CreditCard,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Send,
  Building2,
  Plus,
  ShieldCheck,
  UserCheck,
  MapPin,
  QrCode,
  RefreshCw,
  Settings,
  Save,
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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MishwarAICopilot } from "@/components/mishwar-ai-copilot";
import { ZatcaQrImage } from "@/components/zatca-qr-image";
import type {
  TenantProfile,
  StudentRecord,
  BusRecord,
  DriverRecord,
  RouteRecord,
  AuditLogEntry,
  NotificationLogEntry,
} from "@/lib/db";

type DashboardSection =
  | "subscriptions"
  | "buses"
  | "drivers"
  | "routes"
  | "compliance"
  | "staff"
  | "settings";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentSlug = searchParams?.get("tenant") || "darb-alaman";

  const [activeSection, setActiveSection] = useState<DashboardSection>("subscriptions");
  const [tenant, setTenant] = useState<TenantProfile | null>(null);
  const [allTenants, setAllTenants] = useState<TenantProfile[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [buses, setBuses] = useState<BusRecord[]>([]);
  const [drivers, setDrivers] = useState<DriverRecord[]>([]);
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [notifications, setNotifications] = useState<NotificationLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Company Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    crNumber: "",
    vatNumber: "",
    licenseNumber: "",
    whatsappPhone: "",
    supportPhone: "",
    iban: "",
    city: "",
    primaryColor: "#0F172A",
    monthlyFee: "650",
    districtsText: "",
  });

  const [staff] = useState([
    { id: "s1", name: "فهد العتيبي", role: "مالك المؤسسة (صلاحية كاملة)", phone: "0501234567", status: "نشط" },
    { id: "s2", name: "عمر الدوسري", role: "مشرف حركة وباصات", phone: "0552345678", status: "نشط" },
    { id: "s3", name: "سلمان القحطاني", role: "محاسب وتحصيل وفواتير", phone: "0563456789", status: "نشط" },
  ]);

  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [selectedInvoiceStudent, setSelectedInvoiceStudent] = useState<StudentRecord | null>(null);

  const [newBus, setNewBus] = useState({
    plate: "",
    model: "",
    capacity: "30",
    assignedDriver: "محمد السعيد",
    route: "مسار الياسمين والنرجس ➔ جامعة نورة",
    cardNo: "",
    cardExpiry: "",
  });

  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    nationalId: "",
    busAssigned: "حافلة 01 (أ ب ج 1234)",
    licenseExpiry: "",
  });

  const [newRoute, setNewRoute] = useState({
    name: "",
    districts: "",
    university: "جامعة الأميرة نورة بنت عبدالرحمن",
    monthlyPrice: "650",
    bus: "حافلة 01 (30 مقعد)",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadTenantData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tenant-data?tenant=${currentSlug}`);
      const data = await res.json();
      if (data.tenant) {
        setTenant(data.tenant);
        setSettingsForm({
          name: data.tenant.name || "",
          crNumber: data.tenant.crNumber || "",
          vatNumber: data.tenant.vatNumber || "",
          licenseNumber: data.tenant.licenseNumber || "",
          whatsappPhone: data.tenant.whatsappPhone || "",
          supportPhone: data.tenant.supportPhone || "",
          iban: data.tenant.iban || "",
          city: data.tenant.city || "",
          primaryColor: data.tenant.primaryColor || "#0F172A",
          monthlyFee: String(data.tenant.monthlyFee || 650),
          districtsText: (data.tenant.districts || []).join("، "),
        });
      }
      setAllTenants(data.allTenants || []);
      setStudents(data.students || []);
      setBuses(data.buses || []);
      setDrivers(data.drivers || []);
      setRoutes(data.routes || []);
      setAuditLogs(data.auditLogs || []);
      setNotifications(data.notifications || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTenantData();
  }, [currentSlug]);

  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingModal(true);
    try {
      const res = await fetch("/api/tenant-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "UPDATE_TENANT_SETTINGS",
          tenantSlug: currentSlug,
          payload: settingsForm,
        }),
      });
      if (res.ok) {
        await loadTenantData();
        showToast(
          "تم حفظ البيانات الأساسية للمؤسسة وتحديث الرقم الضريبي في فواتير ZATCA ورقم الواتساب بنجاح."
        );
      } else {
        showToast("حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة ثانية.");
      }
    } catch {
      showToast("تعذر الاتصال بالخادم.");
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingModal(true);
    try {
      const res = await fetch("/api/tenant-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ADD_BUS",
          tenantSlug: currentSlug,
          payload: newBus,
        }),
      });
      if (res.ok) {
        await loadTenantData();
        setIsBusModalOpen(false);
        setNewBus({
          plate: "",
          model: "",
          capacity: "30",
          assignedDriver: "محمد السعيد",
          route: "مسار الياسمين والنرجس ➔ جامعة نورة",
          cardNo: "",
          cardExpiry: "",
        });
        showToast("تمت إضافة الحافلة الجديدة وربط بطاقة التشغيل بنجاح.");
      } else {
        showToast("حدث خطأ أثناء إضافة الباص، يرجى المحاولة ثانية.");
      }
    } catch {
      showToast("تعذر الاتصال بالخادم.");
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingModal(true);
    try {
      const res = await fetch("/api/tenant-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ADD_DRIVER",
          tenantSlug: currentSlug,
          payload: newDriver,
        }),
      });
      if (res.ok) {
        await loadTenantData();
        setIsDriverModalOpen(false);
        setNewDriver({
          name: "",
          phone: "",
          nationalId: "",
          busAssigned: "حافلة 01 (أ ب ج 1234)",
          licenseExpiry: "",
        });
        showToast("تم تسجيل السائق الجديد وإرسال رابط شاشة السائق إلى جواله.");
      } else {
        showToast("حدث خطأ أثناء إضافة السائق، يرجى المحاولة ثانية.");
      }
    } catch {
      showToast("تعذر الاتصال بالخادم.");
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleAddRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingModal(true);
    try {
      const res = await fetch("/api/tenant-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ADD_ROUTE",
          tenantSlug: currentSlug,
          payload: newRoute,
        }),
      });
      if (res.ok) {
        await loadTenantData();
        setIsRouteModalOpen(false);
        setNewRoute({
          name: "",
          districts: "",
          university: "جامعة الأميرة نورة بنت عبدالرحمن",
          monthlyPrice: "650",
          bus: "حافلة 01 (30 مقعد)",
        });
        showToast("تم نشر المسار الجديد في موقع المؤسسة للطالبات.");
      } else {
        showToast("حدث خطأ أثناء إضافة المسار، يرجى المحاولة ثانية.");
      }
    } catch {
      showToast("تعذر الاتصال بالخادم.");
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const toggleStudentSuspension = async (studentId: string) => {
    const res = await fetch("/api/tenant-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "TOGGLE_SUSPENSION",
        tenantSlug: currentSlug,
        payload: { studentId },
      }),
    });
    if (res.ok) {
      await loadTenantData();
      showToast("تم تحديث حالة مقعد الطالبة ومزامنته مع شاشة السائق.");
    }
  };

  const sendWhatsAppPaymentReminder = async (student: StudentRecord) => {
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantSlug: currentSlug,
        recipientPhone: student.guardianPhone,
        studentName: student.name,
        messageType: "payment_reminder",
        amount: student.amount,
      }),
    });
    if (res.ok) {
      await loadTenantData();
      showToast(
        `تم إرسال رسالة تذكير من واتساب المؤسسة (${tenant?.whatsappPhone}) لولي أمر الطالبة (${student.name}).`
      );
    }
  };

  const totalCollected = students
    .filter((s) => s.status === "paid")
    .reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="min-h-screen bg-grid-pattern flex flex-col md:flex-row text-foreground">
      {/* Pro Max Royal Obsidian Sidebar */}
      <aside className="w-full md:w-76 royal-gradient text-slate-300 p-5 flex flex-col justify-between border-l border-emerald-950/60 shrink-0 shadow-2xl">
        <div>
          {/* Tenant Switcher & Add New Company Button */}
          <div className="pb-4 border-b border-slate-800 mb-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">المؤسسة الحالية:</span>
              <Link
                href="/register-tenant"
                className="text-[11px] text-emerald-400 hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة مؤسسة جديدة</span>
              </Link>
            </div>

            <select
              value={currentSlug}
              onChange={(e) => router.push(`/dashboard?tenant=${e.target.value}`)}
              className="w-full h-9 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none"
            >
              {allTenants.map((t) => (
                <option key={t.id} value={t.slug}>
                  {t.name} ({t.slug})
                </option>
              ))}
            </select>

            {tenant && (
              <div className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                <div>الرقم الضريبي: <span className="font-mono text-slate-300">{tenant.vatNumber}</span></div>
                <div>واتساب المؤسسة: <span className="font-mono text-emerald-400 dir-ltr">{tenant.whatsappPhone}</span></div>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveSection("subscriptions")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition text-right ${
                activeSection === "subscriptions"
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>الطلبات والاشتراكات والتحصيل</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-slate-900 text-slate-300 border-slate-700">
                {students.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveSection("buses")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition text-right ${
                activeSection === "buses"
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bus className="w-4 h-4 text-slate-400" />
                <span>إدارة الباصات والأسطول</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-slate-900 text-slate-300 border-slate-700">
                {buses.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveSection("drivers")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition text-right ${
                activeSection === "drivers"
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>إدارة السائقين والرخص</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-slate-900 text-slate-300 border-slate-700">
                {drivers.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveSection("routes")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition text-right ${
                activeSection === "routes"
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>المسارات والأحياء والأسعار</span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-slate-900 text-slate-300 border-slate-700">
                {routes.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveSection("settings")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition text-right ${
                activeSection === "settings"
                  ? "bg-emerald-600 text-white font-bold"
                  : "text-emerald-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>بيانات وإعدادات المؤسسة (الضريبي والواتساب)</span>
              </div>
            </button>

            <button
              onClick={() => setActiveSection("compliance")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition text-right ${
                activeSection === "compliance"
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>تنبيهات الرخص وبطاقات التشغيل</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveSection("staff")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition text-right ${
                activeSection === "staff"
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>الفريق، رسائل الواتساب، والسجل</span>
              </div>
            </button>

            <Separator className="my-3 bg-slate-800" />

            <Link
              href={`/${currentSlug}`}
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 transition"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>معاينة موقع المؤسسة للطالبات</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/driver?tenant=${currentSlug}`}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 transition"
            >
              <div className="flex items-center gap-2.5">
                <Bus className="w-4 h-4 text-emerald-400" />
                <span>شاشة السائق (ركبت / ما ركبت)</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>

        {/* Bottom Tenant URL Box */}
        <div className="border-t border-slate-800 pt-4 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex justify-between items-center">
            <span>رابط المؤسسة المستقل:</span>
            <Badge variant="outline" className="text-[10px] bg-slate-900 text-emerald-400 border-slate-800">
              نشط
            </Badge>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 dir-ltr text-center">
            mishwar.sa/{currentSlug}
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Top Action Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight">
                {tenant?.name || "لوحة تحكم المؤسسة"}
              </h1>
              <Badge variant="secondary" className="text-xs font-bold">
                الرقم الضريبي: {tenant?.vatNumber}
              </Badge>
              <Badge className="bg-emerald-600 text-white text-[10px]">
                🔥 متصل بـ Firebase (mishwar-sa)
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              واتساب المؤسسة المعتمد: <span className="font-mono dir-ltr">{tenant?.whatsappPhone}</span> • ترخيص هيئة النقل: {tenant?.licenseNumber}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" asChild className="gap-1.5 font-bold">
              <Link href="/register-tenant">
                <Plus className="w-4 h-4" />
                <span>تسجيل مؤسسة جديدة</span>
              </Link>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setActiveSection("settings")}
              className="gap-1.5 font-bold"
            >
              <Settings className="w-4 h-4" />
              <span>تعديل بيانات الشركة</span>
            </Button>
            <Button size="sm" onClick={() => setIsBusModalOpen(true)} className="gap-1.5 font-bold">
              <Plus className="w-4 h-4" />
              <span>إضافة باص</span>
            </Button>
            <Button size="sm" onClick={() => setIsDriverModalOpen(true)} className="gap-1.5 font-bold">
              <Plus className="w-4 h-4" />
              <span>إضافة سائق</span>
            </Button>
          </div>
        </header>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-slate-950 text-white text-xs flex items-center justify-between shadow-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-[11px]">
              إغلاق
            </button>
          </div>
        )}

        {/* Top Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="pro-card border-r-4 border-r-emerald-600">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold text-muted-foreground">إجمالي تحصيل الاشتراكات</CardDescription>
              <CardTitle className="text-3xl font-black text-emerald-950 font-mono">
                {totalCollected.toLocaleString()} <span className="text-sm font-sans font-normal text-muted-foreground">ر.س</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] text-emerald-700 font-bold">0% عمولة • كامل المبلغ لحساب المؤسسة</div>
            </CardContent>
          </Card>

          <Card className="pro-card border-r-4 border-r-slate-800">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold text-muted-foreground">الباصات العاملة بالأسطول</CardDescription>
              <CardTitle className="text-3xl font-black font-mono">
                {buses.length} <span className="text-sm font-sans font-normal text-muted-foreground">باصات</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] text-muted-foreground font-medium">مرتبطة بـ {routes.length} مسارات جامعية</div>
            </CardContent>
          </Card>

          <Card className="pro-card border-r-4 border-r-amber-500">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold text-muted-foreground">السائقون المسجلون</CardDescription>
              <CardTitle className="text-3xl font-black font-mono">
                {drivers.length} <span className="text-sm font-sans font-normal text-muted-foreground">سائقين</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] text-amber-700 font-bold">متابعة تلقائية لتواريخ الرخص</div>
            </CardContent>
          </Card>

          <Card className="pro-card border-r-4 border-r-red-500">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold text-muted-foreground">إيقاف تلقائي لعدم السداد</CardDescription>
              <CardTitle className="text-3xl font-black text-destructive font-mono">
                {students.filter((s) => s.status !== "paid").length}{" "}
                <span className="text-sm font-sans font-normal text-muted-foreground">طالبات</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] text-destructive font-bold">محجوبات آلياً من شاشة السائق</div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION: Company Settings (Edit VAT, WhatsApp, CR, License, etc.) */}
        {activeSection === "settings" && (
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-1 text-emerald-700 bg-emerald-50 border-emerald-200">
                إعدادات الشركة والفوترة الضريبية (ZATCA)
              </Badge>
              <CardTitle className="text-lg font-black">
                البيانات الأساسية لمؤسسة النقل (تُدار بواسطة الشركة)
              </CardTitle>
              <CardDescription className="text-xs">
                أي تعديل هنا ينعكس فوراً على موقع الطالبات (`/{currentSlug}`)، باركود الفاتورة الضريبية ZATCA، ورقم الواتساب المرسل للتنبيهات.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveSettings}>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">اسم المؤسسة / الشركة (يظهر في الفاتورة الضريبية)</Label>
                    <Input
                      required
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">الرقم الضريبي (15 رقماً - ZATCA VAT Number)</Label>
                    <Input
                      required
                      maxLength={15}
                      dir="ltr"
                      className="font-mono text-right"
                      value={settingsForm.vatNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, vatNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">رقم الواتساب الرسمي للمؤسسة</Label>
                    <Input
                      required
                      dir="ltr"
                      className="font-mono text-right"
                      value={settingsForm.whatsappPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">رقم جوال خدمة العملاء</Label>
                    <Input
                      required
                      dir="ltr"
                      className="font-mono text-right"
                      value={settingsForm.supportPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">رقم السجل التجاري (CR)</Label>
                    <Input
                      required
                      dir="ltr"
                      className="font-mono text-right"
                      value={settingsForm.crNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, crNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">رقم ترخيص هيئة النقل (TGA)</Label>
                    <Input
                      required
                      value={settingsForm.licenseNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, licenseNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">رقم الآيبان البنكي للتحصيل (IBAN)</Label>
                    <Input
                      dir="ltr"
                      className="font-mono text-right"
                      value={settingsForm.iban}
                      onChange={(e) => setSettingsForm({ ...settingsForm, iban: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">سعر الاشتراك الشهري للطالبة (ر.س)</Label>
                    <Input
                      type="number"
                      required
                      value={settingsForm.monthlyFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, monthlyFee: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-bold">الأحياء المخدومة (افصل بينها بفاصلة)</Label>
                    <Input
                      required
                      value={settingsForm.districtsText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, districtsText: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">اللون الرسمي لموقع المؤسسة</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settingsForm.primaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                        className="w-10 h-9 rounded border cursor-pointer"
                      />
                      <Input
                        value={settingsForm.primaryColor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                        className="font-mono text-xs dir-ltr"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button type="submit" className="gap-2 font-bold">
                  <Save className="w-4 h-4" />
                  <span>حفظ واعتماد بيانات المؤسسة وتحديث باركود ZATCA</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* SECTION 1: Subscriptions & Collection */}
        {activeSection === "subscriptions" && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold">طلبات واشتراكات الطالبات وتحصيل الدفعات</CardTitle>
                <CardDescription className="text-xs">
                  أي طالبة تدفع من موقع المؤسسة (`/{currentSlug}`) تظهر هنا فوراً مع فاتورتها الضريبية
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">تزامن لحظي مع شاشة السائق</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-right text-xs font-bold">الطالبة وولي الأمر</TableHead>
                    <TableHead className="text-right text-xs font-bold">الحي والجامعة</TableHead>
                    <TableHead className="text-right text-xs font-bold">حالة الصعود اليوم</TableHead>
                    <TableHead className="text-right text-xs font-bold">الفاتورة (ZATCA)</TableHead>
                    <TableHead className="text-right text-xs font-bold">حالة السداد</TableHead>
                    <TableHead className="text-center text-xs font-bold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                        لا توجد اشتراكات مسجلة في هذه المؤسسة بعد. افتح موقع المؤسسة (`/{currentSlug}`) وسجّل أول طالبة!
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="font-bold text-xs">{student.name}</div>
                          <div className="text-[11px] text-muted-foreground font-mono dir-ltr text-right">
                            ولي الأمر: {student.guardianPhone}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div>{student.district}</div>
                          <div className="text-[11px] text-muted-foreground">{student.university}</div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {student.boardingStatus === "boarded" && (
                            <Badge className="bg-emerald-600 text-white text-[10px]">
                              ✓ ركبت ({student.lastBoardedAt || "صباحاً"})
                            </Badge>
                          )}
                          {student.boardingStatus === "missed" && (
                            <Badge variant="secondary" className="text-[10px]">
                              ✕ ما ركبت
                            </Badge>
                          )}
                          {student.boardingStatus === "none" && (
                            <span className="text-[11px] text-muted-foreground">بانتظار الجولة</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          <button
                            onClick={() => setSelectedInvoiceStudent(student)}
                            className="font-mono text-xs text-primary underline flex items-center gap-1"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>{student.invoiceNo}</span>
                          </button>
                        </TableCell>
                        <TableCell>
                          {student.status === "paid" && (
                            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 text-[11px] gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>مدفوع ({student.amount} ر.س)</span>
                            </Badge>
                          )}
                          {student.status === "overdue" && (
                            <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-300 text-[11px] gap-1">
                              <Clock className="w-3 h-3" />
                              <span>متأخر</span>
                            </Badge>
                          )}
                          {student.status === "suspended" && (
                            <Badge variant="destructive" className="text-[11px] gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>موقوف تلقائياً</span>
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            {student.status !== "paid" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-7 text-[11px] gap-1"
                                onClick={() => sendWhatsAppPaymentReminder(student)}
                              >
                                <Send className="w-3 h-3" />
                                <span>تذكير دفع</span>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[11px]"
                              onClick={() => toggleStudentSuspension(student.id)}
                            >
                              {student.status === "suspended" ? "إعادة تفعيل" : "إيقاف المقعد"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* SECTION 2: Fleet & Buses Management */}
        {activeSection === "buses" && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold">إدارة أسطول الباصات وبطاقات التشغيل</CardTitle>
                <CardDescription className="text-xs">
                  قائمة الباصات المسجلة، السائقين المعينين، المسارات، وتواريخ انتهاء كروت التشغيل
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsBusModalOpen(true)} className="gap-1.5 font-bold">
                <Plus className="w-4 h-4" />
                <span>إضافة باص جديد</span>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-right text-xs font-bold">رقم اللوحة</TableHead>
                    <TableHead className="text-right text-xs font-bold">نوع الباص والسعة</TableHead>
                    <TableHead className="text-right text-xs font-bold">السائق المسؤول</TableHead>
                    <TableHead className="text-right text-xs font-bold">المسار المعين</TableHead>
                    <TableHead className="text-right text-xs font-bold">بطاقة التشغيل (هيئة النقل)</TableHead>
                    <TableHead className="text-center text-xs font-bold">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buses.map((bus) => (
                    <TableRow key={bus.id}>
                      <TableCell className="font-mono font-bold text-xs">{bus.plate}</TableCell>
                      <TableCell className="text-xs">
                        <div className="font-semibold">{bus.model}</div>
                        <div className="text-[11px] text-muted-foreground">السعة: {bus.capacity} طالبة</div>
                      </TableCell>
                      <TableCell className="text-xs">{bus.assignedDriver}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{bus.route}</TableCell>
                      <TableCell className="text-xs">
                        <div className="font-mono">{bus.operationCardExpiry}</div>
                        <div className="text-[10px] text-muted-foreground">رقم البطاقة: {bus.operationCardNo}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        {bus.status === "warning" ? (
                          <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-300 text-[11px] gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>تنتهي بعد {bus.daysLeft} يوم</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 text-[11px]">
                            سارية
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* SECTION 3: Drivers Management */}
        {activeSection === "drivers" && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold">إدارة السائقين ورخص القيادة</CardTitle>
                <CardDescription className="text-xs">
                  بيانات السائقين، أرقام الجوال، الباصات المسندة، وتنبيهات انتهاء رخص القيادة
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsDriverModalOpen(true)} className="gap-1.5 font-bold">
                <Plus className="w-4 h-4" />
                <span>إضافة سائق جديد</span>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-right text-xs font-bold">اسم السائق</TableHead>
                    <TableHead className="text-right text-xs font-bold">رقم الجوال</TableHead>
                    <TableHead className="text-right text-xs font-bold">رقم الهوية / الإقامة</TableHead>
                    <TableHead className="text-right text-xs font-bold">الباص المسند</TableHead>
                    <TableHead className="text-right text-xs font-bold">انتهاء الرخصة</TableHead>
                    <TableHead className="text-center text-xs font-bold">صلاحية الرخصة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-bold text-xs">{driver.name}</TableCell>
                      <TableCell className="font-mono text-xs dir-ltr text-right">{driver.phone}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{driver.nationalId}</TableCell>
                      <TableCell className="text-xs">{driver.busAssigned}</TableCell>
                      <TableCell className="font-mono text-xs">{driver.licenseExpiry}</TableCell>
                      <TableCell className="text-center">
                        {driver.status === "warning" ? (
                          <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-300 text-[11px] gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>تنتهي بعد {driver.daysLeft} يوم</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 text-[11px]">
                            سارية
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* SECTION 4: Routes & Pricing */}
        {activeSection === "routes" && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold">المسارات والأحياء والأسعار</CardTitle>
                <CardDescription className="text-xs">
                  المسارات المعروضة للطالبات في موقع المؤسسة (`mishwar.sa/{currentSlug}`)
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsRouteModalOpen(true)} className="gap-1.5 font-bold">
                <Plus className="w-4 h-4" />
                <span>إضافة مسار جديد</span>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-right text-xs font-bold">اسم المسار</TableHead>
                    <TableHead className="text-right text-xs font-bold">الأحياء المخدومة</TableHead>
                    <TableHead className="text-right text-xs font-bold">الجامعة</TableHead>
                    <TableHead className="text-right text-xs font-bold">الاشتراك الشهري</TableHead>
                    <TableHead className="text-right text-xs font-bold">الباص المخصص</TableHead>
                    <TableHead className="text-center text-xs font-bold">المقاعد المحجوزة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-bold text-xs">{route.name}</TableCell>
                      <TableCell className="text-xs">{route.districts}</TableCell>
                      <TableCell className="text-xs">{route.university}</TableCell>
                      <TableCell className="text-xs font-bold">{route.monthlyPrice} ر.س</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{route.bus}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs font-mono">
                          {route.enrolled} طالبة
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* SECTION 5: TGA Compliance Alerts */}
        {activeSection === "compliance" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">تنبيهات رخص السائقين وبطاقات التشغيل (هيئة النقل)</CardTitle>
              <CardDescription className="text-xs">
                يراقب النظام تواريخ الانتهاء ويرسل تنبيهات قبل 30 و 15 و 7 أيام لتفادي الغرامات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge className="bg-amber-600 text-white text-[10px] mb-1">تنتهي بعد 12 يوماً</Badge>
                  <div className="font-bold text-sm text-slate-900">بطاقة تشغيل الحافلة — لوحة (أ ب ج 1234)</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    رقم البطاقة: TGA-99214 • تاريخ الانتهاء: 2026-11-28 • السائق: محمد السعيد
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => showToast("تم إرسال تذكير تجديد بطاقة التشغيل لمشرف الأسطول.")}
                >
                  إرسال تنبيه تجديد
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SECTION 6: Staff, ZATCA Invoices & Immutable Audit Log */}
        {activeSection === "staff" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold">فريق العمل والصلاحيات (RBAC)</CardTitle>
                  <CardDescription className="text-xs">توزيع صلاحيات الإدارة والمحاسبة والحركة (باقة Pro)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {staff.map((member) => (
                    <div key={member.id} className="p-3 rounded-xl border flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold">{member.name}</div>
                        <div className="text-muted-foreground">{member.role}</div>
                      </div>
                      <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                        {member.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold">سجل رسائل الواتساب الصادرة ({notifications.length})</CardTitle>
                  <CardDescription className="text-xs">
                    صادرة من واتساب المؤسسة: {tenant?.whatsappPhone}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5 max-h-64 overflow-y-auto text-xs">
                  {notifications.length === 0 ? (
                    <p className="text-muted-foreground text-xs py-4 text-center">
                      لا توجد رسائل صادرة في هذه الجلسة بعد.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3 rounded-xl border bg-muted/20 space-y-1">
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span className="font-mono dir-ltr">{n.recipientPhone}</span>
                          <span>{n.sentAt}</span>
                        </div>
                        <div className="font-medium text-xs">{n.message}</div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">سجل التدقيق الأمني للعمليات (Immutable Audit Trail)</CardTitle>
                <CardDescription className="text-xs">
                  يوثق كل عملية دفع، تعديل إعدادات الشركة، أو تأشير سائق
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-lg border flex items-center justify-between">
                    <div>
                      <span className="font-bold">{log.actor}: </span>
                      <span>{log.action}</span>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">{log.timestamp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* MODAL: ZATCA Tax Invoice Viewer */}
        <Dialog
          open={!!selectedInvoiceStudent}
          onOpenChange={(o) => !o && setSelectedInvoiceStudent(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>فاتورة ضريبية مبسطة (ZATCA E-Invoice)</DialogTitle>
              <DialogDescription className="text-xs">
                صادرة بالاسم الرسمي والرقم الضريبي الخاص بالمؤسسة
              </DialogDescription>
            </DialogHeader>
            {selectedInvoiceStudent && (
              <div className="space-y-3 text-xs pt-2">
                <div className="p-3.5 rounded-xl border bg-muted/30 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رقم الفاتورة:</span>
                    <span className="font-mono font-bold">{selectedInvoiceStudent.invoiceNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المؤسسة (المورد):</span>
                    <span className="font-bold">{tenant?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الرقم الضريبي للمؤسسة:</span>
                    <span className="font-mono font-bold">{tenant?.vatNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">واتساب خدمة العملاء:</span>
                    <span className="font-mono dir-ltr">{tenant?.whatsappPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الطالبة:</span>
                    <span className="font-bold">{selectedInvoiceStudent.name}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-sm text-emerald-700">
                    <span>الإجمالي شامل ضريبة القيمة المضافة (15%):</span>
                    <span>{selectedInvoiceStudent.amount} ر.س</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border flex flex-col sm:flex-row items-center gap-4 bg-card">
                  <ZatcaQrImage value={selectedInvoiceStudent.zatcaQrBase64} size={136} className="shrink-0" />
                  <div className="overflow-hidden text-center sm:text-right w-full">
                    <Badge variant="outline" className="mb-1 text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                      امسح الرمز بتطبيق ZATCA أو الكاميرا
                    </Badge>
                    <div className="font-bold text-[11px]">رمز TLV Base64 المشفر ببيانات المؤسسة:</div>
                    <div className="font-mono text-[10px] text-muted-foreground break-all dir-ltr mt-1 p-2 rounded border bg-muted/20">
                      {selectedInvoiceStudent.zatcaQrBase64}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* MODAL 1: Add Bus Dialog */}
        <Dialog open={isBusModalOpen} onOpenChange={setIsBusModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة باص جديد إلى الأسطول</DialogTitle>
              <DialogDescription className="text-xs">
                سجّل بيانات الحافلة وتاريخ انتهاء بطاقة التشغيل لتفعيل التنبيهات التلقائية.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBus} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <Label htmlFor="busPlate" className="text-xs font-bold">رقم اللوحة</Label>
                <Input
                  id="busPlate"
                  required
                  placeholder="مثال: ك ل م 4521"
                  value={newBus.plate}
                  onChange={(e) => setNewBus({ ...newBus, plate: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="busModel" className="text-xs font-bold">نوع وموديل الحافلة</Label>
                  <Input
                    id="busModel"
                    required
                    placeholder="تويوتا كوستر 2025"
                    value={newBus.model}
                    onChange={(e) => setNewBus({ ...newBus, model: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="busCap" className="text-xs font-bold">عدد المقاعد</Label>
                  <Input
                    id="busCap"
                    type="number"
                    required
                    value={newBus.capacity}
                    onChange={(e) => setNewBus({ ...newBus, capacity: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cardNo" className="text-xs font-bold">رقم بطاقة التشغيل</Label>
                  <Input
                    id="cardNo"
                    placeholder="TGA-55120"
                    value={newBus.cardNo}
                    onChange={(e) => setNewBus({ ...newBus, cardNo: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cardExpiry" className="text-xs font-bold">تاريخ انتهاء البطاقة</Label>
                  <Input
                    id="cardExpiry"
                    type="date"
                    required
                    value={newBus.cardExpiry}
                    onChange={(e) => setNewBus({ ...newBus, cardExpiry: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" disabled={isSubmittingModal} className="w-full font-bold">
                  {isSubmittingModal ? "جاري الإضافة..." : "حفظ وإضافة الباص"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL 2: Add Driver Dialog */}
        <Dialog open={isDriverModalOpen} onOpenChange={setIsDriverModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة سائق جديد للمؤسسة</DialogTitle>
              <DialogDescription className="text-xs">
                أدخل بيانات السائق وتاريخ انتهاء رخصة القيادة والباص المخصص له.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDriver} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <Label htmlFor="drvName" className="text-xs font-bold">اسم السائق الثلاثي</Label>
                <Input
                  id="drvName"
                  required
                  placeholder="مثال: سعد عبدالرحمن القحطاني"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="drvPhone" className="text-xs font-bold">رقم الجوال</Label>
                  <Input
                    id="drvPhone"
                    required
                    dir="ltr"
                    placeholder="05XXXXXXXX"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    className="text-right font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="drvId" className="text-xs font-bold">رقم الهوية / الإقامة</Label>
                  <Input
                    id="drvId"
                    required
                    placeholder="10XXXXXXXX"
                    value={newDriver.nationalId}
                    onChange={(e) => setNewDriver({ ...newDriver, nationalId: e.target.value })}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="drvExp" className="text-xs font-bold">تاريخ انتهاء رخصة القيادة</Label>
                <Input
                  id="drvExp"
                  type="date"
                  required
                  value={newDriver.licenseExpiry}
                  onChange={(e) => setNewDriver({ ...newDriver, licenseExpiry: e.target.value })}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" disabled={isSubmittingModal} className="w-full font-bold">
                  {isSubmittingModal ? "جاري الاعتماد..." : "حفظ واعتماد السائق"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* MODAL 3: Add Route Dialog */}
        <Dialog open={isRouteModalOpen} onOpenChange={setIsRouteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مسار نقل جديد</DialogTitle>
              <DialogDescription className="text-xs">
                سيظهر هذا المسار مباشرة للطالبات في صفحة التسجيل الخاصة بمؤسستك.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRoute} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <Label htmlFor="rtName" className="text-xs font-bold">اسم المسار</Label>
                <Input
                  id="rtName"
                  required
                  placeholder="مثال: مسار أحياء غرب الرياض"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="rtDistricts" className="text-xs font-bold">الأحياء المشمولة</Label>
                <Input
                  id="rtDistricts"
                  required
                  placeholder="حي العقيق، حي حطين"
                  value={newRoute.districts}
                  onChange={(e) => setNewRoute({ ...newRoute, districts: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="rtUni" className="text-xs font-bold">الجامعة</Label>
                  <Input
                    id="rtUni"
                    required
                    value={newRoute.university}
                    onChange={(e) => setNewRoute({ ...newRoute, university: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="rtPrice" className="text-xs font-bold">السعر الشهري (ر.س)</Label>
                  <Input
                    id="rtPrice"
                    type="number"
                    required
                    value={newRoute.monthlyPrice}
                    onChange={(e) => setNewRoute({ ...newRoute, monthlyPrice: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="submit" disabled={isSubmittingModal} className="w-full font-bold">
                  {isSubmittingModal ? "جاري النشر..." : "إضافة المسار للموقع"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>

      {/* Real Agentic AI Copilot Widget */}
      <MishwarAICopilot
        tenantSlug={currentSlug}
        onActionCompleted={async (summary) => {
          await loadTenantData();
          showToast(summary);
        }}
        onNavigateSection={(sec) => {
          setActiveSection(sec as DashboardSection);
        }}
      />
    </div>
  );
}

export default function EnterpriseDashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-muted-foreground">جاري تحميل لوحة المؤسسة...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
