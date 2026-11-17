import { NextRequest, NextResponse } from "next/server";
import { db, syncToFirestore } from "@/lib/db";
import { isFirebaseConfigured } from "@/lib/firebase";
import { generateZatcaQrBase64, calculateSaudiVat } from "@/lib/zatca";

export async function GET(req: NextRequest) {
  const tenantSlug = req.nextUrl.searchParams.get("tenant") || "darb-alaman";
  const currentTenant =
    db.tenants.find((t) => t.slug === tenantSlug) || db.tenants[0];

  return NextResponse.json({
    firebaseConnected: isFirebaseConfigured,
    tenantSlug: currentTenant.slug,
    tenant: currentTenant,
    allTenants: db.tenants,
    students: db.students.filter((s) => s.tenantSlug === currentTenant.slug),
    buses: db.buses.filter((b) => b.tenantSlug === currentTenant.slug),
    drivers: db.drivers.filter((d) => d.tenantSlug === currentTenant.slug),
    routes: db.routes.filter((r) => r.tenantSlug === currentTenant.slug),
    auditLogs: db.auditLogs.filter((a) => a.tenantSlug === currentTenant.slug),
    notifications: db.notifications.filter((n) => n.tenantSlug === currentTenant.slug),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, tenantSlug = "darb-alaman", payload } = body;

  if (type === "REGISTER_TENANT") {
    const cleanSlug = (payload.slug || `org-${Date.now().toString().slice(-4)}`)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    const existing = db.tenants.find((t) => t.slug === cleanSlug);
    if (existing) {
      return NextResponse.json(
        { error: "هذا الرابط مسجل لمؤسسة أخرى، يرجى اختيار عنوان آخر." },
        { status: 400 }
      );
    }

    const districtsList = payload.districts
      ? String(payload.districts)
          .split(/[،,]/)
          .map((d) => d.trim())
          .filter(Boolean)
      : ["حي الياسمين", "حي النرجس", "حي الملقا"];

    const newTenant = {
      id: `t-${db.tenants.length + 1}`,
      slug: cleanSlug,
      name: payload.name,
      crNumber: payload.crNumber || "1010000000",
      vatNumber: payload.vatNumber || "310123456700003",
      licenseNumber: payload.licenseNumber || "ت-10000-نقل",
      whatsappPhone: payload.whatsappPhone || payload.supportPhone || "966500000000",
      supportPhone: payload.supportPhone || payload.whatsappPhone || "0500000000",
      iban: payload.iban || "SA0000000000000000000000",
      city: payload.city || "الرياض",
      primaryColor: payload.primaryColor || "#0F172A",
      monthlyFee: Number(payload.monthlyFee) || 650,
      districts: districtsList,
      planTier: (payload.planTier || "pro") as "basic" | "pro" | "enterprise",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    db.tenants.push(newTenant);
    await syncToFirestore(newTenant.slug, null, newTenant.slug, newTenant as unknown as Record<string, unknown>);

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      tenantSlug: newTenant.slug,
      actor: "مؤسس الشركة",
      action: `تأسيس وتسجيل مؤسسة (${newTenant.name}) بالرقم الضريبي (${newTenant.vatNumber})`,
      resource: `tenant:${newTenant.slug}`,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    });

    return NextResponse.json({ ok: true, tenant: newTenant });
  }

  if (type === "UPDATE_TENANT_SETTINGS") {
    const tenant = db.tenants.find((t) => t.slug === tenantSlug);
    if (!tenant) {
      return NextResponse.json({ error: "المؤسسة غير موجودة" }, { status: 404 });
    }

    tenant.name = payload.name ?? tenant.name;
    tenant.crNumber = payload.crNumber ?? tenant.crNumber;
    tenant.vatNumber = payload.vatNumber ?? tenant.vatNumber;
    tenant.licenseNumber = payload.licenseNumber ?? tenant.licenseNumber;
    tenant.whatsappPhone = payload.whatsappPhone ?? tenant.whatsappPhone;
    tenant.supportPhone = payload.supportPhone ?? tenant.supportPhone;
    tenant.iban = payload.iban ?? tenant.iban;
    tenant.city = payload.city ?? tenant.city;
    tenant.primaryColor = payload.primaryColor ?? tenant.primaryColor;
    tenant.monthlyFee = Number(payload.monthlyFee) || tenant.monthlyFee;

    if (payload.districtsText) {
      tenant.districts = String(payload.districtsText)
        .split(/[،,]/)
        .map((d) => d.trim())
        .filter(Boolean);
    }

    db.students
      .filter((s) => s.tenantSlug === tenantSlug)
      .forEach((student) => {
        const { vatAmount, totalAmount } = calculateSaudiVat(student.amount);
        student.zatcaQrBase64 = generateZatcaQrBase64({
          sellerName: tenant.name,
          vatRegistrationNumber: tenant.vatNumber,
          timestamp: new Date().toISOString(),
          invoiceTotalWithVat: totalAmount.toFixed(2),
          vatTotal: vatAmount.toFixed(2),
        });
      });

    await syncToFirestore(tenant.slug, null, tenant.slug, tenant as unknown as Record<string, unknown>);

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      tenantSlug,
      actor: "إدارة المؤسسة",
      action: `تحديث البيانات الرسمية للمؤسسة (الرقم الضريبي: ${tenant.vatNumber} • واتساب: ${tenant.whatsappPhone})`,
      resource: `tenant:${tenantSlug}`,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    });

    return NextResponse.json({ ok: true, tenant });
  }

  if (type === "ADD_BUS") {
    const newBus = {
      id: `b${db.buses.length + 1}`,
      tenantSlug,
      plate: payload.plate,
      model: payload.model || "مرسيدس سبرنتر 2025",
      capacity: Number(payload.capacity) || 30,
      assignedDriver: payload.assignedDriver,
      route: payload.route,
      operationCardNo: payload.cardNo || `TGA-${Math.floor(10000 + Math.random() * 90000)}`,
      operationCardExpiry: payload.cardExpiry || "2027-12-30",
      daysLeft: 365,
      status: "active" as const,
    };
    db.buses.push(newBus);
    await syncToFirestore(tenantSlug, "buses", newBus.id, newBus as unknown as Record<string, unknown>);

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      tenantSlug,
      actor: "مدير المؤسسة",
      action: `إضافة حافلة جديدة للأسطول لوحة (${newBus.plate})`,
      resource: `bus:${newBus.id}`,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    });
    return NextResponse.json({ ok: true, bus: newBus });
  }

  if (type === "ADD_DRIVER") {
    const newDriver = {
      id: `d${db.drivers.length + 1}`,
      tenantSlug,
      name: payload.name,
      phone: payload.phone,
      nationalId: payload.nationalId,
      licenseType: "نقل ثقيل / حافلة",
      licenseExpiry: payload.licenseExpiry || "2027-12-30",
      driverCardNo: `DRV-${Math.floor(10000 + Math.random() * 90000)}`,
      daysLeft: 365,
      busAssigned: payload.busAssigned,
      status: "active" as const,
    };
    db.drivers.push(newDriver);
    await syncToFirestore(tenantSlug, "drivers", newDriver.id, newDriver as unknown as Record<string, unknown>);

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      tenantSlug,
      actor: "مدير المؤسسة",
      action: `تسجيل السائق (${newDriver.name}) وتعيينه على ${newDriver.busAssigned}`,
      resource: `driver:${newDriver.id}`,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    });
    return NextResponse.json({ ok: true, driver: newDriver });
  }

  if (type === "ADD_ROUTE") {
    const newRoute = {
      id: `r${db.routes.length + 1}`,
      tenantSlug,
      name: payload.name,
      districts: payload.districts,
      university: payload.university,
      monthlyPrice: Number(payload.monthlyPrice) || 650,
      bus: payload.bus,
      enrolled: 0,
    };
    db.routes.push(newRoute);
    await syncToFirestore(tenantSlug, "routes", newRoute.id, newRoute as unknown as Record<string, unknown>);

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      tenantSlug,
      actor: "مدير المؤسسة",
      action: `إضافة مسار نقل جديد (${newRoute.name}) بسعر ${newRoute.monthlyPrice} ر.س`,
      resource: `route:${newRoute.id}`,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    });
    return NextResponse.json({ ok: true, route: newRoute });
  }

  if (type === "TOGGLE_SUSPENSION") {
    const student = db.students.find((s) => s.id === payload.studentId && s.tenantSlug === tenantSlug);
    if (student) {
      student.status = student.status === "suspended" ? "paid" : "suspended";
      await syncToFirestore(tenantSlug, "students", student.id, student as unknown as Record<string, unknown>);

      db.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        tenantSlug,
        actor: "مدير المؤسسة",
        action:
          student.status === "suspended"
            ? `إيقاف مقعد الطالبة (${student.name}) وحجبه من قائمة السائق`
            : `إعادة تفعيل مقعد الطالبة (${student.name})`,
        resource: `student:${student.id}`,
        timestamp: new Date().toLocaleTimeString("ar-SA"),
      });
    }
    return NextResponse.json({ ok: true, student });
  }

  if (type === "DRIVER_BOARDING") {
    const student = db.students.find((s) => s.id === payload.studentId && s.tenantSlug === tenantSlug);
    const tenant = db.tenants.find((t) => t.slug === tenantSlug) || db.tenants[0];
    if (student) {
      student.boardingStatus = payload.boardingStatus;
      student.lastBoardedAt = new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });

      const message =
        payload.boardingStatus === "boarded"
          ? `تنبيه من ${tenant.name} (واتساب: ${tenant.whatsappPhone}): نحيطكم علماً بأن الطالبة (${student.name}) قد ركبت الحافلة (${student.bus}) بأمان الساعة ${student.lastBoardedAt} متجهة إلى ${student.university}.`
          : `تنبيه من ${tenant.name}: تم تسجيل عدم ركوب الطالبة (${student.name}) في جولة اليوم.`;

      const notif = {
        id: `not-${Date.now()}`,
        tenantSlug,
        recipientPhone: student.guardianPhone,
        channel: "whatsapp" as const,
        message,
        sentAt: new Date().toLocaleTimeString("ar-SA"),
      };
      db.notifications.unshift(notif);

      await syncToFirestore(tenantSlug, "students", student.id, student as unknown as Record<string, unknown>);
      await syncToFirestore(tenantSlug, "notifications", notif.id, notif as unknown as Record<string, unknown>);

      db.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        tenantSlug,
        actor: "السائق (واجهة PWA)",
        action: `تأشير حالة (${payload.boardingStatus === "boarded" ? "ركبت" : "ما ركبت"}) للطالبة ${student.name}`,
        resource: `student:${student.id}`,
        timestamp: new Date().toLocaleTimeString("ar-SA"),
      });
    }
    return NextResponse.json({ ok: true, student });
  }

  return NextResponse.json({ error: "Unknown action type" }, { status: 400 });
}
