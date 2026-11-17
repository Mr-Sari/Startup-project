import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { db, syncToFirestore } from "@/lib/db";
import { generateZatcaQrBase64, calculateSaudiVat } from "@/lib/zatca";

/**
 * Interactive AI Agent Architect with Human-in-the-Loop (HITL) Slot-Filling & Generative UI Forms
 * When the user says "أضف طالبة" or "أضف باص" or "سجل سائق" without full details,
 * the Agent responds with an interactive inline Generative UI Form (`formType`) to collect the required fields!
 */

const toolsDefinition = [
  {
    name: "request_student_form",
    description:
      "يُستدعى عندما يطلب المستخدم إضافة أو تسجيل طالبة جديدة بدون ذكر كافة البيانات، لعرض نموذج إدخال بيانات الطالبة داخل الشات.",
    parameters: {
      type: "object",
      properties: {
        prefillName: { type: "string", description: "اسم الطالبة إن ذُكر في الرسالة" },
        prefillDistrict: { type: "string", description: "الحي إن ذُكر" },
      },
    },
    type: "function" as const,
  },
  {
    name: "create_student",
    description:
      "تسجيل طالبة جديدة فعلياً في قاعدة البيانات و Firebase وإصدار فاتورة ZATCA الضريبية عندما تتوفر بياناتها الكاملة.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "اسم الطالبة الثلاثي" },
        phone: { type: "string", description: "رقم جوال الطالبة" },
        guardianPhone: { type: "string", description: "رقم جوال ولي الأمر" },
        district: { type: "string", description: "الحي السكني" },
        university: { type: "string", description: "الجامعة" },
        bus: { type: "string", description: "الحافلة المخصصة" },
        amount: { type: "number", description: "مبلغ الاشتراك الشهري" },
      },
      required: ["name", "phone"],
    },
    type: "function" as const,
  },
  {
    name: "request_bus_form",
    description:
      "يُستدعى عندما يطلب المستخدم إضافة باص أو حافلة جديدة بدون تحديد كامل التفاصيل، لعرض نموذج تعبئة بيانات الحافلة داخل الشات.",
    parameters: {
      type: "object",
      properties: {
        prefillModel: { type: "string" },
        prefillPlate: { type: "string" },
      },
    },
    type: "function" as const,
  },
  {
    name: "add_bus",
    description: "حفظ وإضافة باص جديد فعلياً في أسطول المؤسسة وقاعدة بيانات Firebase.",
    parameters: {
      type: "object",
      properties: {
        plate: { type: "string", description: "رقم لوحة الباص" },
        model: { type: "string", description: "نوع وموديل الحافلة" },
        capacity: { type: "number", description: "عدد المقاعد" },
        assignedDriver: { type: "string", description: "السائق المسؤول" },
        route: { type: "string", description: "المسار" },
        cardNo: { type: "string", description: "رقم بطاقة التشغيل TGA" },
        cardExpiry: { type: "string", description: "تاريخ انتهاء بطاقة التشغيل" },
      },
      required: ["plate", "model"],
    },
    type: "function" as const,
  },
  {
    name: "request_driver_form",
    description:
      "يُستدعى عندما يطلب المستخدم تسجيل أو إضافة سائق جديد بدون ذكر كافة بياناته، لعرض نموذج إدخال بيانات السائق داخل الشات.",
    parameters: {
      type: "object",
      properties: {
        prefillName: { type: "string" },
      },
    },
    type: "function" as const,
  },
  {
    name: "add_driver",
    description: "حفظ وتسجيل سائق جديد فعلياً في قاعدة بيانات المؤسسة و Firebase.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "اسم السائق الثلاثي" },
        phone: { type: "string", description: "رقم الجوال" },
        nationalId: { type: "string", description: "رقم الهوية أو الإقامة" },
        busAssigned: { type: "string", description: "الباص المخصص" },
        licenseExpiry: { type: "string", description: "تاريخ انتهاء الرخصة" },
      },
      required: ["name", "phone"],
    },
    type: "function" as const,
  },
  {
    name: "request_route_form",
    description: "عرض نموذج إضافة مسار نقل جديد داخل الشات ليقوم المستخدم بتعبئته.",
    parameters: {
      type: "object",
      properties: {},
    },
    type: "function" as const,
  },
  {
    name: "add_route",
    description: "حفظ مسار نقل جديد في قاعدة البيانات و Firebase.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        districts: { type: "string" },
        university: { type: "string" },
        monthlyPrice: { type: "number" },
        bus: { type: "string" },
      },
      required: ["name", "districts"],
    },
    type: "function" as const,
  },
  {
    name: "toggle_student_seat",
    description: "إيقاف أو إعادة تفعيل مقعد طالبة في الحافلة.",
    parameters: {
      type: "object",
      properties: {
        studentNameOrId: { type: "string" },
      },
      required: ["studentNameOrId"],
    },
    type: "function" as const,
  },
  {
    name: "send_whatsapp_reminders",
    description: "إرسال تذكيرات دفع واتساب جماعية للطالبات المتأخرات.",
    parameters: {
      type: "object",
      properties: {},
    },
    type: "function" as const,
  },
];

