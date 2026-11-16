"use client";

import { useState } from "react";
import Link from "next/link";
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
  FileText,
  Sparkles,
  QrCode,
  Ban,
  Check
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

type DashboardSection =
  | "subscriptions"
  | "buses"
  | "drivers"
  | "routes"
  | "compliance"
  | "staff";

export default function EnterpriseDashboardPage() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("subscriptions");

  // 1. Student Subscriptions State
  const [students, setStudents] = useState([
    {
      id: "1",
      name: "سارة العتيبي",
      phone: "0501112233",
      guardianPhone: "0509998877",
      district: "حي الياسمين",
      university: "جامعة الأميرة نورة",
      bus: "حافلة 01",
      status: "paid",
      amount: 650,
      invoiceNo: "INV-2026-101",
    },
    {
      id: "2",
      name: "منيرة الدوسري",
      phone: "0554445566",
      guardianPhone: "0551112299",
      district: "حي النرجس",
      university: "جامعة الأميرة نورة",
      bus: "حافلة 01",
      status: "overdue",
      amount: 650,
      invoiceNo: "INV-2026-102",
    },
    {
      id: "3",
      name: "شهد الشمري",
      phone: "0567778899",
      guardianPhone: "0563334455",
      district: "حي الملقا",
      university: "جامعة الملك سعود",
      bus: "حافلة 02",
      status: "paid",
      amount: 650,
      invoiceNo: "INV-2026-103",
    },
    {
      id: "4",
      name: "نورة المطيري",
      phone: "0532223344",
      guardianPhone: "0538887766",
      district: "حي الصحافة",
      university: "جامعة الملك سعود",
      bus: "حافلة 02",
      status: "suspended",
      amount: 650,
      invoiceNo: "INV-2026-104",
    },
  ]);

  // 2. Fleet Buses State
  const [buses, setBuses] = useState([
    {
      id: "b1",
      plate: "أ ب ج 1234",
      model: "مرسيدس سبرنتر 2024",
      capacity: 30,
      assignedDriver: "محمد السعيد",
      route: "مسار الياسمين والنرجس ➔ جامعة نورة",
      operationCardNo: "TGA-99214",
      operationCardExpiry: "2026-11-28",
      daysLeft: 12,
      status: "warning",
    },
    {
      id: "b2",
      plate: "د هـ و 5678",
      model: "تويوتا كوستر 2023",
      capacity: 22,
      assignedDriver: "عبدالله الشمري",
      route: "مسار الملقا والصحافة ➔ جامعة الملك سعود",
      operationCardNo: "TGA-88123",
      operationCardExpiry: "2027-04-15",
      daysLeft: 150,
      status: "active",
    },
    {
      id: "b3",
      plate: "ر ز س 9012",
      model: "مرسيدس سبرنتر 2023",
      capacity: 30,
      assignedDriver: "خالد الحربي",
      route: "مسار الروضة والقدس ➔ جامعة الإمام",
      operationCardNo: "TGA-77641",
      operationCardExpiry: "2027-06-20",
      daysLeft: 216,
      status: "active",
    },
  ]);

  // 3. Drivers State
  const [drivers, setDrivers] = useState([
    {
      id: "d1",
      name: "محمد السعيد",
      phone: "0501112233",
      nationalId: "1089223344",
      licenseType: "نقل ثقيل / حافلة",
      licenseExpiry: "2026-12-04",
      driverCardNo: "DRV-10023",
      daysLeft: 18,
      busAssigned: "حافلة 01 (أ ب ج 1234)",
      status: "warning",
    },
    {
      id: "d2",
      name: "عبدالله الشمري",
      phone: "0554445566",
      nationalId: "1045332211",
      licenseType: "نقل ثقيل / حافلة",
      licenseExpiry: "2027-08-10",
      driverCardNo: "DRV-20045",
      daysLeft: 260,
      busAssigned: "حافلة 02 (د هـ و 5678)",
      status: "active",
    },
    {
      id: "d3",
      name: "خالد الحربي",
      phone: "0567778899",
      nationalId: "1077665544",
      licenseType: "نقل ثقيل / حافلة",
      licenseExpiry: "2027-09-15",
      driverCardNo: "DRV-30089",
      daysLeft: 295,
      busAssigned: "حافلة 03 (ر ز س 9012)",
      status: "active",
    },
  ]);

  // 4. Routes State
  const [routes, setRoutes] = useState([
    {
      id: "r1",
      name: "مسار شمال الرياض (أ)",
      districts: "حي الياسمين، حي النرجس",
      university: "جامعة الأميرة نورة بنت عبدالرحمن",
      monthlyPrice: 650,
      bus: "حافلة 01 (30 مقعد)",
      enrolled: 29,
    },
    {
      id: "r2",
      name: "مسار شمال الرياض (ب)",
      districts: "حي الملقا، حي الصحافة",
      university: "جامعة الملك سعود",
      monthlyPrice: 650,
      bus: "حافلة 02 (22 مقعد)",
      enrolled: 19,
    },
    {
      id: "r3",
      name: "مسار شرق الرياض",
      districts: "حي الروضة، حي القدس",
      university: "جامعة الإمام محمد بن سعود",
      monthlyPrice: 600,
      bus: "حافلة 03 (30 مقعد)",
      enrolled: 26,
    },
  ]);

  // 5. Staff & Permissions State
  const [staff] = useState([
    { id: "s1", name: "فهد العتيبي", role: "مالك المؤسسة (صلاحية كاملة)", phone: "0501234567", status: "نشط" },
    { id: "s2", name: "عمر الدوسري", role: "مشرف حركة وباصات", phone: "0552345678", status: "نشط" },
    { id: "s3", name: "سلمان القحطاني", role: "محاسب وتحصيل وفواتير", phone: "0563456789", status: "نشط" },
  ]);

  // Modals & Form States
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

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

  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault();
    setBuses([
      ...buses,
      {
        id: `b${buses.length + 1}`,
        plate: newBus.plate,
        model: newBus.model || "مرسيدس سبرنتر 2025",
        capacity: Number(newBus.capacity) || 30,
        assignedDriver: newBus.assignedDriver,
        route: newBus.route,
        operationCardNo: newBus.cardNo || `TGA-${Math.floor(10000 + Math.random() * 90000)}`,
        operationCardExpiry: newBus.cardExpiry || "2027-12-30",
        daysLeft: 365,
        status: "active",
      },
    ]);
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
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    setDrivers([
      ...drivers,
      {
        id: `d${drivers.length + 1}`,
        name: newDriver.name,
        phone: newDriver.phone,
        nationalId: newDriver.nationalId,
        licenseType: "نقل ثقيل / حافلة",
        licenseExpiry: newDriver.licenseExpiry || "2027-12-30",
        driverCardNo: `DRV-${Math.floor(10000 + Math.random() * 90000)}`,
        daysLeft: 365,
        busAssigned: newDriver.busAssigned,
        status: "active",
      },
    ]);
    setIsDriverModalOpen(false);
    setNewDriver({
      name: "",
      phone: "",
      nationalId: "",
      busAssigned: "حافلة 01 (أ ب ج 1234)",
      licenseExpiry: "",
    });
    showToast("تم تسجيل السائق الجديد وإرسال رابط شاشة السائق إلى جواله.");
  };

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setRoutes([
      ...routes,
      {
        id: `r${routes.length + 1}`,
        name: newRoute.name,
        districts: newRoute.districts,
        university: newRoute.university,
        monthlyPrice: Number(newRoute.monthlyPrice) || 650,
        bus: newRoute.bus,
        enrolled: 0,
      },
    ]);
    setIsRouteModalOpen(false);
    setNewRoute({
      name: "",
      districts: "",
      university: "جامعة الأميرة نورة بنت عبدالرحمن",
      monthlyPrice: "650",
      bus: "حافلة 01 (30 مقعد)",
    });
    showToast("تم نشر المسار الجديد في موقع المؤسسة للطالبات.");
  };

  const toggleStudentSuspension = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const nextStatus = s.status === "suspended" ? "paid" : "suspended";
        showToast(
          nextStatus === "suspended"
            ? `تم إيقاف مقعد الطالبة (${s.name}) وحجبه من قائمة السائق.`
            : `تم تفعيل مقعد الطالبة (${s.name}) وإعادته لقائمة السائق.`
        );
        return { ...s, status: nextStatus };
      })
    );
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row text-foreground">
      {/* Formal Sidebar */}
      <aside className="w-full md:w-68 bg-slate-950 text-slate-300 p-5 flex flex-col justify-between border-l border-slate-800 shrink-0">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-slate-800 mb-5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white shadow-xs">
              <Bus className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">مؤسسة درب الأمان</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>باقة Pro • ترخيص ت-10452</span>
              </div>
            </div>
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
                <span>فريق العمل والفواتير الضريبية</span>
              </div>
            </button>

            <Separator className="my-3 bg-slate-800" />

            <Link
              href="/darb-alaman"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 transition"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>موقع المؤسسة للطالبات</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/driver"
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
            <span>عنوان موقعك المستقل:</span>
            <Badge variant="outline" className="text-[10px] bg-slate-900 text-emerald-400 border-slate-800">
              نشط
            </Badge>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 dir-ltr text-center">
            mishwar.sa/darb-alaman
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Top Action Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight">لوحة تحكم مؤسسة درب الأمان</h1>
              <Badge variant="secondary" className="text-xs font-bold">بدون عمولة مقاعد</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              إدارة شاملة للاشتراكات، الباصات، السائقين، المسارات، وتنبيهات هيئة النقل
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button size="sm" onClick={() => setIsBusModalOpen(true)} className="gap-1.5 font-bold">
              <Plus className="w-4 h-4" />
              <span>إضافة باص</span>
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setIsDriverModalOpen(true)} className="gap-1.5 font-bold">
              <Plus className="w-4 h-4" />
              <span>إضافة سائق</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsRouteModalOpen(true)} className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span>إضافة مسار</span>
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

        {/* TGA Regulatory Alert Banner */}
        <Alert className="mb-6 border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-xs font-bold">تنبيهات قبل انتهاء رخص السائقين وبطاقات التشغيل</AlertTitle>
          <AlertDescription className="text-xs mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              • بطاقة تشغيل الحافلة (أ ب ج 1234) تنتهي بعد 12 يوماً &nbsp;|&nbsp; • رخصة قيادة السائق (محمد السعيد) تنتهي بعد 18 يوماً.
            </span>
            <Button
              size="sm"
              variant="outline"
              className="border-amber-600/40 text-xs h-7 px-3"
              onClick={() => setActiveSection("compliance")}
            >
              عرض سجل الرخص والتشغيل
            </Button>
          </AlertDescription>
        </Alert>

        {/* Top Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">إجمالي تحصيل الاشتراكات</CardDescription>
              <CardTitle className="text-3xl font-black">
                83,200 <span className="text-sm font-normal text-muted-foreground">ر.س</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] text-emerald-600 font-semibold">0% عمولة • كامل المبلغ لحساب المؤسسة</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">الباصات العاملة بالأسطول</CardDescription>
              <CardTitle className="text-3xl font-black">
                {buses.length} <span className="text-sm font-normal text-muted-foreground">باصات</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] text-muted-foreground">مرتبطة بـ {routes.length} مسارات جامعية</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">السائقون المسجلون</CardDescription>
              <CardTitle className="text-3xl font-black">
                {drivers.length} <span className="text-sm font-normal text-muted-foreground">سائقين</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] text-amber-600 font-medium">1 رخصة قاربت على الانتهاء</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">إيقاف تلقائي لعدم السداد</CardDescription>
              <CardTitle className="text-3xl font-black text-destructive">
                {students.filter((s) => s.status !== "paid").length}{" "}
                <span className="text-sm font-normal text-muted-foreground">طالبات</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[11px] text-destructive font-semibold">محجوبات آلياً من شاشة السائق</div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 1: Subscriptions & Collection */}
        {activeSection === "subscriptions" && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold">طلبات واشتراكات الطالبات وتحصيل الدفعات</CardTitle>
                <CardDescription className="text-xs">
                  متابعة حالة الدفع، إرسال تذكير واتساب، والإيقاف التلقائي لمن لم تدفع
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">تحديث فوري مع شاشة السائق</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-right text-xs font-bold">الطالبة وولي الأمر</TableHead>
                    <TableHead className="text-right text-xs font-bold">الحي والجامعة</TableHead>
                    <TableHead className="text-right text-xs font-bold">الباص</TableHead>
                    <TableHead className="text-right text-xs font-bold">الاشتراك</TableHead>
                    <TableHead className="text-right text-xs font-bold">الحالة</TableHead>
                    <TableHead className="text-center text-xs font-bold">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
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
                      <TableCell className="text-xs font-medium">{student.bus}</TableCell>
                      <TableCell className="text-xs font-bold">{student.amount} ر.س</TableCell>
                      <TableCell>
                        {student.status === "paid" && (
                          <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 text-[11px] gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>مدفوع</span>
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
                              onClick={() =>
                                showToast(
                                  `تم إرسال رسالة تذكير ورابط دفع مباشر لولي أمر الطالبة (${student.name}) على الرقم ${student.guardianPhone}`
                                )
                              }
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
                  ))}
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
                  المسارات المعروضة للطالبات في موقع المؤسسة (`mishwar.sa/darb-alaman`)
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

              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge className="bg-amber-600 text-white text-[10px] mb-1">تنتهي بعد 18 يوماً</Badge>
                  <div className="font-bold text-sm text-slate-900">رخصة قيادة السائق — محمد السعيد</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    هوية رقم: 1089223344 • تاريخ الانتهاء: 2026-12-04 • جوال: 0501112233
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => showToast("تم إرسال رسالة تنبيه للسائق محمد السعيد لتجديد الرخصة.")}
                >
                  تنبيه السائق بالواتساب
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SECTION 6: Staff & Tax Invoices */}
        {activeSection === "staff" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">فريق العمل والصلاحيات</CardTitle>
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
                <CardTitle className="text-base font-bold">الفواتير الضريبية والتقارير</CardTitle>
                <CardDescription className="text-xs">فواتير ضريبية مبسطة لاشتراكات الطالبات متوافقة مع الزكاة والدخل</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border bg-muted/20 flex items-center justify-between">
                  <div>
                    <div className="font-bold">تقرير تحصيل شهر نوفمبر 2026</div>
                    <div className="text-muted-foreground">إجمالي 128 فاتورة مصدرة • 83,200 ر.س</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showToast("جاري تصدير ملف التقرير الضريبي بصيغة PDF و Excel...")}
                  >
                    تصدير التقرير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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

              <div className="space-y-1">
                <Label htmlFor="busDriver" className="text-xs font-bold">السائق المعين</Label>
                <select
                  id="busDriver"
                  value={newBus.assignedDriver}
                  onChange={(e) => setNewBus({ ...newBus, assignedDriver: e.target.value })}
                  className="w-full h-9 px-3 border border-input rounded-md text-xs bg-background"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.phone})
                    </option>
                  ))}
                </select>
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
                <Button type="submit" className="w-full font-bold">حفظ وإضافة الباص</Button>
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
                <Label htmlFor="drvBus" className="text-xs font-bold">تعيين على باص</Label>
                <select
                  id="drvBus"
                  value={newDriver.busAssigned}
                  onChange={(e) => setNewDriver({ ...newDriver, busAssigned: e.target.value })}
                  className="w-full h-9 px-3 border border-input rounded-md text-xs bg-background"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={`حافلة (${b.plate})`}>
                      {b.plate} — {b.model}
                    </option>
                  ))}
                </select>
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
                <Button type="submit" className="w-full font-bold">حفظ واعتماد السائق</Button>
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
                <Button type="submit" className="w-full font-bold">إضافة المسار للموقع</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>

      {/* Generative UI Copilot Widget */}
      <MishwarAICopilot
        onTriggerAction={(action) => {
          if (action === "bulk-reminder") {
            showToast("تم إرسال رسائل التذكير بالواتساب لجميع المتأخرات عن السداد.");
          }
        }}
      />
    </div>
  );
}
