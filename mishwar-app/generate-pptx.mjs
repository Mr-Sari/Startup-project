import PptxGenJS from "pptxgenjs";
import path from "path";
import fs from "fs";

async function buildPitchDeck() {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9"; // 10 x 5.625 inches
  pptx.rtlMode = true;
  pptx.author = "Mishwar SaaS";
  pptx.company = "Mishwar - مشوار";
  pptx.title = "العرض الاستثماري - منصة مشوار (Mishwar Pitch Deck)";

  const COLORS = {
    darkNavy: "0F172A",
    slate900: "1E293B",
    emerald: "059669",
    emeraldLight: "D1FAE5",
    amber: "D97706",
    amberLight: "FEF3C7",
    white: "FFFFFF",
    bgLight: "F8FAFC",
    muted: "64748B",
    border: "E2E8F0",
  };

  const FONT = "Arial";

  function addSlideHeader(slide, badgeText, titleText, subtitleText, isDark = false) {
    // Badge pill
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.4,
      y: 0.4,
      w: 2.1,
      h: 0.35,
      fill: { color: isDark ? "1E293B" : COLORS.emeraldLight },
      line: { color: COLORS.emerald, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(badgeText, {
      x: 7.4,
      y: 0.4,
      w: 2.1,
      h: 0.35,
      fontSize: 10,
      bold: true,
      color: isDark ? "34D399" : COLORS.emerald,
      align: "center",
      fontFace: FONT,
      rtlMode: true,
    });

    // Title
    slide.addText(titleText, {
      x: 0.5,
      y: 0.85,
      w: 9.0,
      h: 0.55,
      fontSize: 24,
      bold: true,
      color: isDark ? COLORS.white : COLORS.darkNavy,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });

    if (subtitleText) {
      slide.addText(subtitleText, {
        x: 0.5,
        y: 1.4,
        w: 9.0,
        h: 0.35,
        fontSize: 13,
        color: isDark ? "94A3B8" : COLORS.muted,
        align: "right",
        fontFace: FONT,
        rtlMode: true,
      });
    }
  }

  function addFooter(slide, slideNum, isDark = false) {
    slide.addText(`مِشـوار (Mishwar SaaS) — العرض الاستثماري  |  شريحة ${slideNum} من 12`, {
      x: 0.5,
      y: 5.2,
      w: 9.0,
      h: 0.3,
      fontSize: 9,
      color: isDark ? "64748B" : "94A3B8",
      align: "left",
      fontFace: FONT,
      rtlMode: true,
    });
  }

  // =========================================================================
  // SLIDE 1: COVER SLIDE
  // =========================================================================
  const s1 = pptx.addSlide();
  s1.background = { color: COLORS.darkNavy };

  s1.addShape(pptx.ShapeType.roundRect, {
    x: 6.5,
    y: 0.9,
    w: 3.0,
    h: 0.42,
    fill: { color: "1E293B" },
    line: { color: COLORS.emerald, width: 1 },
    rectRadius: 0.1,
  });
  s1.addText("B2B Vertical SaaS • السعودية", {
    x: 6.5,
    y: 0.9,
    w: 3.0,
    h: 0.42,
    fontSize: 11,
    bold: true,
    color: "34D399",
    align: "center",
    fontFace: FONT,
    rtlMode: true,
  });

  s1.addText("مِشـوار | Mishwar", {
    x: 0.5,
    y: 1.6,
    w: 9.0,
    h: 0.9,
    fontSize: 44,
    bold: true,
    color: COLORS.white,
    align: "right",
    fontFace: FONT,
    rtlMode: true,
  });

  s1.addText("نظام التشغيل السحابي المستقل لمؤسسات النقل الجامعي والمدرسي المرخصة في السعودية", {
    x: 0.5,
    y: 2.55,
    w: 9.0,
    h: 0.6,
    fontSize: 20,
    bold: true,
    color: "34D399",
    align: "right",
    fontFace: FONT,
    rtlMode: true,
  });

  s1.addText(
    "كل مؤسسة نقل تأخذ موقعها الخاص باسمها وهويتها ورقمها الضريبي، وتدير منه باصاتها واشتراكات الطالبات وسائقيها — بدون وسطاء وبدون أي عمولة على مقاعدها.",
    {
      x: 1.0,
      y: 3.3,
      w: 8.5,
      h: 0.8,
      fontSize: 14,
      color: "CBD5E1",
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    }
  );

  // Bottom stat pills
  const s1Pills = [
    { label: "0% عمولة على المقاعد", x: 6.7 },
    { label: "فوترة ضريبية ZATCA", x: 3.6 },
    { label: "تجربة مجانية 14 يوم", x: 0.5 },
  ];
  s1Pills.forEach((p) => {
    s1.addShape(pptx.ShapeType.roundRect, {
      x: p.x,
      y: 4.4,
      w: 2.8,
      h: 0.5,
      fill: { color: "1E293B" },
      line: { color: "334155", width: 1 },
      rectRadius: 0.08,
    });
    s1.addText(p.label, {
      x: p.x,
      y: 4.4,
      w: 2.8,
      h: 0.5,
      fontSize: 12,
      bold: true,
      color: COLORS.white,
      align: "center",
      fontFace: FONT,
      rtlMode: true,
    });
  });

  // =========================================================================
  // SLIDE 2: THE PROBLEM
  // =========================================================================
  const s2 = pptx.addSlide();
  s2.background = { color: COLORS.bgLight };
  addSlideHeader(
    s2,
    "1. المشكلة في السوق",
    "3,500+ مؤسسة نقل تدير ملايين الريالات بـ «الإكسل والواتساب»",
    "فوضى التحصيل اليدوي، غرامات هيئة النقل، ورفض المؤسسات لدفع عمولات للتطبيقات الوسيطة"
  );

  const problems = [
    {
      title: "1. نزيف مالي وتأخر تحصيل (18% تسرب)",
      desc: "متابعة التحويلات البنكية وإيصالات الواتساب لمئات الطالبات يدوياً يؤدي لركوب طالبات غير مسددات وتراكم الديون.",
      x: 5.1,
      y: 2.0,
    },
    {
      title: "2. غرامات هيئة النقل المفاجئة (5,000 ر.س)",
      desc: "نسيان موعد انتهاء بطاقة تشغيل حافلة واحدة أو رخصة سائق يكبد المؤسسة غرامات فورية وإيقاف خدمات.",
      x: 0.5,
      y: 2.0,
    },
    {
      title: "3. قلق أولياء الأمور واتصالات الصباح",
      desc: "عشرات الاتصالات يومياً على السائق والمشرف للسؤال: «وصل الباص؟ بنتي ركبت؟» لعدم وجود إشعار صعود فوري.",
      x: 5.1,
      y: 3.55,
    },
    {
      title: "4. رفض التطبيقات التجميعية (Marketplaces)",
      desc: "المؤسسات ترفض التطبيقات الوسيطة لأنها تقتطع 15%-20% عمولة وتعرض المؤسسة بجانب منافسيها في شاشة واحدة!",
      x: 0.5,
      y: 3.55,
    },
  ];

  problems.forEach((p) => {
    s2.addShape(pptx.ShapeType.roundRect, {
      x: p.x,
      y: p.y,
      w: 4.4,
      h: 1.35,
      fill: { color: COLORS.white },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    s2.addText(p.title, {
      x: p.x + 0.2,
      y: p.y + 0.15,
      w: 4.0,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: "B91C1C",
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s2.addText(p.desc, {
      x: p.x + 0.2,
      y: p.y + 0.52,
      w: 4.0,
      h: 0.7,
      fontSize: 11,
      color: COLORS.slate900,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
  });
  addFooter(s2, 2);

  // =========================================================================
  // SLIDE 3: THE SOLUTION
  // =========================================================================
  const s3 = pptx.addSlide();
  s3.background = { color: COLORS.bgLight };
  addSlideHeader(
    s3,
    "2. الحل — مشوار",
    "موقع خاص ونظام تشغيل متكامل لكل مؤسسة في 3 دقائق",
    "استقلالية تامة للمؤسسة بهويتها ورقمها الضريبي وواتسابها الخاص وبدون أي عمولة"
  );

  const solutions = [
    {
      title: "موقع مستقل باسم المؤسسة (mishwar.sa/slug)",
      desc: "الطالبات يصلن للمؤسسة من رابطها أو رمز QR أو الواتساب دون عرض أي منافس بجانبها.",
      x: 5.1,
      y: 2.0,
    },
    {
      title: "تحصيل إلكتروني وإيقاف تلقائي للمتأخرات",
      desc: "دفع عبر مدى وApple Pay، مع تذكير واتساب آلي وإيقاف تلقائي لمقعد من لم تدفع من كشف السائق.",
      x: 0.5,
      y: 2.0,
    },
    {
      title: "تأشير السائق («ركبت» / «ما ركبت»)",
      desc: "واجهة جوال فائقة البساطة للسائق بزرين فقط ترسل تنبيه واتساب فوري لولي الأمر بالوقت.",
      x: 5.1,
      y: 3.55,
    },
    {
      title: "تنبيهات الرخص + فوترة ضريبية ZATCA",
      desc: "تنبيه قبل انتهاء رخص السائقين وبطاقات التشغيل، وإصدار فاتورة ضريبية بباركود ZATCA باسم المؤسسة.",
      x: 0.5,
      y: 3.55,
    },
  ];

  solutions.forEach((sol) => {
    s3.addShape(pptx.ShapeType.roundRect, {
      x: sol.x,
      y: sol.y,
      w: 4.4,
      h: 1.35,
      fill: { color: COLORS.white },
      line: { color: COLORS.emerald, width: 1.2 },
      rectRadius: 0.08,
    });
    s3.addText(sol.title, {
      x: sol.x + 0.2,
      y: sol.y + 0.15,
      w: 4.0,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: COLORS.emerald,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s3.addText(sol.desc, {
      x: sol.x + 0.2,
      y: sol.y + 0.52,
      w: 4.0,
      h: 0.7,
      fontSize: 11,
      color: COLORS.slate900,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
  });
  addFooter(s3, 3);

  // =========================================================================
  // SLIDE 4: HOW IT WORKS (3-STEP ECOSYSTEM)
  // =========================================================================
  const s4 = pptx.addSlide();
  s4.background = { color: COLORS.bgLight };
  addSlideHeader(
    s4,
    "3. كيف يشتغل النظام؟",
    "منظومة مترابطة لحظياً بين الإدارة والطالبة والسائق",
    "تزامن فوري للبيانات والفواتير وحالات الركوب"
  );

  const steps = [
    {
      num: "1",
      title: "صاحب المؤسسة يسجل ويضبط هويته",
      desc: "يدخل الاسم، الرقم الضريبي، رقم الواتساب، وترخيص هيئة النقل، ويختار عنوانه (mishwar.sa/darb-alaman).",
      x: 6.6,
    },
    {
      num: "2",
      title: "الطالبة تحجز وتدفع اشتراكها",
      desc: "تدخل من رابط المؤسسة أو QR، تسجل بجوالها، تختار الحي والجامعة، وتدفع بمدى أو Apple Pay وتستلم فاتورة ZATCA.",
      x: 3.55,
    },
    {
      num: "3",
      title: "السائق يؤشر وولي الأمر يتطمن",
      desc: "تظهر الطالبات المسددات فقط في شاشة السائق، يضغط «ركبت» فيصل تنبيه واتساب فوري لولي الأمر.",
      x: 0.5,
    },
  ];

  steps.forEach((st) => {
    s4.addShape(pptx.ShapeType.roundRect, {
      x: st.x,
      y: 2.05,
      w: 2.9,
      h: 2.8,
      fill: { color: COLORS.white },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    s4.addShape(pptx.ShapeType.ellipse, {
      x: st.x + 2.1,
      y: 2.25,
      w: 0.55,
      h: 0.55,
      fill: { color: COLORS.darkNavy },
    });
    s4.addText(st.num, {
      x: st.x + 2.1,
      y: 2.25,
      w: 0.55,
      h: 0.55,
      fontSize: 16,
      bold: true,
      color: COLORS.white,
      align: "center",
      fontFace: FONT,
    });
    s4.addText(st.title, {
      x: st.x + 0.2,
      y: 2.95,
      w: 2.5,
      h: 0.5,
      fontSize: 13,
      bold: true,
      color: COLORS.darkNavy,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s4.addText(st.desc, {
      x: st.x + 0.2,
      y: 3.5,
      w: 2.5,
      h: 1.1,
      fontSize: 11,
      color: COLORS.muted,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
  });
  addFooter(s4, 4);

  // =========================================================================
  // SLIDE 5: WHY NOW (MARKET TIMING)
  // =========================================================================
  const s5 = pptx.addSlide();
  s5.background = { color: COLORS.bgLight };
  addSlideHeader(
    s5,
    "4. لماذا الآن؟",
    "تحولات تنظيمية ورقمية في السعودية تجعل «مشوار» ضرورة حتمية",
    "تقاطع مثالي بين إلزامية الفوترة الإلكترونية واشتراطات هيئة النقل"
  );

  const tailwinds = [
    {
      title: "إلزامية الفوترة الإلكترونية (ZATCA)",
      desc: "مؤسسات النقل ملزمة نظامياً بإصدار فواتير ضريبية إلكترونية برمز QR مشفر لكل اشتراك طالبة بدلاً من السندات الورقية.",
      y: 2.0,
    },
    {
      title: "رقابة الهيئة العامة للنقل (TGA)",
      desc: "تشديد الرقابة والغرامات الآلية على انتهاء بطاقات تشغيل الحافلات ورخص القيادة المهنية للسائقين.",
      y: 3.05,
    },
    {
      title: "أكثر من 700,000 طالبة جامعية",
      desc: "توسع الجامعات والكليات في مدن المملكة واعتماد شريحة واسعة من الطالبات على اشتراكات النقل الشهري والفصلي.",
      y: 4.1,
    },
  ];

  tailwinds.forEach((tw) => {
    s5.addShape(pptx.ShapeType.roundRect, {
      x: 0.5,
      y: tw.y,
      w: 9.0,
      h: 0.9,
      fill: { color: COLORS.white },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    s5.addText(tw.title, {
      x: 6.2,
      y: tw.y + 0.15,
      w: 3.1,
      h: 0.6,
      fontSize: 13,
      bold: true,
      color: COLORS.darkNavy,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s5.addText(tw.desc, {
      x: 0.7,
      y: tw.y + 0.15,
      w: 5.3,
      h: 0.6,
      fontSize: 11,
      color: COLORS.muted,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
  });
  addFooter(s5, 5);

  // =========================================================================
  // SLIDE 6: MARKET SIZE (TAM / SAM / SOM)
  // =========================================================================
  const s6 = pptx.addSlide();
  s6.background = { color: COLORS.bgLight };
  addSlideHeader(
    s6,
    "5. حجم السوق",
    "حجم سوق النقل التعليمي وبرمجيات إدارته (TAM / SAM / SOM)",
    "تقديرات مبنية من القاعدة للقمة (Bottom-Up) للسوق السعودي والخليجي"
  );

  const markets = [
    {
      tag: "TAM — السوق الكلي",
      val: "4.2 مليار ر.س",
      desc: "إجمالي إنفاق قطاع النقل التعليمي والجامعي الخاص في السعودية ودول الخليج سنوياً.",
      x: 6.6,
      color: COLORS.darkNavy,
    },
    {
      tag: "SAM — السوق المتاح للخدمة",
      val: "180 مليون ر.س",
      desc: "~15,000 منشأة ومشغل نقل تعليمي وجامعي ومدرسي × متوسط إنفاق برمجي 12,000 ر.س سنوياً.",
      x: 3.55,
      color: COLORS.slate900,
    },
    {
      tag: "SOM — الحصة المستهدفة (3 سنوات)",
      val: "5.0 مليون ر.س ARR",
      desc: "استقطاب 550 مؤسسة نقل مرخصة في المدن الرئيسية (الرياض، جدة، مكة، الشرقية، القصيم).",
      x: 0.5,
      color: COLORS.emerald,
    },
  ];

  markets.forEach((m) => {
    s6.addShape(pptx.ShapeType.roundRect, {
      x: m.x,
      y: 2.1,
      w: 2.9,
      h: 2.7,
      fill: { color: m.color },
      rectRadius: 0.12,
    });
    s6.addText(m.tag, {
      x: m.x + 0.2,
      y: 2.35,
      w: 2.5,
      h: 0.35,
      fontSize: 11,
      bold: true,
      color: "A7F3D0",
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s6.addText(m.val, {
      x: m.x + 0.2,
      y: 2.8,
      w: 2.5,
      h: 0.65,
      fontSize: 22,
      bold: true,
      color: COLORS.white,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s6.addText(m.desc, {
      x: m.x + 0.2,
      y: 3.55,
      w: 2.5,
      h: 1.0,
      fontSize: 11,
      color: "E2E8F0",
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
  });
  addFooter(s6, 6);

  // =========================================================================
  // SLIDE 7: BUSINESS MODEL & PRICING TIERS
  // =========================================================================
  const s7 = pptx.addSlide();
  s7.background = { color: COLORS.bgLight };
  addSlideHeader(
    s7,
    "6. نموذج العمل والباقات",
    "اشتراك شهري ثابت (SaaS) • تجربة مجانية 14 يوم • 0% عمولة",
    "الدخل: اشتراك شهري تدفعه المؤسسة حسب باقتها، وكامل إيرادات الطالبات تذهب للمؤسسة"
  );

  const plans = [
    {
      name: "Basic — التشغيل الأساسي",
      price: "399 ر.س / شهرياً",
      features: "• موقع خاص بهوية المؤسسة\n• طلبات واشتراكات وتحصيل\n• إيقاف تلقائي لمن لم تدفع\n• شاشة السائق وتنبيهات الرخص",
      x: 6.6,
      highlight: false,
    },
    {
      name: "Pro — الأكثر طلباً",
      price: "899 ر.س / شهرياً",
      features: "• كل مميزات باقة Basic\n• إدارة المسارات والأحياء المتعددة\n• صلاحيات فريق العمل والمحاسب\n• فواتير ضريبية ZATCA وتقارير\n• مساعد مشوار الذكي (AI Copilot)",
      x: 3.55,
      highlight: true,
    },
    {
      name: "Enterprise — الشركات",
      price: "بعرض سعر مخصص",
      features: "• بدون حد لعدد الباصات\n• ربط مباشر ببوابة دفع الشركة\n• نطاق خاص كامل (Custom Domain)\n• مدير حساب ودعم مخصص",
      x: 0.5,
      highlight: false,
    },
  ];

  plans.forEach((pl) => {
    s7.addShape(pptx.ShapeType.roundRect, {
      x: pl.x,
      y: 2.05,
      w: 2.9,
      h: 2.85,
      fill: { color: COLORS.white },
      line: { color: pl.highlight ? COLORS.emerald : COLORS.border, width: pl.highlight ? 2.2 : 1 },
      rectRadius: 0.1,
    });
    s7.addText(pl.name, {
      x: pl.x + 0.2,
      y: 2.2,
      w: 2.5,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: COLORS.darkNavy,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s7.addText(pl.price, {
      x: pl.x + 0.2,
      y: 2.6,
      w: 2.5,
      h: 0.45,
      fontSize: 18,
      bold: true,
      color: COLORS.emerald,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s7.addText(pl.features, {
      x: pl.x + 0.2,
      y: 3.15,
      w: 2.5,
      h: 1.6,
      fontSize: 10.5,
      color: COLORS.slate900,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
  });
  addFooter(s7, 7);

  // =========================================================================
  // SLIDE 8: FINANCIAL PROJECTIONS & UNIT ECONOMICS
  // =========================================================================
  const s8 = pptx.addSlide();
  s8.background = { color: COLORS.bgLight };
  addSlideHeader(
    s8,
    "7. التوقعات المالية واقتصاديات الوحدة",
    "نموذج ربحي عالي الهامش (91% Gross Margin) واسترداد CAC في 1.3 شهر",
    "توقعات النمو على مدار 3 سنوات في السوق السعودي"
  );

  const finTable = [
    [
      { text: "صافي الربح (EBITDA)", options: { bold: true, fill: COLORS.darkNavy, color: COLORS.white } },
      { text: "الإيراد السنوي (ARR)", options: { bold: true, fill: COLORS.darkNavy, color: COLORS.white } },
      { text: "الإيراد الشهري (MRR)", options: { bold: true, fill: COLORS.darkNavy, color: COLORS.white } },
      { text: "الحافلات المدارة", options: { bold: true, fill: COLORS.darkNavy, color: COLORS.white } },
      { text: "المؤسسات المشتركة", options: { bold: true, fill: COLORS.darkNavy, color: COLORS.white } },
      { text: "الفترة", options: { bold: true, fill: COLORS.darkNavy, color: COLORS.white } },
    ],
    ["+260,000 ر.س", "540,000 ر.س", "45,000 ر.س", "480 حافلة", "60 مؤسسة", "السنة الأولى"],
    ["+1,260,000 ر.س", "1,980,000 ر.س", "165,000 ر.س", "1,980 حافلة", "220 مؤسسة", "السنة الثانية"],
    ["+3,500,000 ر.س", "4,950,000 ر.س", "412,500 ر.س", "5,500 حافلة", "550 مؤسسة", "السنة الثالثة"],
  ];

  s8.addTable(finTable, {
    x: 0.5,
    y: 2.1,
    w: 9.0,
    rowH: 0.55,
    fontSize: 12,
    fontFace: FONT,
    align: "center",
    valign: "middle",
    border: { pt: 1, color: COLORS.border },
    fill: { color: COLORS.white },
  });

  s8.addText(
    "• متوسط العائد من المؤسسة (ARPU): 750 ر.س/شهرياً   |   • تكلفة الاستحواذ (CAC): 900 ر.س   |   • القيمة الدائمة (LTV): 24,600 ر.س (27x LTV/CAC)",
    {
      x: 0.5,
      y: 4.5,
      w: 9.0,
      h: 0.4,
      fontSize: 11,
      bold: true,
      color: COLORS.emerald,
      align: "center",
      fontFace: FONT,
      rtlMode: true,
    }
  );
  addFooter(s8, 8);

  // =========================================================================
  // SLIDE 9: COMPETITIVE MATRIX
  // =========================================================================
  const s9 = pptx.addSlide();
  s9.background = { color: COLORS.bgLight };
  addSlideHeader(
    s9,
    "8. الميزة التنافسية",
    "لماذا تختار مؤسسات النقل «مشوار» بدلاً من البدائل؟",
    "نحن الشريك التقني للمؤسسة ولسنا وسيطاً ينافسها أو يقتطع من أرباحها"
  );

  const compRows = [
    [
      { text: "مِشـوار (Mishwar)", options: { bold: true, fill: COLORS.emerald, color: COLORS.white } },
      { text: "الإكسل والواتساب", options: { bold: true, fill: COLORS.darkNavy, color: COLORS.white } },
      { text: "أنظمة GPS التقليدية", options: { bold: true, fill: COLORS.darkNavy, color: COLORS.white } },
      { text: "التطبيقات الوسيطة", options: { bold: true, fill: COLORS.darkNavy, color: COLORS.white } },
      { text: "وجه المقارنة", options: { bold: true, fill: COLORS.darkNavy, color: COLORS.white } },
    ],
    ["موقع خاص (mishwar.sa/slug)", "لا يوجد", "لا يوجد", "يعرض المنافسين معاً", "استقلالية وهوية المؤسسة"],
    ["0% عمولة (اشتراك ثابت)", "0%", "أجهزة مكلفة", "15% - 20% عمولة", "العمولة على المقاعد"],
    ["آلي من شاشة السائق", "يدوي ومربك", "غير متوفر", "غير متوفر", "إيقاف من لم تدفع"],
    ["مدمج برقم المؤسسة الضريبي", "يدوي", "غير متوفر", "باسم الوسيط", "فواتير ZATCA وتنبيه الرخص"],
  ];

  s9.addTable(compRows, {
    x: 0.5,
    y: 2.05,
    w: 9.0,
    rowH: 0.52,
    fontSize: 11,
    fontFace: FONT,
    align: "center",
    valign: "middle",
    border: { pt: 1, color: COLORS.border },
    fill: { color: COLORS.white },
  });
  addFooter(s9, 9);

  // =========================================================================
  // SLIDE 10: GO-TO-MARKET STRATEGY
  // =========================================================================
  const s10 = pptx.addSlide();
  s10.background = { color: COLORS.bgLight };
  addSlideHeader(
    s10,
    "9. خطة الاستحواذ والنمو (GTM)",
    "كيف نستقطب أول 100 مؤسسة نقل مرخصة؟",
    "قنوات استحواذ مباشرة منخفضة التكلفة وعالية التحويل"
  );

  const gtmSteps = [
    {
      title: "1. المبيعات المباشرة حول الجامعات الكبرى",
      desc: "استهداف مكاتب ومؤسسات النقل العاملة في جامعة الأميرة نورة، الملك سعود، الإمام، الملك عبدالعزيز، وأم القرى وتفعيل تجربة 14 يوم مجانية في نفس المكالمة.",
      y: 2.0,
    },
    {
      title: "2. الانتشار الفيروسي عبر إشعارات أولياء الأمور",
      desc: "كل رسالة واتساب يومية تصل لولي الأمر عند ركوب ابنته تحمل توقيع المنصة، مما يحفز أولياء الأمور ومشرفي النقل في الجامعات الأخرى لطلب النظام.",
      y: 3.05,
    },
    {
      title: "3. شراكات معارض ووكالات الحافلات",
      desc: "تقديم باقة اشتراك مجانية لمدة 3 أشهر بالتعاون مع موردي الحافلات (مرسيدس سبرنتر وتويوتا كوستر) لكل مؤسسة تشتري حافلة جديدة.",
      y: 4.1,
    },
  ];

  gtmSteps.forEach((g) => {
    s10.addShape(pptx.ShapeType.roundRect, {
      x: 0.5,
      y: g.y,
      w: 9.0,
      h: 0.9,
      fill: { color: COLORS.white },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    s10.addText(g.title, {
      x: 5.8,
      y: g.y + 0.15,
      w: 3.5,
      h: 0.6,
      fontSize: 12.5,
      bold: true,
      color: COLORS.darkNavy,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s10.addText(g.desc, {
      x: 0.7,
      y: g.y + 0.15,
      w: 4.9,
      h: 0.6,
      fontSize: 10.5,
      color: COLORS.muted,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
  });
  addFooter(s10, 10);

  // =========================================================================
  // SLIDE 11: TRACTION & PRODUCT READINESS
  // =========================================================================
  const s11 = pptx.addSlide();
  s11.background = { color: COLORS.bgLight };
  addSlideHeader(
    s11,
    "10. الجاهزية والإنجاز التقني",
    "منتج حي متكامل (Full-Stack MVP) جاهز للإطلاق الفوري",
    "تم بناء واختبار كامل المنظومة بنجاح"
  );

  const milestones = [
    {
      title: "✓ بوابة تأسيس المؤسسات (/register-tenant)",
      desc: "تسجيل المؤسسة وإعداد الرقم الضريبي، رقم الواتساب، السجل التجاري، وترخيص هيئة النقل في دقيقتين.",
      x: 5.1,
      y: 2.0,
    },
    {
      title: "✓ موقع حجز الطالبة وفاتورة ZATCA (/[slug])",
      desc: "حجز المقعد، دفع مدى وApple Pay، وتوليد فاتورة ضريبية مبسطة بباركود ZATCA TLV Base64 قابل للمسح.",
      x: 0.5,
      y: 2.0,
    },
    {
      title: "✓ داشبورد المؤسسة + المساعد الذكي (/dashboard)",
      desc: "إدارة الاشتراكات، الباصات، السائقين، المسارات، تنبيهات الرخص، ومساعد AI تشغيلي (Generative UI).",
      x: 5.1,
      y: 3.55,
    },
    {
      title: "✓ شاشة السائق الميدانية (/driver)",
      desc: "تأشير «ركبت / ما ركبت» بلمسة زر مع إشعار واتساب فوري لولي الأمر وحجب آلي لمن لم تسدد.",
      x: 0.5,
      y: 3.55,
    },
  ];

  milestones.forEach((ms) => {
    s11.addShape(pptx.ShapeType.roundRect, {
      x: ms.x,
      y: ms.y,
      w: 4.4,
      h: 1.35,
      fill: { color: COLORS.white },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    s11.addText(ms.title, {
      x: ms.x + 0.2,
      y: ms.y + 0.15,
      w: 4.0,
      h: 0.35,
      fontSize: 12.5,
      bold: true,
      color: COLORS.emerald,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s11.addText(ms.desc, {
      x: ms.x + 0.2,
      y: ms.y + 0.52,
      w: 4.0,
      h: 0.7,
      fontSize: 10.5,
      color: COLORS.slate900,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
  });
  addFooter(s11, 11);

  // =========================================================================
  // SLIDE 12: THE ASK & USE OF FUNDS
  // =========================================================================
  const s12 = pptx.addSlide();
  s12.background = { color: COLORS.darkNavy };
  addSlideHeader(
    s12,
    "11. الجولة الاستثمارية (The Ask)",
    "جولة Pre-Seed بقيمة 750,000 ر.س (200,000 دولار)",
    "للوصول إلى 100 مؤسسة نقل مشتركة و ~900,000 ر.س إيراد سنوي متكرر (ARR) خلال 12 شهراً",
    true
  );

  const allocations = [
    {
      pct: "40%",
      amount: "300,000 ر.س",
      title: "المبيعات وتطوير الأعمال",
      desc: "التوسع الميداني في الرياض، جدة، مكة، والشرقية واستقطاب أول 100 مؤسسة نقل.",
      x: 6.6,
    },
    {
      pct: "35%",
      amount: "262,500 ر.س",
      title: "التطوير التقني والربط",
      desc: "الربط المباشر مع بوابات الدفع، WhatsApp Business API، ومنصة وصل.",
      x: 3.55,
    },
    {
      pct: "25%",
      amount: "187,500 ر.س",
      title: "العمليات والتسويق والدعم",
      desc: "حملات بداية الفصول الدراسية وخدمة نجاح العملاء (Customer Success).",
      x: 0.5,
    },
  ];

  allocations.forEach((al) => {
    s12.addShape(pptx.ShapeType.roundRect, {
      x: al.x,
      y: 2.15,
      w: 2.9,
      h: 2.65,
      fill: { color: "1E293B" },
      line: { color: COLORS.emerald, width: 1.2 },
      rectRadius: 0.1,
    });
    s12.addText(`${al.pct} (${al.amount})`, {
      x: al.x + 0.2,
      y: 2.35,
      w: 2.5,
      h: 0.45,
      fontSize: 17,
      bold: true,
      color: "34D399",
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s12.addText(al.title, {
      x: al.x + 0.2,
      y: 2.9,
      w: 2.5,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: COLORS.white,
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
    s12.addText(al.desc, {
      x: al.x + 0.2,
      y: 3.4,
      w: 2.5,
      h: 1.1,
      fontSize: 11,
      color: "CBD5E1",
      align: "right",
      fontFace: FONT,
      rtlMode: true,
    });
  });
  addFooter(s12, 12, true);

  // Save to root workspace & public folder for direct download
  const rootOut = path.resolve("..", "Mishwar-Pitch-Deck.pptx");
  const publicDir = path.resolve("public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicOut = path.resolve("public", "Mishwar-Pitch-Deck.pptx");

  await pptx.writeFile({ fileName: rootOut });
  await pptx.writeFile({ fileName: publicOut });

  console.log("Successfully generated PowerPoint files:");
  console.log("1.", rootOut);
  console.log("2.", publicOut);
}

buildPitchDeck().catch((err) => {
  console.error(err);
  process.exit(1);
});
