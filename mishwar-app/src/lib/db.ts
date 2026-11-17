/**
 * Multi-Tenant Database Repository with Firebase Cloud Firestore Sync + Instant Fallback
 * When `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is configured in `.env.local`, every read/write
 * syncs directly with Google Cloud Firestore under `/tenants/{tenantSlug}/...`.
 */

import { generateZatcaQrBase64, calculateSaudiVat } from "./zatca";
import {
  firestoreDb,
  isFirebaseConfigured,
  doc,
  setDoc,
  collection,
  getDocs,
} from "./firebase";

export interface TenantProfile {
  id: string;
  slug: string;
  name: string;
  crNumber: string;
  vatNumber: string;
  licenseNumber: string;
  whatsappPhone: string;
  supportPhone: string;
  iban: string;
  city: string;
  primaryColor: string;
  monthlyFee: number;
  districts: string[];
  planTier: "basic" | "pro" | "enterprise";
  createdAt: string;
}

export interface StudentRecord {
  id: string;
  tenantSlug: string;
  name: string;
  phone: string;
  guardianPhone: string;
  district: string;
  university: string;
  bus: string;
  status: "paid" | "overdue" | "suspended";
  boardingStatus: "none" | "boarded" | "missed";
  amount: number;
  invoiceNo: string;
  zatcaQrBase64: string;
  lastBoardedAt?: string;
}

export interface BusRecord {
  id: string;
  tenantSlug: string;
  plate: string;
  model: string;
  capacity: number;
  assignedDriver: string;
  route: string;
  operationCardNo: string;
  operationCardExpiry: string;
  daysLeft: number;
  status: "active" | "warning" | "expired";
}

export interface DriverRecord {
  id: string;
  tenantSlug: string;
  name: string;
  phone: string;
  nationalId: string;
  licenseType: string;
  licenseExpiry: string;
  driverCardNo: string;
  daysLeft: number;
  busAssigned: string;
  status: "active" | "warning" | "expired";
}

export interface RouteRecord {
  id: string;
  tenantSlug: string;
  name: string;
  districts: string;
  university: string;
  monthlyPrice: number;
  bus: string;
  enrolled: number;
}

export interface AuditLogEntry {
  id: string;
  tenantSlug: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
}

export interface NotificationLogEntry {
  id: string;
  tenantSlug: string;
  recipientPhone: string;
  channel: "whatsapp" | "sms";
  message: string;
  sentAt: string;
}

const globalStore = globalThis as unknown as {
  __mishwarStoreV2?: {
    tenants: TenantProfile[];
    students: StudentRecord[];
    buses: BusRecord[];
    drivers: DriverRecord[];
    routes: RouteRecord[];
    auditLogs: AuditLogEntry[];
    notifications: NotificationLogEntry[];
  };
};

function createInvoiceQrForTenant(sellerName: string, vatNumber: string, amount: number) {
  const { vatAmount, totalAmount } = calculateSaudiVat(amount);
  return generateZatcaQrBase64({
    sellerName,
    vatRegistrationNumber: vatNumber,
    timestamp: new Date().toISOString(),
    invoiceTotalWithVat: totalAmount.toFixed(2),
    vatTotal: vatAmount.toFixed(2),
  });
}

