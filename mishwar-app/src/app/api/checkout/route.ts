import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateZatcaQrBase64, calculateSaudiVat } from "@/lib/zatca";

/**
 * Payment Checkout & Webhook Fulfillment API
 * Dynamically reads the Tenant's Official Name, 15-Digit VAT Number, and WhatsApp Number
 * to generate a compliant ZATCA E-Invoice and send notifications from the company's identity.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    tenantSlug = "darb-alaman",
    studentName,
    phone,
    guardianPhone,
    district,
    university,
    amount = 650,
    paymentMethod = "mada",
  } = body;

  const tenant =
    db.tenants.find((t) => t.slug === tenantSlug) || db.tenants[0];

  const invoiceNo = `INV-2026-${Math.floor(105 + Math.random() * 890)}`;
  const { netAmount, vatAmount, totalAmount } = calculateSaudiVat(Number(amount));

  const zatcaQrBase64 = generateZatcaQrBase64({
    sellerName: tenant.name,
    vatRegistrationNumber: tenant.vatNumber,
    timestamp: new Date().toISOString(),
    invoiceTotalWithVat: totalAmount.toFixed(2),
    vatTotal: vatAmount.toFixed(2),
  });

  const newStudent = {
    id: `${db.students.length + 1}-${Date.now().toString().slice(-3)}`,
    tenantSlug: tenant.slug,
    name: studentName,
    phone,
    guardianPhone,
    district,
    university,
    bus: "حافلة 01",
    status: "paid" as const,
    boardingStatus: "none" as const,
    amount: totalAmount,
    invoiceNo,
    zatcaQrBase64,
  };

  db.students.unshift(newStudent);

  db.notifications.unshift({
    id: `not-${Date.now()}`,
    tenantSlug: tenant.slug,
    recipientPhone: guardianPhone || phone,
    channel: "whatsapp",
    message: `رسالة من ${tenant.name} (واتساب المؤسسة: ${tenant.whatsappPhone}): تم تأكيد اشتراك الطالبة (${studentName}) وإصدار الفاتورة الضريبية رقم ${invoiceNo} (الرقم الضريبي: ${tenant.vatNumber}) بمبلغ ${totalAmount} ر.س.`,
    sentAt: new Date().toLocaleTimeString("ar-SA"),
  });

  db.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    tenantSlug: tenant.slug,
    actor: `بوابة الدفع (${paymentMethod === "applepay" ? "Apple Pay" : "مدى"})`,
    action: `سداد اشتراك جديد للطالبة (${studentName}) لصالح ${tenant.name} وإصدار فاتورة ضريبية رقم ${invoiceNo}`,
    resource: `invoice:${invoiceNo}`,
    timestamp: new Date().toLocaleTimeString("ar-SA"),
  });

  return NextResponse.json({
    ok: true,
    student: newStudent,
    invoice: {
      invoiceNo,
      sellerName: tenant.name,
      vatRegistrationNumber: tenant.vatNumber,
      whatsappPhone: tenant.whatsappPhone,
      netAmount,
      vatAmount,
      totalAmount,
      zatcaQrBase64,
      issuedAt: new Date().toLocaleString("ar-SA"),
    },
  });
}