async function executeDatabaseMutation(
  tenantSlug: string,
  toolName: string,
  args: Record<string, unknown>
) {
  const tenant = db.tenants.find((t) => t.slug === tenantSlug) || db.tenants[0];

  if (toolName === "create_student") {
    const amount = Number(args.amount) || tenant.monthlyFee || 650;
    const invoiceNo = `INV-2026-${Math.floor(105 + Math.random() * 890)}`;
    const { vatAmount, totalAmount } = calculateSaudiVat(amount);
    const zatcaQrBase64 = generateZatcaQrBase64({
      sellerName: tenant.name,
      vatRegistrationNumber: tenant.vatNumber,
      timestamp: new Date().toISOString(),
      invoiceTotalWithVat: totalAmount.toFixed(2),
      vatTotal: vatAmount.toFixed(2),
    });

    const newStudent = {
      id: `st-${Date.now().toString().slice(-4)}`,
      tenantSlug,
      name: String(args.name),
      phone: String(args.phone),
      guardianPhone: String(args.guardianPhone || args.phone),
      district: String(args.district || "حي الياسمين"),
      university: String(args.university || "جامعة الأميرة نورة بنت عبدالرحمن"),
      bus: String(args.bus || "حافلة 01"),
      status: (args.paymentStatus === "overdue" ? "overdue" : "paid") as "paid" | "overdue",
      boardingStatus: "none" as const,
      amount: totalAmount,
      invoiceNo,
      zatcaQrBase64,
    };

    db.students.unshift(newStudent);
    await syncToFirestore(
      tenantSlug,
      "students",
      newStudent.id,
      newStudent as unknown as Record<string, unknown>
    );

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      tenantSlug,
      actor: "وكيل الذكاء الاصطناعي التفاعلي",
      action: `تسجيل الطالبة (${newStudent.name}) في (${newStudent.district} ➔ ${newStudent.university}) وإصدار فاتورة ZATCA رقم ${invoiceNo}`,
      resource: `student:${newStudent.id}`,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    });

    return {
      widgetType: "student-created",
      summary: `تم تسجيل الطالبة «${newStudent.name}» بنجاح في حافلة (${newStudent.bus}) وإصدار الفاتورة الضريبية (${invoiceNo}) وحفظها في Firebase Firestore.`,
      data: newStudent,
      navigateToSection: "subscriptions",
    };
  }

  if (toolName === "add_bus") {
    const newBus = {
      id: `b-${Date.now().toString().slice(-4)}`,
      tenantSlug,
      plate: String(args.plate),
      model: String(args.model),
      capacity: Number(args.capacity) || 30,
      assignedDriver: String(args.assignedDriver || "محمد السعيد"),
      route: String(args.route || "مسار الياسمين والنرجس ➔ جامعة نورة"),
      operationCardNo: String(
        args.cardNo || `TGA-${Math.floor(10000 + Math.random() * 90000)}`
      ),
      operationCardExpiry: String(args.cardExpiry || "2027-12-30"),
      daysLeft: 365,
      status: "active" as const,
    };

    db.buses.unshift(newBus);
    await syncToFirestore(
      tenantSlug,
      "buses",
      newBus.id,
      newBus as unknown as Record<string, unknown>
    );

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      tenantSlug,
      actor: "وكيل الذكاء الاصطناعي التفاعلي",
      action: `إضافة الحافلة (${newBus.model}) لوحة [${newBus.plate}] عبر النموذج التفاعلي`,
      resource: `bus:${newBus.id}`,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    });

    return {
      widgetType: "bus-created",
      summary: `تم اعتماد وإضافة الباص «${newBus.model}» بلوحة [${newBus.plate}] وسعة ${newBus.capacity} مقعداً وحفظه في Firebase بنجاح.`,
      data: newBus,
      navigateToSection: "buses",
    };
  }

  if (toolName === "add_driver") {
    const newDriver = {
      id: `d-${Date.now().toString().slice(-4)}`,
      tenantSlug,
      name: String(args.name),
      phone: String(args.phone),
      nationalId: String(args.nationalId || "1088776655"),
      licenseType: "نقل ثقيل / حافلة",
      licenseExpiry: String(args.licenseExpiry || "2028-06-30"),
      driverCardNo: `DRV-${Math.floor(10000 + Math.random() * 90000)}`,
      daysLeft: 365,
      busAssigned: String(args.busAssigned || "حافلة 01 (أ ب ج 1234)"),
      status: "active" as const,
    };

    db.drivers.unshift(newDriver);
    await syncToFirestore(
      tenantSlug,
      "drivers",
      newDriver.id,
      newDriver as unknown as Record<string, unknown>
    );

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      tenantSlug,
      actor: "وكيل الذكاء الاصطناعي التفاعلي",
      action: `تسجيل السائق (${newDriver.name}) وتعيينه على (${newDriver.busAssigned})`,
      resource: `driver:${newDriver.id}`,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    });

    return {
      widgetType: "driver-created",
      summary: `تم تسجيل السائق «${newDriver.name}» برقم جوال (${newDriver.phone}) وتعيينه على (${newDriver.busAssigned}) وحفظه في Firebase بنجاح.`,
      data: newDriver,
      navigateToSection: "drivers",
    };
  }

  if (toolName === "add_route") {
    const newRoute = {
      id: `r-${Date.now().toString().slice(-4)}`,
      tenantSlug,
      name: String(args.name),
      districts: String(args.districts),
      university: String(args.university || "جامعة الأميرة نورة بنت عبدالرحمن"),
      monthlyPrice: Number(args.monthlyPrice) || 650,
      bus: String(args.bus || "حافلة 01 (30 مقعد)"),
      enrolled: 0,
    };

    db.routes.unshift(newRoute);
    await syncToFirestore(
      tenantSlug,
      "routes",
      newRoute.id,
      newRoute as unknown as Record<string, unknown>
    );

    db.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      tenantSlug,
      actor: "وكيل الذكاء الاصطناعي التفاعلي",
      action: `إنشاء مسار نقل جديد (${newRoute.name}) بسعر ${newRoute.monthlyPrice} ر.س`,
      resource: `route:${newRoute.id}`,
      timestamp: new Date().toLocaleTimeString("ar-SA"),
    });

    return {
      widgetType: "route-created",
      summary: `تم نشر المسار الجديد «${newRoute.name}» للأحياء (${newRoute.districts}) بسعر ${newRoute.monthlyPrice} ر.س في الموقع وقاعدة البيانات.`,
      data: newRoute,
      navigateToSection: "routes",
    };
  }

  if (toolName === "toggle_student_seat") {
    const queryStr = String(args.studentNameOrId || "").trim();
    const tenantStudents = db.students.filter((s) => s.tenantSlug === tenantSlug);
    const student =
      tenantStudents.find((s) => s.name.includes(queryStr) || s.id === queryStr) ||
      tenantStudents[0];

    if (student) {
      student.status = student.status === "suspended" ? "paid" : "suspended";
      await syncToFirestore(
        tenantSlug,
        "students",
        student.id,
        student as unknown as Record<string, unknown>
      );
      return {
        widgetType: "student-toggled",
        summary:
          student.status === "suspended"
            ? `تم إيقاف مقعد الطالبة «${student.name}» وحجبها من قائمة السائق فوراً.`
            : `تمت إعادة تفعيل مقعد الطالبة «${student.name}» وإدراجها في كشف السائق.`,
        data: student,
        navigateToSection: "subscriptions",
      };
    }
  }

  if (toolName === "send_whatsapp_reminders") {
    const unpaid = db.students.filter(
      (s) => s.tenantSlug === tenantSlug && s.status !== "paid"
    );
    for (const st of unpaid) {
      const notif = {
        id: `not-${Date.now()}-${st.id}`,
        tenantSlug,
        recipientPhone: st.phone,
        channel: "whatsapp" as const,
        message: `تذكير من ${tenant.name}: يرجى سداد اشتراك النقل الجامعي (${st.amount} ر.س) عبر مدى أو Apple Pay.`,
        sentAt: new Date().toLocaleTimeString("ar-SA"),
      };
      db.notifications.unshift(notif);
      await syncToFirestore(
        tenantSlug,
        "notifications",
        notif.id,
        notif as unknown as Record<string, unknown>
      );
    }
    return {
      widgetType: "overdue-report",
      summary: `تم إرسال ${unpaid.length} رسائل واتساب تذكيرية بروابط دفع مدى وApple Pay للطالبات المتأخرات.`,
      data: unpaid,
    };
  }

  return null;
}

