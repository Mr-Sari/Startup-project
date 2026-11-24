/**
 * Mishwar AI Agent — Tool Registry
 * ---------------------------------
 * Every capability the agent can use lives here as a typed, validated tool.
 * - "read" tools only query tenant data.
 * - "write" tools mutate data (auto-executed, audited).
 * - "sensitive" tools (bulk / outbound messaging / suspension) require a
 *   human confirmation before they run.
 * - "ui" tools ask the chat to open an interactive form.
 *
 * All tools are hard-scoped to the tenant passed by the server — the model
 * can never choose or override the tenant.
 */
import {
  db,
  syncToFirestore,
  type BusRecord,
  type DriverRecord,
  type RouteRecord,
  type StudentRecord,
} from "@/lib/db";
import { calculateSaudiVat, generateZatcaQrBase64 } from "@/lib/zatca";

export const AGENT_ACTOR = "وكيل الذكاء الاصطناعي";

export type ToolKind = "read" | "write" | "sensitive" | "ui";
export type DashboardSection =
  | "overview"
  | "students"
  | "fleet"
  | "drivers"
  | "routes"
  | "settings";

export interface ToolResult {
  ok: boolean;
  summary: string;
  data?: unknown;
  widgetType?: string;
  navigateToSection?: DashboardSection;
  interactiveForm?: { formType: FormType; prefill: Record<string, string> };
  error?: string;
  /** Sensitive tools: arguments frozen at preview time (e.g. resolved recipient list). */
  resolvedArgs?: Record<string, unknown>;
}

export type FormType = "student-form" | "bus-form" | "driver-form" | "route-form";

export interface ToolContext {
  tenantSlug: string;
}

type JsonSchema = {
  type: "object";
  properties: Record<string, Record<string, unknown>>;
  required?: string[];
};

