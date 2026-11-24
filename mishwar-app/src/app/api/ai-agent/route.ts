/**
 * POST /api/ai-agent — Mishwar action-taking AI agent.
 *
 * Body (one of):
 *   { message, tenantSlug, history?: {role,text}[] }          → run the agent loop
 *   { confirmActionId, approve: boolean, tenantSlug }          → execute / cancel a queued sensitive batch
 *   { directTool: {name,args}, tenantSlug }                    → submit an inline chat form
 *
 * Response: AgentResponse (see src/lib/agent/engine.ts) — includes the step
 * trace, optional pendingAction (needs confirmation) and interactiveForm.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resolvePending, runAgent, type HistoryTurn } from "@/lib/agent/engine";
import { TOOL_MAP } from "@/lib/agent/tools";

// Forms that can be submitted directly from the chat UI (always non-sensitive writes).
const FORM_TOOLS = new Set(["create_student", "add_bus", "add_driver", "add_route"]);

/** Map legacy form field names to the tool's argument schema. */
function adaptFormArgs(name: string, a: Record<string, unknown>) {
  switch (name) {
    case "create_student":
      return { ...a, paid: false };
    case "add_bus":
      return { ...a, operationCardNo: a.cardNo ?? a.operationCardNo, operationCardExpiry: a.cardExpiry ?? a.operationCardExpiry };
    case "add_driver":
      return { ...a, bus: a.busAssigned ?? a.bus };
    default:
      return a;
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reply: "طلب غير صالح" }, { status: 400 });
  }

  const tenantSlug = String(body.tenantSlug || "darb-alaman");
  if (!db.tenants.some((t) => t.slug === tenantSlug)) {
    return NextResponse.json({ ok: false, reply: "المؤسسة غير موجودة" }, { status: 404 });
  }

  // 1) Human-in-the-loop confirmation of a queued batch
  if (typeof body.confirmActionId === "string") {
    const res = await resolvePending(tenantSlug, body.confirmActionId, body.approve === true);
    return NextResponse.json(res);
  }

  // 2) Inline form submission
  const directTool = body.directTool as { name?: string; args?: Record<string, unknown> } | undefined;
  if (directTool?.name) {
    const tool = TOOL_MAP.get(directTool.name);
    if (!tool || !FORM_TOOLS.has(directTool.name)) {
      return NextResponse.json({ ok: false, reply: "إجراء غير مسموح" }, { status: 400 });
    }
    const result = await tool.run({ tenantSlug }, adaptFormArgs(directTool.name, directTool.args ?? {}));
    return NextResponse.json({
      ok: result.ok,
      mode: "form",
      model: "form-executor",
      reply: result.ok ? `تم ✅ ${result.summary}` : `ما تم الحفظ: ${result.summary}`,
      steps: [{ tool: tool.name, label: tool.label, kind: tool.kind, args: {}, ok: result.ok, summary: result.summary, status: result.ok ? "done" : "failed" }],
      mutated: result.ok,
      actionExecuted: result.ok
        ? { widgetType: result.widgetType ?? tool.name, summary: result.summary, data: result.data, navigateToSection: result.navigateToSection }
        : undefined,
      // Re-open the same form so the user can fix the input
      interactiveForm: result.ok ? undefined : formFor(directTool.name, directTool.args),
    });
  }

  // 3) Natural-language request → agent loop
  const message = String(body.message ?? "").trim().slice(0, 2000);
  if (!message) return NextResponse.json({ ok: false, reply: "اكتب طلبك" }, { status: 400 });
  const history: HistoryTurn[] = Array.isArray(body.history)
    ? (body.history as HistoryTurn[])
        .filter((h) => h && (h.role === "user" || h.role === "assistant") && typeof h.text === "string")
        .slice(-12)
        .map((h) => ({ role: h.role, text: h.text.slice(0, 1500) }))
    : [];

  const res = await runAgent(tenantSlug, message, history);
  return NextResponse.json(res);
}

function formFor(name: string, args?: Record<string, unknown>) {
  const map: Record<string, "student-form" | "bus-form" | "driver-form" | "route-form"> = {
    create_student: "student-form",
    add_bus: "bus-form",
    add_driver: "driver-form",
    add_route: "route-form",
  };
  const prefill: Record<string, string> = {};
  for (const [k, v] of Object.entries(args ?? {})) if (v !== undefined && v !== null) prefill[k] = String(v);
  return { formType: map[name], prefill };
}