/**
 * Interactive Conversational Slot-Filling Detector
 * Distinguishes between:
 *  - "أضف طالبة" (Needs Interactive Form so the user can fill in the details!)
 *  - vs a completed form submission (`directTool`)
 */
function analyzeInteractiveIntent(message: string) {
  const text = message.trim();

  // 1. User wants to add/register a Student -> Return Interactive Student Form!
  if (/(اضف|أضف|سجل|تسجيل|إضافة|انشئ|ادخل|أدخل|ابغى اضيف|اريد اضافة)\s*(طالبة|طالبه|مشتركة|مشتركه)/.test(text) || text === "طالبة" || text === "إضافة طالبة") {
    const nameMatch = text.replace(/(اضف|أضف|سجل|تسجيل|إضافة|طالبة|طالبه|جديدة|جديده|باسم|اسمها)/g, "").trim();
    return {
      type: "interactive-form" as const,
      formType: "student-form" as const,
      reply:
        "بكل سرور! لتسجيل الطالبة وإصدار فاتورتها الضريبية (ZATCA) وإدراجها في كشف السائق، تفضل بتعبئة البيانات اللازمة في البطاقة التفاعلية التالية:",
      prefill: {
        name: nameMatch.length > 2 ? nameMatch : "",
      },
    };
  }

  // 2. User wants to add a Bus -> Return Interactive Bus Form!
  if (/(اضف|أضف|سجل|تسجيل|إضافة|انشئ|ابغى اضيف)\s*(باص|حافلة|حافله)/.test(text) || text === "باص" || text === "إضافة باص") {
    return {
      type: "interactive-form" as const,
      formType: "bus-form" as const,
      reply:
        "أبشر! لإضافة حافلة جديدة إلى أسطول المؤسسة وربطها بتنبيهات هيئة النقل (TGA)، يرجى إدخال بيانات الباص في النموذج التالي:",
      prefill: {},
    };
  }

  // 3. User wants to add a Driver -> Return Interactive Driver Form!
  if (/(اضف|أضف|سجل|تسجيل|إضافة|عيّن|عين|ابغى اضيف)\s*(سائق|كابتن)/.test(text) || text === "سائق" || text === "إضافة سائق") {
    return {
      type: "interactive-form" as const,
      formType: "driver-form" as const,
      reply:
        "تفضل! لتسجيل سائق جديد في المؤسسة وتعيين الحافلة المخصصة له ومتابعة صلاحية رخصته، عبئ البيانات التالية:",
      prefill: {},
    };
  }

  // 4. User wants to add a Route -> Return Interactive Route Form!
  if (/(اضف|أضف|سجل|تسجيل|إضافة|افتح|انشئ)\s*(مسار|خط)/.test(text) || text === "مسار" || text === "إضافة مسار") {
    return {
      type: "interactive-form" as const,
      formType: "route-form" as const,
      reply:
        "ممتاز! لإضافة مسار نقل جديد يظهر للطالبات في صفحة التسجيل الخاصة بمؤسستك، يرجى تحديد الأحياء والجامعة والسعر الشهري:",
      prefill: {},
    };
  }

  // 5. Toggle Student Seat
  if (/(اوقف|أوقف|ايقاف|إيقاف|فعل|فعّل|تفعيل|تنشيط)\s*(مقعد|الطالبة|طالبة)?/.test(text)) {
    const names = ["سارة", "منيرة", "نورة", "ريم", "لينا"];
    const matchedName = names.find((n) => text.includes(n)) || "نورة المطيري";
    return {
      type: "direct-mutation" as const,
      toolName: "toggle_student_seat",
      args: { studentNameOrId: matchedName },
    };
  }

  // 6. WhatsApp Reminders
  if (/(واتساب|تذكير|تحصيل|متأخرات|متاخرات|روابط دفع)/.test(text)) {
    return {
      type: "direct-mutation" as const,
      toolName: "send_whatsapp_reminders",
      args: {},
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message = "",
      tenantSlug = "darb-alaman",
      previousInteractionId,
      directTool,
    } = body;

    // 1. When the user submits one of the Interactive Generative UI Forms inside the chat!
    if (directTool) {
      const actionResult = await executeDatabaseMutation(
        tenantSlug,
        directTool.name,
        directTool.args || {}
      );
      return NextResponse.json({
        ok: true,
        model: "gemini-4-hydrogen (Form Executor)",
        reply: actionResult?.summary || "تم حفظ البيانات بنجاح.",
        actionExecuted: actionResult,
      });
    }

    // 2. Check interactive intent first so "أضف طالبة" / "أضف باص" / "أضف سائق" ALWAYS opens the interactive form for the user to fill!
    const interactiveIntent = analyzeInteractiveIntent(message);
    if (interactiveIntent) {
      if (interactiveIntent.type === "interactive-form") {
        const tenantBuses = db.buses.filter((b) => b.tenantSlug === tenantSlug);
        const tenantDrivers = db.drivers.filter((d) => d.tenantSlug === tenantSlug);
        const tenantRoutes = db.routes.filter((r) => r.tenantSlug === tenantSlug);

        return NextResponse.json({
          ok: true,
          model: "gemini-4-hydrogen (Interactive Slot-Filling Agent)",
          reply: interactiveIntent.reply,
          interactiveForm: {
            formType: interactiveIntent.formType,
            prefill: interactiveIntent.prefill,
            options: {
              buses: tenantBuses.map((b) => `${b.model} (${b.plate})`),
              drivers: tenantDrivers.map((d) => d.name),
              routes: tenantRoutes.map((r) => r.name),
            },
          },
        });
      }

      if (interactiveIntent.type === "direct-mutation") {
        const actionResult = await executeDatabaseMutation(
          tenantSlug,
          interactiveIntent.toolName,
          interactiveIntent.args
        );
        return NextResponse.json({
          ok: true,
          model: "gemini-4-hydrogen",
          reply: actionResult?.summary,
          actionExecuted: actionResult,
        });
      }
    }

    // 3. If user has GEMINI_API_KEY configured, allow open-ended reasoning & tool calling via @google/genai
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const interaction = await ai.interactions.create({
          model: "gemini-4-hydrogen",
          system_instruction:
            "أنت المساعد التنفيذي التفاعلي لمنصة «مشوار». إذا طلب المستخدم إضافة طالبة أو باص أو سائق أو مسار، استدعِ أداة request_student_form أو request_bus_form أو request_driver_form أو request_route_form لعرض النموذج التفاعلي له ليقوم بتعبئة البيانات.",
          input: message,
          ...(previousInteractionId ? { previous_interaction_id: previousInteractionId } : {}),
          tools: toolsDefinition,
        });

        for (const step of interaction.steps || []) {
          if (step.type === "function_call" && step.name) {
            if (step.name.startsWith("request_")) {
              const mapForm: Record<string, string> = {
                request_student_form: "student-form",
                request_bus_form: "bus-form",
                request_driver_form: "driver-form",
                request_route_form: "route-form",
              };
              return NextResponse.json({
                ok: true,
                interactionId: interaction.id,
                model: "gemini-4-hydrogen",
                reply: "تفضل بتعبئة البيانات اللازمة في النموذج التفاعلي لاعتماد التسجيل فوراً:",
                interactiveForm: {
                  formType: mapForm[step.name] || "student-form",
                  prefill: step.arguments || {},
                },
              });
            }

            const actionResult = await executeDatabaseMutation(
              tenantSlug,
              step.name,
              (step.arguments as Record<string, unknown>) || {}
            );
            return NextResponse.json({
              ok: true,
              interactionId: interaction.id,
              model: "gemini-4-hydrogen",
              reply: actionResult?.summary,
              actionExecuted: actionResult,
            });
          }
        }

        if (interaction.output_text) {
          return NextResponse.json({
            ok: true,
            interactionId: interaction.id,
            model: "gemini-4-hydrogen",
            reply: interaction.output_text,
          });
        }
      } catch (sdkErr) {
        console.warn("Gemini SDK fallback:", sdkErr);
      }
    }

    // 4. Smart Dynamic Query Answering (if user asks "كم عدد الطالبات؟" or "من السائقين؟" or general questions)
    const tenant = db.tenants.find((t) => t.slug === tenantSlug) || db.tenants[0];
    const students = db.students.filter((s) => s.tenantSlug === tenantSlug);
    const buses = db.buses.filter((b) => b.tenantSlug === tenantSlug);
    const drivers = db.drivers.filter((d) => d.tenantSlug === tenantSlug);

    if (message.includes("كم") || message.includes("احصائيات") || message.includes("تقرير") || message.includes("عدد")) {
      const paidCount = students.filter((s) => s.status === "paid").length;
      const unpaidCount = students.length - paidCount;
      return NextResponse.json({
        ok: true,
        reply: `📊 تقرير حي لمؤسسة «${tenant.name}»:\n• إجمالي الطالبات: ${students.length} طالبة (${paidCount} مسددات، ${unpaidCount} متأخرات).\n• إجمالي الأسطول: ${buses.length} باصات عاملة.\n• السائقون المسجلون: ${drivers.map((d) => d.name).join("، ")}.\n\nهل ترغب في إضافة طالبة جديدة أو باص أو سائق الآن؟`,
      });
    }

    return NextResponse.json({
      ok: true,
      reply: `أهلاً بك! أنا جاهز لتنفيذ أي إجراء تفاعلي في «${tenant.name}». فقط اكتب لي:\n• «أضف طالبة» ⬅️ سأفتح لك بطاقة بيانات الطالبة لتعبئتها وتسجيلها.\n• «أضف باص» ⬅️ سأفتح لك نموذج بيانات الحافلة وبطاقة التشغيل.\n• «أضف سائق» ⬅️ سأفتح لك نموذج بيانات السائق والرخصة.\n• «أضف مسار» ⬅️ لتحديد الأحياء والجامعة والسعر.`,
    });
  } catch (err) {
    console.error("AI Agent error:", err);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء معالجة الطلب" },
      { status: 500 }
    );
  }
}