export interface AgentTool {
  name: string;
  label: string; // Arabic label shown in the action trace
  kind: ToolKind;
  description: string;
  parameters: JsonSchema;
  /** For sensitive tools: build a human-readable preview before confirmation. */
  preview?: (ctx: ToolContext, args: Record<string, unknown>) => ToolResult;
  run: (ctx: ToolContext, args: Record<string, unknown>) => Promise<ToolResult>;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Isolate LTR fragments (dates) so they render correctly inside Arabic text. */
const ltr = (v: string) => `\u2066${v}\u2069`;
const nowLabel = () => new Date().toLocaleTimeString("ar-SA");
const str = (v: unknown) => (v === undefined || v === null ? "" : String(v).trim());

function tenantOf(ctx: ToolContext) {
  const t = db.tenants.find((x) => x.slug === ctx.tenantSlug);
  if (!t) throw new Error("المؤسسة غير موجودة");
  return t;
}

function audit(ctx: ToolContext, action: string, resource: string) {
  db.auditLogs.unshift({
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tenantSlug: ctx.tenantSlug,
    actor: AGENT_ACTOR,
    action,
    resource,
    timestamp: nowLabel(),
  });
}

const fail = (error: string): ToolResult => ({ ok: false, summary: error, error });

/** Normalise Arabic text for fuzzy matching (alef/yaa/taa marbuta variants). */
function norm(s: string) {
  return s
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function normalizePhone(raw: unknown): string | null {
  const digits = str(raw).replace(/[^\d]/g, "").replace(/^00/, "");
  if (/^9665\d{8}$/.test(digits)) return `0${digits.slice(3)}`;
  if (/^05\d{8}$/.test(digits)) return digits;
  if (/^5\d{8}$/.test(digits)) return `0${digits}`;
  return null;
}

function parseDate(raw: unknown): string | null {
  const s = str(raw);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : s;
}

export function daysUntil(dateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateIso}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function statusFromDays(days: number): "active" | "warning" | "expired" {
  if (days < 0) return "expired";
  if (days <= 30) return "warning";
  return "active";
}

const students = (ctx: ToolContext) => db.students.filter((s) => s.tenantSlug === ctx.tenantSlug);
const buses = (ctx: ToolContext) => db.buses.filter((b) => b.tenantSlug === ctx.tenantSlug);
const drivers = (ctx: ToolContext) => db.drivers.filter((d) => d.tenantSlug === ctx.tenantSlug);
const routes = (ctx: ToolContext) => db.routes.filter((r) => r.tenantSlug === ctx.tenantSlug);

type Resolved<T> = { item: T } | { error: string };

/** Resolve a single record by id or fuzzy name; returns a clear error if ambiguous. */
function resolveOne<T extends { id: string }>(
  list: T[],
  query: unknown,
  fields: (keyof T)[],
  noun: string
): Resolved<T> {
  const q = norm(str(query));
  if (!q) return { error: `حدد ${noun} المطلوب` };
  const byId = list.find((x) => norm(x.id) === q);
  if (byId) return { item: byId };
  const exact = list.filter((x) => fields.some((f) => norm(String(x[f] ?? "")) === q));
  if (exact.length === 1) return { item: exact[0] };
  const partial = list.filter((x) => fields.some((f) => norm(String(x[f] ?? "")).includes(q)));
  if (partial.length === 1) return { item: partial[0] };
  if (partial.length > 1) {
    const names = partial.map((x) => String(x[fields[0]])).join("، ");
    return { error: `يوجد أكثر من ${noun} مطابق: ${names}. حدد بدقة.` };
  }
  return { error: `لم أجد ${noun} باسم «${str(query)}»` };
}

const findStudent = (ctx: ToolContext, q: unknown) =>
  resolveOne<StudentRecord>(students(ctx), q, ["name", "phone", "guardianPhone"], "طالبة");
/** Students reference buses as «حافلة 01»; drivers as «حافلة 01 (plate)». */
export function busShort(ctx: ToolContext, b: BusRecord) {
  const idx = buses(ctx).findIndex((x) => x.id === b.id);
  return `حافلة ${String(idx + 1).padStart(2, "0")}`;
}
const busFull = (ctx: ToolContext, b: BusRecord) => `${busShort(ctx, b)} (${b.plate})`;

function findBus(ctx: ToolContext, q: unknown): Resolved<BusRecord> {
  const raw = str(q);
  const inParens = raw.match(/\(([^)]+)\)/)?.[1];
  const num = raw.match(/(?:حافلة|حافله|باص|bus)?\s*0*(\d{1,2})$/i)?.[1];
  const list = buses(ctx);
  if (num && !inParens && raw.replace(/\D/g, "").length <= 2) {
    const b = list[Number(num) - 1];
    if (b) return { item: b };
  }
  return resolveOne<BusRecord>(list, inParens ?? raw, ["plate", "operationCardNo", "id"], "باص");
}

/** Recompute days-left & status from real expiry dates (seed values are static). */
export function refreshCompliance(ctx: ToolContext) {
  for (const b of buses(ctx)) {
    const d = parseDate(b.operationCardExpiry);
    if (d) { b.daysLeft = daysUntil(d); b.status = statusFromDays(b.daysLeft); }
  }
  for (const dr of drivers(ctx)) {
    const d = parseDate(dr.licenseExpiry);
    if (d) { dr.daysLeft = daysUntil(d); dr.status = statusFromDays(dr.daysLeft); }
  }
}
const findDriver = (ctx: ToolContext, q: unknown) =>
  resolveOne<DriverRecord>(drivers(ctx), q, ["name", "phone", "nationalId"], "سائق");

const studentView = (s: StudentRecord) => ({
  id: s.id,
  name: s.name,
  status: s.status,
  bus: s.bus,
  district: s.district,
  university: s.university,
  guardianPhone: s.guardianPhone,
  amount: s.amount,
  boardingStatus: s.boardingStatus,
});

function queueWhatsapp(ctx: ToolContext, phone: string, message: string) {
  const entry = {
    id: `not-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tenantSlug: ctx.tenantSlug,
    recipientPhone: phone,
    channel: "whatsapp" as const,
    message,
    sentAt: nowLabel(),
  };
  db.notifications.unshift(entry);
  return entry;
}

function reminderText(ctx: ToolContext, s: StudentRecord) {
  const t = tenantOf(ctx);
  return `تذكير سداد من ${t.name}: نأمل سداد اشتراك النقل الجامعي للطالبة (${s.name}) بقيمة ${s.amount} ر.س عبر الرابط https://mishwar.sa/${t.slug} لتفادي إيقاف المقعد. للاستفسار: ${t.whatsappPhone}`;
}

function overdueTargets(ctx: ToolContext, names: unknown): StudentRecord[] | string {
  const list = Array.isArray(names) ? names.map(str).filter(Boolean) : [];
  if (list.length === 0) return students(ctx).filter((s) => s.status === "overdue");
  const out: StudentRecord[] = [];
  for (const n of list) {
    const r = findStudent(ctx, n);
    if ("error" in r) return r.error;
    out.push(r.item);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Tools                                                               */
/* ------------------------------------------------------------------ */

export const TOOLS: AgentTool[] = [
  // ---------------------------- READ ----------------------------
  {
    name: "get_overview",
    label: "قراءة ملخص المؤسسة",
    kind: "read",
    description:
      "Returns a live snapshot of the tenant: counts of students by payment status, revenue collected vs outstanding, fleet & driver compliance warnings, today's boarding.",
    parameters: { type: "object", properties: {} },
    async run(ctx) {
      const t = tenantOf(ctx);
      const st = students(ctx);
      const paid = st.filter((s) => s.status === "paid");
      const overdue = st.filter((s) => s.status === "overdue");
      const suspended = st.filter((s) => s.status === "suspended");
      const expiring = [
        ...buses(ctx).filter((b) => b.daysLeft <= 30),
        ...drivers(ctx).filter((d) => d.daysLeft <= 30),
      ];
      const data = {
        tenant: t.name,
        city: t.city,
        monthlyFee: t.monthlyFee,
        students: st.length,
        paid: paid.length,
        overdue: overdue.length,
        suspended: suspended.length,
        collectedSar: paid.reduce((a, s) => a + s.amount, 0),
        outstandingSar: overdue.reduce((a, s) => a + s.amount, 0),
        buses: buses(ctx).length,
        drivers: drivers(ctx).length,
        routes: routes(ctx).length,
        documentsExpiringIn30Days: expiring.length,
        boardedToday: st.filter((s) => s.boardingStatus === "boarded").length,
        missedToday: st.filter((s) => s.boardingStatus === "missed").length,
      };
      return {
        ok: true,
        summary: `عدد الطالبات ${data.students} (مسددة ${data.paid}، متأخرة ${data.overdue}، موقوفة ${data.suspended}) — وثائق تنتهي خلال 30 يوم: ${data.documentsExpiringIn30Days}`,
        data,
      };
    },
  },
  {
    name: "search_students",
    label: "البحث في الطالبات",
    kind: "read",
    description:
      "Search/filter students. All filters optional. status: paid | overdue | suspended. bus: plate. query: part of name or phone.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Part of the student name or phone" },
        status: { type: "string", enum: ["paid", "overdue", "suspended"] },
        bus: { type: "string", description: "Bus plate" },
      },
    },
    async run(ctx, args) {
      let list = students(ctx);
      const q = norm(str(args.query));
      if (q) list = list.filter((s) => norm(s.name).includes(q) || s.phone.includes(q) || s.guardianPhone.includes(q));
      if (args.status) list = list.filter((s) => s.status === args.status);
      if (args.bus) {
        const rb = findBus(ctx, args.bus);
        const label = "item" in rb ? busShort(ctx, rb.item) : str(args.bus);
        list = list.filter((s) => norm(s.bus) === norm(label));
      }
      return {
        ok: true,
        summary: list.length ? `${list.length} نتيجة: ${list.map((s) => s.name).join("، ")}` : "لا توجد نتائج",
        data: list.map(studentView),
      };
    },
  },
  {
    name: "list_fleet",
    label: "قراءة الأسطول والسائقين",
    kind: "read",
    description: "List buses, drivers and routes of the tenant with their compliance status and days left.",
    parameters: { type: "object", properties: {} },
    async run(ctx) {
      const data = {
        buses: buses(ctx).map((b) => ({
          id: b.id, label: busShort(ctx, b), plate: b.plate, model: b.model, capacity: b.capacity, driver: b.assignedDriver,
          route: b.route, operationCardExpiry: b.operationCardExpiry, daysLeft: b.daysLeft, status: b.status,
          seatsTaken: students(ctx).filter((s) => s.bus === busShort(ctx, b) && s.status !== "suspended").length,
        })),
        drivers: drivers(ctx).map((d) => ({
          id: d.id, name: d.name, phone: d.phone, licenseExpiry: d.licenseExpiry, daysLeft: d.daysLeft,
          bus: d.busAssigned, status: d.status,
        })),
        routes: routes(ctx).map((r) => ({
          id: r.id, name: r.name, districts: r.districts, university: r.university, price: r.monthlyPrice, bus: r.bus,
        })),
      };
      return {
        ok: true,
        summary: `${data.buses.length} باص، ${data.drivers.length} سائق، ${data.routes.length} مسار`,
        data,
      };
    },
  },
  {
    name: "get_expiring_documents",
    label: "فحص الوثائق المنتهية",
    kind: "read",
    description:
      "Find bus operation cards and driver licenses expiring within N days (default 30) or already expired.",
    parameters: {
      type: "object",
      properties: { withinDays: { type: "number", description: "Default 30" } },
    },
    async run(ctx, args) {
      const n = Number(args.withinDays) > 0 ? Number(args.withinDays) : 30;
      const items = [
        ...buses(ctx)
          .filter((b) => b.daysLeft <= n)
          .map((b) => ({ type: "bus_operation_card", ref: b.plate, expiry: b.operationCardExpiry, daysLeft: b.daysLeft })),
        ...drivers(ctx)
          .filter((d) => d.daysLeft <= n)
          .map((d) => ({ type: "driver_license", ref: d.name, expiry: d.licenseExpiry, daysLeft: d.daysLeft })),
      ].sort((a, b) => a.daysLeft - b.daysLeft);
      return {
        ok: true,
        summary: items.length
          ? items.map((i) => `${i.type === "bus_operation_card" ? "كرت تشغيل" : "رخصة"} ${i.ref} (${i.daysLeft} يوم)`).join("، ")
          : `لا توجد وثائق تنتهي خلال ${n} يوم`,
        data: items,
      };
    },
  },

  // ---------------------------- WRITE (auto) ----------------------------
  {
    name: "create_student",
    label: "تسجيل طالبة وإصدار فاتورة",
    kind: "write",
    description:
      "Register a new student and issue a ZATCA e-invoice. Requires name and guardianPhone (Saudi mobile). If any required field is missing, call open_form instead of guessing.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        guardianPhone: { type: "string", description: "Saudi mobile, 05XXXXXXXX" },
        phone: { type: "string", description: "Student mobile (optional)" },
        district: { type: "string" },
        university: { type: "string" },
        bus: { type: "string", description: "Bus plate (optional)" },
        paid: { type: "boolean", description: "true if paid now; default false (overdue)" },
      },
      required: ["name", "guardianPhone"],
    },
    async run(ctx, args) {
      const t = tenantOf(ctx);
      const name = str(args.name);
      const guardianPhone = normalizePhone(args.guardianPhone);
      if (name.length < 3) return fail("اسم الطالبة مطلوب");
      if (!guardianPhone) return fail("جوال ولي الأمر غير صحيح (يجب أن يكون 05XXXXXXXX)");
      if (students(ctx).some((s) => norm(s.name) === norm(name)))
        return fail(`الطالبة «${name}» مسجلة مسبقاً`);
      let bus = str(args.bus);
      if (bus) {
        const r = findBus(ctx, bus);
        if ("error" in r) return fail(r.error);
        bus = busShort(ctx, r.item);
      } else {
        const first = buses(ctx)[0];
        bus = first ? busShort(ctx, first) : "غير محدد";
      }
      const amount = t.monthlyFee;
      const vat = calculateSaudiVat(amount);
      const invoiceNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const record: StudentRecord = {
        id: `s-${Date.now()}`,
        tenantSlug: ctx.tenantSlug,
        name,
        phone: normalizePhone(args.phone) ?? guardianPhone,
        guardianPhone,
        district: str(args.district) || t.districts[0] || "غير محدد",
        university: str(args.university) || "جامعة الملك سعود",
        bus,
        status: args.paid === true ? "paid" : "overdue",
        boardingStatus: "none",
        amount,
        invoiceNo,
        zatcaQrBase64: generateZatcaQrBase64({
          sellerName: t.name,
          vatRegistrationNumber: t.vatNumber,
          timestamp: new Date().toISOString(),
          invoiceTotalWithVat: vat.totalAmount.toFixed(2),
          vatTotal: vat.vatAmount.toFixed(2),
        }),
      };
      db.students.unshift(record);
      await syncToFirestore(ctx.tenantSlug, "students", record.id, record as unknown as Record<string, unknown>);
      audit(ctx, `تسجيل الطالبة (${name}) وإصدار فاتورة ${invoiceNo}`, `student:${record.id}`);
      return {
        ok: true,
        summary: `سُجلت ${name} على ${bus} — فاتورة ${invoiceNo} بقيمة ${amount} ر.س`,
        widgetType: "student-created",
        data: record,
        navigateToSection: "students",
      };
    },
  },
  {
    name: "mark_student_paid",
    label: "تسجيل سداد",
    kind: "write",
    description: "Mark a student's subscription as paid (and reactivate the seat if suspended).",
    parameters: {
      type: "object",
      properties: { student: { type: "string", description: "Student name, phone or id" } },
      required: ["student"],
    },
    async run(ctx, args) {
      const r = findStudent(ctx, args.student);
      if ("error" in r) return fail(r.error);
      const s = r.item;
      if (s.status === "paid") return { ok: true, summary: `${s.name} مسددة مسبقاً`, data: studentView(s) };
      s.status = "paid";
      await syncToFirestore(ctx.tenantSlug, "students", s.id, { status: "paid" });
      audit(ctx, `تسجيل سداد الطالبة (${s.name}) وتفعيل المقعد`, `student:${s.id}`);
      return { ok: true, summary: `تم تسجيل سداد ${s.name} وتفعيل مقعدها`, data: studentView(s), navigateToSection: "students" };
    },
  },
  {
    name: "reactivate_student",
    label: "إعادة تفعيل مقعد",
    kind: "write",
    description: "Reactivate a suspended student seat (status becomes overdue unless paid=true).",
    parameters: {
      type: "object",
      properties: { student: { type: "string" }, paid: { type: "boolean" } },
      required: ["student"],
    },
    async run(ctx, args) {
      const r = findStudent(ctx, args.student);
      if ("error" in r) return fail(r.error);
      const s = r.item;
      if (s.status !== "suspended") return { ok: true, summary: `مقعد ${s.name} فعّال مسبقاً`, data: studentView(s) };
      s.status = args.paid === true ? "paid" : "overdue";
      await syncToFirestore(ctx.tenantSlug, "students", s.id, { status: s.status });
      audit(ctx, `إعادة تفعيل مقعد الطالبة (${s.name})`, `student:${s.id}`);
      return { ok: true, summary: `أُعيد تفعيل مقعد ${s.name}`, data: studentView(s), navigateToSection: "students" };
    },
  },
  {
    name: "assign_student_to_bus",
    label: "نقل طالبة لباص",
    kind: "write",
    description: "Move a student to another bus. Fails if the bus is full.",
    parameters: {
      type: "object",
      properties: { student: { type: "string" }, bus: { type: "string", description: "Bus plate" } },
      required: ["student", "bus"],
    },
    async run(ctx, args) {
      const rs = findStudent(ctx, args.student);
      if ("error" in rs) return fail(rs.error);
      const rb = findBus(ctx, args.bus);
      if ("error" in rb) return fail(rb.error);
      const label = busShort(ctx, rb.item);
      const taken = students(ctx).filter((s) => s.bus === label && s.status !== "suspended").length;
      if (taken >= rb.item.capacity) return fail(`${label} ممتلئة (${taken}/${rb.item.capacity})`);
      rs.item.bus = label;
      await syncToFirestore(ctx.tenantSlug, "students", rs.item.id, { bus: label });
      audit(ctx, `نقل الطالبة (${rs.item.name}) إلى ${label}`, `student:${rs.item.id}`);
      return { ok: true, summary: `نُقلت ${rs.item.name} إلى ${label} (${rb.item.plate})`, data: studentView(rs.item), navigateToSection: "students" };
    },
  },
  {
    name: "set_boarding_status",
    label: "تحديث حالة الركوب",
    kind: "write",
    description: "Record today's boarding for a student: boarded | missed | none.",
    parameters: {
      type: "object",
      properties: { student: { type: "string" }, status: { type: "string", enum: ["boarded", "missed", "none"] } },
      required: ["student", "status"],
    },
    async run(ctx, args) {
      const r = findStudent(ctx, args.student);
      if ("error" in r) return fail(r.error);
      const st = str(args.status) as StudentRecord["boardingStatus"];
      if (!["boarded", "missed", "none"].includes(st)) return fail("حالة الركوب غير صحيحة");
      r.item.boardingStatus = st;
      if (st === "boarded") r.item.lastBoardedAt = nowLabel();
      await syncToFirestore(ctx.tenantSlug, "students", r.item.id, { boardingStatus: st });
      const label = st === "boarded" ? "ركبت" : st === "missed" ? "غائبة" : "بدون حالة";
      audit(ctx, `تحديث ركوب الطالبة (${r.item.name}): ${label}`, `student:${r.item.id}`);
      return { ok: true, summary: `${r.item.name}: ${label}`, data: studentView(r.item) };
    },
  },
  {
    name: "add_bus",
    label: "إضافة باص",
    kind: "write",
    description:
      "Add a bus to the fleet. Requires plate. operationCardExpiry as YYYY-MM-DD. If plate missing, call open_form.",
    parameters: {
      type: "object",
      properties: {
        plate: { type: "string" },
        model: { type: "string" },
        capacity: { type: "number" },
        operationCardNo: { type: "string" },
        operationCardExpiry: { type: "string", description: "YYYY-MM-DD" },
        route: { type: "string" },
        assignedDriver: { type: "string", description: "Existing driver name (optional)" },
      },
      required: ["plate"],
    },
    async run(ctx, args) {
      const plate = str(args.plate);
      if (plate.length < 3) return fail("رقم اللوحة مطلوب");
      if (buses(ctx).some((b) => norm(b.plate) === norm(plate))) return fail(`الباص ${plate} مسجل مسبقاً`);
      const expiry = parseDate(args.operationCardExpiry) ?? "2027-12-30";
      const capacity = Math.min(Math.max(Number(args.capacity) || 30, 4), 60);
      const days = daysUntil(expiry);
      const bus: BusRecord = {
        id: `b-${Date.now()}`,
        tenantSlug: ctx.tenantSlug,
        plate,
        model: str(args.model) || "مرسيدس سبرنتر 2025",
        capacity,
        assignedDriver: "غير معين",
        route: str(args.route) || "غير محدد",
        operationCardNo: str(args.operationCardNo) || `TGA-${Math.floor(10000 + Math.random() * 90000)}`,
        operationCardExpiry: expiry,
        daysLeft: days,
        status: statusFromDays(days),
      };
      db.buses.push(bus);
      if (args.assignedDriver) {
        const rd = findDriver(ctx, args.assignedDriver);
        if ("item" in rd) {
          bus.assignedDriver = rd.item.name;
          rd.item.busAssigned = busFull(ctx, bus);
          await syncToFirestore(ctx.tenantSlug, "drivers", rd.item.id, { busAssigned: rd.item.busAssigned });
        }
      }
      await syncToFirestore(ctx.tenantSlug, "buses", bus.id, bus as unknown as Record<string, unknown>);
      audit(ctx, `إضافة الباص (${plate}) للأسطول`, `bus:${bus.id}`);
      return { ok: true, summary: `أُضيفت ${busShort(ctx, bus)} لوحة ${plate} (${capacity} مقعد)`, widgetType: "bus-created", data: bus, navigateToSection: "fleet" };
    },
  },
  {
    name: "add_driver",
    label: "تسجيل سائق",
    kind: "write",
    description:
      "Register a driver. Requires name and phone. licenseExpiry YYYY-MM-DD. If required fields missing, call open_form.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        phone: { type: "string" },
        nationalId: { type: "string", description: "10 digits" },
        licenseExpiry: { type: "string", description: "YYYY-MM-DD" },
        bus: { type: "string", description: "Bus plate to assign (optional)" },
      },
      required: ["name", "phone"],
    },
    async run(ctx, args) {
      const name = str(args.name);
      const phone = normalizePhone(args.phone);
      if (name.length < 3) return fail("اسم السائق مطلوب");
      if (!phone) return fail("جوال السائق غير صحيح");
      const nid = str(args.nationalId);
      if (nid && !/^[12]\d{9}$/.test(nid)) return fail("رقم الهوية/الإقامة يجب أن يكون 10 أرقام");
      let busPlate = "غير معين";
      if (args.bus) {
        const rb = findBus(ctx, args.bus);
        if ("error" in rb) return fail(rb.error);
        busPlate = busFull(ctx, rb.item);
        rb.item.assignedDriver = name;
        await syncToFirestore(ctx.tenantSlug, "buses", rb.item.id, { assignedDriver: name });
      }
      const expiry = parseDate(args.licenseExpiry) ?? "2027-12-30";
      const days = daysUntil(expiry);
      const driver: DriverRecord = {
        id: `d-${Date.now()}`,
        tenantSlug: ctx.tenantSlug,
        name,
        phone,
        nationalId: nid || "غير مسجل",
        licenseType: "نقل ثقيل / حافلة",
        licenseExpiry: expiry,
        driverCardNo: `DRV-${Math.floor(10000 + Math.random() * 90000)}`,
        daysLeft: days,
        busAssigned: busPlate,
        status: statusFromDays(days),
      };
      db.drivers.push(driver);
      await syncToFirestore(ctx.tenantSlug, "drivers", driver.id, driver as unknown as Record<string, unknown>);
      audit(ctx, `تسجيل السائق (${name})${busPlate !== "غير معين" ? ` على ${busPlate}` : ""}`, `driver:${driver.id}`);
      return { ok: true, summary: `سُجل السائق ${name}${busPlate !== "غير معين" ? ` على ${busPlate}` : ""}`, widgetType: "driver-created", data: driver, navigateToSection: "drivers" };
    },
  },
  {
    name: "assign_driver_to_bus",
    label: "تعيين سائق على باص",
    kind: "write",
    description: "Assign an existing driver to a bus.",
    parameters: {
      type: "object",
      properties: { driver: { type: "string" }, bus: { type: "string" } },
      required: ["driver", "bus"],
    },
    async run(ctx, args) {
      const rd = findDriver(ctx, args.driver);
      if ("error" in rd) return fail(rd.error);
      const rb = findBus(ctx, args.bus);
      if ("error" in rb) return fail(rb.error);
      const prev = buses(ctx).find((b) => b.assignedDriver === rd.item.name && b.id !== rb.item.id);
      if (prev) { prev.assignedDriver = "غير معين"; await syncToFirestore(ctx.tenantSlug, "buses", prev.id, { assignedDriver: "غير معين" }); }
      rd.item.busAssigned = busFull(ctx, rb.item);
      rb.item.assignedDriver = rd.item.name;
      await syncToFirestore(ctx.tenantSlug, "drivers", rd.item.id, { busAssigned: rd.item.busAssigned });
      await syncToFirestore(ctx.tenantSlug, "buses", rb.item.id, { assignedDriver: rd.item.name });
      audit(ctx, `تعيين السائق (${rd.item.name}) على باص ${rb.item.plate}`, `bus:${rb.item.id}`);
      return { ok: true, summary: `عُيّن ${rd.item.name} على باص ${rb.item.plate}`, navigateToSection: "fleet" };
    },
  },
  {
    name: "renew_document",
    label: "تجديد وثيقة",
    kind: "write",
    description:
      "Update the expiry date after renewal. type: bus_operation_card (ref = bus plate) | driver_license (ref = driver name). newExpiry YYYY-MM-DD; if omitted, extends one year from current expiry or today.",
    parameters: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["bus_operation_card", "driver_license"] },
        ref: { type: "string" },
        newExpiry: { type: "string", description: "YYYY-MM-DD" },
      },
      required: ["type", "ref"],
    },
    async run(ctx, args) {
      const plusYear = (from: string) => {
        const base = new Date(Math.max(Date.now(), new Date(`${from}T00:00:00`).getTime() || 0));
        base.setFullYear(base.getFullYear() + 1);
        return base.toISOString().slice(0, 10);
      };
      if (args.type === "bus_operation_card") {
        const rb = findBus(ctx, args.ref);
        if ("error" in rb) return fail(rb.error);
        const expiry = parseDate(args.newExpiry) ?? plusYear(rb.item.operationCardExpiry);
        if (daysUntil(expiry) <= 0) return fail("تاريخ الانتهاء الجديد يجب أن يكون في المستقبل");
        rb.item.operationCardExpiry = expiry;
        rb.item.daysLeft = daysUntil(expiry);
        rb.item.status = statusFromDays(rb.item.daysLeft);
        await syncToFirestore(ctx.tenantSlug, "buses", rb.item.id, {
          operationCardExpiry: expiry, daysLeft: rb.item.daysLeft, status: rb.item.status,
        });
        audit(ctx, `تجديد كرت تشغيل باص ${rb.item.plate} حتى ${expiry}`, `bus:${rb.item.id}`);
        return { ok: true, summary: `جُدد كرت تشغيل ${rb.item.plate} حتى ${ltr(expiry)}`, navigateToSection: "fleet" };
      }
      if (args.type === "driver_license") {
        const rd = findDriver(ctx, args.ref);
        if ("error" in rd) return fail(rd.error);
        const expiry = parseDate(args.newExpiry) ?? plusYear(rd.item.licenseExpiry);
        if (daysUntil(expiry) <= 0) return fail("تاريخ الانتهاء الجديد يجب أن يكون في المستقبل");
        rd.item.licenseExpiry = expiry;
        rd.item.daysLeft = daysUntil(expiry);
        rd.item.status = statusFromDays(rd.item.daysLeft);
        await syncToFirestore(ctx.tenantSlug, "drivers", rd.item.id, {
          licenseExpiry: expiry, daysLeft: rd.item.daysLeft, status: rd.item.status,
        });
        audit(ctx, `تجديد رخصة السائق (${rd.item.name}) حتى ${expiry}`, `driver:${rd.item.id}`);
        return { ok: true, summary: `جُددت رخصة ${rd.item.name} حتى ${ltr(expiry)}`, navigateToSection: "drivers" };
      }
      return fail("نوع الوثيقة غير معروف");
    },
  },
  {
    name: "add_route",
    label: "إضافة مسار",
    kind: "write",
    description: "Publish a new route. Requires name and university. If missing, call open_form.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        districts: { type: "string", description: "Comma separated" },
        university: { type: "string" },
        monthlyPrice: { type: "number" },
        bus: { type: "string" },
      },
      required: ["name", "university"],
    },
    async run(ctx, args) {
      const t = tenantOf(ctx);
      const name = str(args.name);
      if (name.length < 3) return fail("اسم المسار مطلوب");
      if (!str(args.university)) return fail("الجامعة مطلوبة");
      const price = Number(args.monthlyPrice) || t.monthlyFee;
      if (price < 50 || price > 5000) return fail("السعر الشهري غير منطقي");
      const route: RouteRecord = {
        id: `r-${Date.now()}`,
        tenantSlug: ctx.tenantSlug,
        name,
        districts: str(args.districts) || t.districts.join("، "),
        university: str(args.university),
        monthlyPrice: price,
        bus: str(args.bus) || "غير محدد",
        enrolled: 0,
      };
      db.routes.push(route);
      await syncToFirestore(ctx.tenantSlug, "routes", route.id, route as unknown as Record<string, unknown>);
      audit(ctx, `نشر مسار جديد (${name}) بسعر ${price} ر.س`, `route:${route.id}`);
      return { ok: true, summary: `نُشر مسار ${name} بسعر ${price} ر.س`, widgetType: "route-created", data: route, navigateToSection: "routes" };
    },
  },

  // ---------------------------- SENSITIVE (needs confirmation) ----------------------------
  {
    name: "send_payment_reminders",
    label: "إرسال تذكيرات سداد واتساب",
    kind: "sensitive",
    description:
      "Send WhatsApp payment reminders to guardians. students: optional list of names; if empty, targets ALL overdue students. Requires user confirmation.",
    parameters: {
      type: "object",
      properties: { students: { type: "array", items: { type: "string" } } },
    },
    preview(ctx, args) {
      const targets = overdueTargets(ctx, args.students);
      if (typeof targets === "string") return fail(targets);
      if (!targets.length) return fail("لا توجد طالبات متأخرات للتذكير");
      return {
        ok: true,
        summary: `إرسال ${targets.length} رسالة واتساب لأولياء أمور: ${targets.map((s) => s.name).join("، ")}`,
        data: { recipients: targets.map((s) => ({ name: s.name, phone: s.guardianPhone })), sample: reminderText(ctx, targets[0]) },
        resolvedArgs: { students: targets.map((s) => s.name) },
      };
    },
    async run(ctx, args) {
      const targets = overdueTargets(ctx, args.students);
      if (typeof targets === "string") return fail(targets);
      if (!targets.length) return fail("لا توجد طالبات متأخرات للتذكير");
      for (const s of targets) queueWhatsapp(ctx, s.guardianPhone, reminderText(ctx, s));
      audit(ctx, `إرسال ${targets.length} تذكير سداد واتساب`, "notifications:bulk");
      return { ok: true, summary: `أُرسل ${targets.length} تذكير واتساب: ${targets.map((s) => s.name).join("، ")}`, widgetType: "whatsapp-sent", data: targets.map(studentView) };
    },
  },
  {
    name: "send_whatsapp_message",
    label: "إرسال رسالة واتساب",
    kind: "sensitive",
    description:
      "Send a custom WhatsApp message to a student's guardian or a driver. to: name of student or driver. Requires confirmation.",
    parameters: {
      type: "object",
      properties: { to: { type: "string" }, message: { type: "string" } },
      required: ["to", "message"],
    },
    preview(ctx, args) {
      const msg = str(args.message);
      if (msg.length < 3) return fail("نص الرسالة مطلوب");
      const rs = findStudent(ctx, args.to);
      if ("item" in rs) return { ok: true, summary: `رسالة لولي أمر ${rs.item.name} (${rs.item.guardianPhone}): «${msg}»` };
      const rd = findDriver(ctx, args.to);
      if ("item" in rd) return { ok: true, summary: `رسالة للسائق ${rd.item.name} (${rd.item.phone}): «${msg}»` };
      return fail(`لم أجد مستلماً باسم «${str(args.to)}»`);
    },
    async run(ctx, args) {
      const msg = str(args.message);
      const rs = findStudent(ctx, args.to);
      const phone = "item" in rs ? rs.item.guardianPhone : (() => {
        const rd = findDriver(ctx, args.to);
        return "item" in rd ? rd.item.phone : null;
      })();
      if (!phone || msg.length < 3) return fail("تعذر تحديد المستلم أو نص الرسالة");
      queueWhatsapp(ctx, phone, msg);
      audit(ctx, `إرسال رسالة واتساب مخصصة إلى ${phone}`, "notification");
      return { ok: true, summary: `أُرسلت الرسالة إلى ${phone}`, widgetType: "whatsapp-sent" };
    },
  },
  {
    name: "suspend_students",
    label: "إيقاف مقاعد",
    kind: "sensitive",
    description:
      "Suspend seats. students: list of names; if empty, suspends ALL overdue students. Requires confirmation.",
    parameters: {
      type: "object",
      properties: { students: { type: "array", items: { type: "string" } } },
    },
    preview(ctx, args) {
      const targets = overdueTargets(ctx, args.students);
      if (typeof targets === "string") return fail(targets);
      const active = targets.filter((s) => s.status !== "suspended");
      if (!active.length) return fail("لا توجد مقاعد قابلة للإيقاف");
      return {
        ok: true,
        summary: `إيقاف ${active.length} مقعد: ${active.map((s) => s.name).join("، ")}`,
        resolvedArgs: { students: active.map((s) => s.name) },
      };
    },
    async run(ctx, args) {
      const targets = overdueTargets(ctx, args.students);
      if (typeof targets === "string") return fail(targets);
      const active = targets.filter((s) => s.status !== "suspended");
      if (!active.length) return fail("لا توجد مقاعد قابلة للإيقاف");
      for (const s of active) {
        s.status = "suspended";
        await syncToFirestore(ctx.tenantSlug, "students", s.id, { status: "suspended" });
        audit(ctx, `إيقاف مقعد الطالبة (${s.name})`, `student:${s.id}`);
      }
      return { ok: true, summary: `أُوقف ${active.length} مقعد: ${active.map((s) => s.name).join("، ")}`, data: active.map(studentView), navigateToSection: "students" };
    },
  },

  // ---------------------------- UI ----------------------------
  {
    name: "open_form",
    label: "فتح نموذج إدخال",
    kind: "ui",
    description:
      "Open an inline form in the chat when required details are missing. formType: student-form | bus-form | driver-form | route-form. prefill: any values already known.",
    parameters: {
      type: "object",
      properties: {
        formType: { type: "string", enum: ["student-form", "bus-form", "driver-form", "route-form"] },
        prefill: { type: "object", properties: { name: { type: "string" }, plate: { type: "string" }, phone: { type: "string" } } },
      },
      required: ["formType"],
    },
    async run(_ctx, args) {
      const formType = str(args.formType) as FormType;
      if (!["student-form", "bus-form", "driver-form", "route-form"].includes(formType)) return fail("نوع النموذج غير معروف");
      const prefill: Record<string, string> = {};
      if (args.prefill && typeof args.prefill === "object") {
        for (const [k, v] of Object.entries(args.prefill as Record<string, unknown>)) if (v) prefill[k] = String(v);
      }
      return { ok: true, summary: "فُتح نموذج الإدخال", interactiveForm: { formType, prefill } };
    },
  },
];

export const TOOL_MAP = new Map(TOOLS.map((t) => [t.name, t]));