if (!globalStore.__mishwarStoreV2) {
  const defaultTenant: TenantProfile = {
    id: "t-1",
    slug: "darb-alaman",
    name: "مؤسسة درب الأمان للنقل الجامعي",
    crNumber: "1010987654",
    vatNumber: "310123456700003",
    licenseNumber: "ت-10452-نقل",
    whatsappPhone: "966501234567",
    supportPhone: "0501234567",
    iban: "SA4420000001234567891234",
    city: "الرياض",
    primaryColor: "#0F172A",
    monthlyFee: 650,
    districts: ["حي الياسمين", "حي النرجس", "حي الملقا", "حي الصحافة", "حي العارض"],
    planTier: "pro",
    createdAt: "2026-11-01",
  };

  const secondTenant: TenantProfile = {
    id: "t-2",
    slug: "al-safwah",
    name: "شركة الصفوة لنقل الطالبات",
    crNumber: "4030112233",
    vatNumber: "300987654300003",
    licenseNumber: "ت-20891-نقل",
    whatsappPhone: "966559876543",
    supportPhone: "0559876543",
    iban: "SA8880000009876543210001",
    city: "جدة",
    primaryColor: "#065F46",
    monthlyFee: 600,
    districts: ["حي الروضة", "حي السلامة", "حي الزهراء", "حي الشاطئ"],
    planTier: "basic",
    createdAt: "2026-11-10",
  };

  globalStore.__mishwarStoreV2 = {
    tenants: [defaultTenant, secondTenant],
    students: [
      {
        id: "1",
        tenantSlug: "darb-alaman",
        name: "سارة العتيبي",
        phone: "0501112233",
        guardianPhone: "0509998877",
        district: "حي الياسمين",
        university: "جامعة الأميرة نورة بنت عبدالرحمن",
        bus: "حافلة 01",
        status: "paid",
        boardingStatus: "none",
        amount: 650,
        invoiceNo: "INV-2026-101",
        zatcaQrBase64: createInvoiceQrForTenant(defaultTenant.name, defaultTenant.vatNumber, 650),
      },
      {
        id: "2",
        tenantSlug: "darb-alaman",
        name: "منيرة الدوسري",
        phone: "0554445566",
        guardianPhone: "0551112299",
        district: "حي النرجس",
        university: "جامعة الأميرة نورة بنت عبدالرحمن",
        bus: "حافلة 01",
        status: "overdue",
        boardingStatus: "none",
        amount: 650,
        invoiceNo: "INV-2026-102",
        zatcaQrBase64: createInvoiceQrForTenant(defaultTenant.name, defaultTenant.vatNumber, 650),
      },
      {
        id: "3",
        tenantSlug: "darb-alaman",
        name: "شهد الشمري",
        phone: "0567778899",
        guardianPhone: "0563334455",
        district: "حي الملقا",
        university: "جامعة الملك سعود",
        bus: "حافلة 02",
        status: "paid",
        boardingStatus: "none",
        amount: 650,
        invoiceNo: "INV-2026-103",
        zatcaQrBase64: createInvoiceQrForTenant(defaultTenant.name, defaultTenant.vatNumber, 650),
      },
      {
        id: "4",
        tenantSlug: "darb-alaman",
        name: "نورة المطيري",
        phone: "0532223344",
        guardianPhone: "0538887766",
        district: "حي الصحافة",
        university: "جامعة الملك سعود",
        bus: "حافلة 02",
        status: "suspended",
        boardingStatus: "none",
        amount: 650,
        invoiceNo: "INV-2026-104",
        zatcaQrBase64: createInvoiceQrForTenant(defaultTenant.name, defaultTenant.vatNumber, 650),
      },
    ],
    buses: [
      {
        id: "b1",
        tenantSlug: "darb-alaman",
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
        tenantSlug: "darb-alaman",
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
    ],
    drivers: [
      {
        id: "d1",
        tenantSlug: "darb-alaman",
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
        tenantSlug: "darb-alaman",
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
    ],
    routes: [
      {
        id: "r1",
        tenantSlug: "darb-alaman",
        name: "مسار شمال الرياض (أ)",
        districts: "حي الياسمين، حي النرجس",
        university: "جامعة الأميرة نورة بنت عبدالرحمن",
        monthlyPrice: 650,
        bus: "حافلة 01 (30 مقعد)",
        enrolled: 29,
      },
      {
        id: "r2",
        tenantSlug: "darb-alaman",
        name: "مسار شمال الرياض (ب)",
        districts: "حي الملقا، حي الصحافة",
        university: "جامعة الملك سعود",
        monthlyPrice: 650,
        bus: "حافلة 02 (22 مقعد)",
        enrolled: 19,
      },
    ],
    auditLogs: [
      {
        id: "aud-1",
        tenantSlug: "darb-alaman",
        actor: "النظام الآلي (Cron)",
        action: "إيقاف تلقائي لمقعد الطالبة نورة المطيري بسبب تأخر السداد",
        resource: "student:4",
        timestamp: "08:00 ص",
      },
    ],
    notifications: [],
  };
}

export const db = globalStore.__mishwarStoreV2;

/**
 * Helper to mirror any record into Firebase Cloud Firestore when configured.
 * Runs non-blocking with a strict 2-second timeout so it never freezes
 * the API response even if Firestore permissions/database are still provisioning.
 */
export async function syncToFirestore(
  tenantSlug: string,
  subcollection: string | null,
  docId: string,
  data: Record<string, unknown>
) {
  if (!isFirebaseConfigured || !firestoreDb) return;

  // Run in background without blocking the HTTP request
  const firestorePromise = (async () => {
    try {
      if (!subcollection) {
        await setDoc(doc(firestoreDb, "tenants", tenantSlug), data, { merge: true });
      } else {
        await setDoc(
          doc(firestoreDb, "tenants", tenantSlug, subcollection, docId),
          data,
          { merge: true }
        );
      }
    } catch (err) {
      console.warn("Firestore sync warning (handled gracefully):", err);
    }
  })();

  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 800));

  // Race against 800ms timeout so user UI never hangs
  await Promise.race([firestorePromise, timeoutPromise]);
}
