import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * WhatsApp Business API & SMS Gateway Dispatcher
 * Uses the Tenant's registered WhatsApp number & official name
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    tenantSlug = "darb-alaman",
    recipientPhone,
    studentName,
    messageType = "payment_reminder",
    amount = 650,
  } = body;

  const tenant =
    db.tenants.find((t) => t.slug === tenantSlug) || db.tenants[0];

  const message =
    messageType === "payment_reminder"
      ? `تذكير سداد من ${tenant.name} (واتساب خدمة العملاء: ${tenant.whatsappPhone}): نأمل سداد اشتراك النقل الجامعي للطالبة (${studentName}) بقيمة ${amount} ر.س عبر رابط المؤسسة لتفادي الإيقاف التلقائي للمقعد: https://mishwar.sa/${tenant.slug}`
      : `إشعار من ${tenant.name} للطالبة (${studentName}).`;

  const entry = {
    id: `not-${Date.now()}`,
    tenantSlug: tenant.slug,
    recipientPhone,
    channel: "whatsapp" as const,
    message,
    sentAt: new Date().toLocaleTimeString("ar-SA"),
  };

  db.notifications.unshift(entry);
  db.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    tenantSlug: tenant.slug,
    actor: `واتساب المؤسسة (${tenant.whatsappPhone})`,
    action: `إرسال رسالة تذكير سداد لولي أمر (${studentName}) على الجوال ${recipientPhone}`,
    resource: `notification:${entry.id}`,
    timestamp: new Date().toLocaleTimeString("ar-SA"),
  });

  return NextResponse.json({
    ok: true,
    notification: entry,
  });
}
