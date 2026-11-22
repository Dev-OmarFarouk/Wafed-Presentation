export type FlowNodeKind = "start" | "step" | "decision" | "end" | "terminal";

export type FlowNode = {
  id: string;
  label: string;
  kind: FlowNodeKind;
  x: number;
  y: number;
  w?: number;
  h?: number;
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
  tone?: "main" | "yes" | "no" | "loop";
  /** explicit travel lane for branches that must not cross the map */
  route?: "left" | "right";
};

export type Flow = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: "green" | "gold";
  width: number;
  height: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
  /** reveal groups: each step reveals the next group in order */
  groups: string[][];
};

export const entryFlow: Flow = {
  id: "entry",
  eyebrow: "قبل ما نبدأ",
  title: "مسار البداية",
  subtitle: "من أول ما يفتح الموقع لحد ما يعرف هو طالب ولا مالك — وكل خطوة ليها قرارها.",
  accent: "gold",
  width: 1950,
  height: 1780,
  nodes: [
    { id: "e1", label: "فتح الموقع", kind: "start", x: 935, y: 40 },
    { id: "e2", label: "السبلاش", kind: "step", x: 935, y: 170 },
    { id: "e3", label: "الأونبوردنج (٣ شرائح + تخطي)", kind: "step", x: 935, y: 300 },
    { id: "e4", label: "عندك حساب؟", kind: "decision", x: 910, y: 430, h: 200 },
    { id: "e5", label: "تسجيل الدخول (إيميل + باسورد)", kind: "step", x: 935, y: 760 },
    { id: "e6", label: "نسيت الباسورد؟", kind: "decision", x: 910, y: 900, h: 200 },
    { id: "e7", label: "إعادة تعيين الباسورد (رمز + باسورد جديد)", kind: "step", x: 1500, y: 900 },
    { id: "e8", label: "الرئيسية حسب الدور", kind: "step", x: 935, y: 1240 },
    { id: "e15", label: "تصفح بدون حساب", kind: "step", x: 1500, y: 300 },
    { id: "e16", label: "تصفح الشقق (الفلاتر والتفاصيل)", kind: "step", x: 1500, y: 440 },
    { id: "e17", label: "فلو الطالب (يسجل عند أول فعل)", kind: "terminal", x: 1500, y: 580 },
    { id: "e9", label: "بياناتك الأساسية (الاسم والإيميل والموبايل)", kind: "step", x: 255, y: 860 },
    { id: "e10", label: "إنشاء الباسورد", kind: "step", x: 255, y: 1000 },
    { id: "e11", label: "تأكيد الرمز OTP (يوصلك على الإيميل)", kind: "step", x: 255, y: 1140 },
    { id: "e12", label: "طالب أم مالك؟", kind: "decision", x: 230, y: 1280, h: 200 },
    { id: "e13", label: "فلو الطالب", kind: "end", x: 60, y: 1590 },
    { id: "e14", label: "فلو المالك", kind: "end", x: 480, y: 1590 },
  ],
  edges: [
    { from: "e1", to: "e2" },
    { from: "e2", to: "e3" },
    { from: "e3", to: "e4" },
    { from: "e4", to: "e5", label: "نعم", tone: "yes" },
    { from: "e5", to: "e6" },
    { from: "e6", to: "e7", label: "نعم", tone: "yes" },
    { from: "e7", to: "e5", label: "بعد التعيين", tone: "loop" },
    { from: "e6", to: "e8", label: "لا", tone: "no" },
    { from: "e4", to: "e9", label: "لا", tone: "no", route: "left" },
    { from: "e9", to: "e10" },
    { from: "e10", to: "e11" },
    { from: "e11", to: "e12" },
    { from: "e12", to: "e13", label: "طالب", tone: "yes" },
    { from: "e12", to: "e14", label: "مالك", tone: "no" },
    { from: "e3", to: "e15", label: "تخطي", tone: "main" },
    { from: "e15", to: "e16" },
    { from: "e16", to: "e17" },
  ],
  groups: [
    ["e1", "e2", "e3"],
    ["e4"],
    ["e5", "e6"],
    ["e7"],
    ["e8"],
    ["e9", "e10", "e11"],
    ["e12", "e13", "e14"],
    ["e15", "e16", "e17"],
  ],
};

export const studentFlow: Flow = {
  id: "student",
  eyebrow: "رحلة الطالب",
  title: "مسار الطالب",
  subtitle: "من تصفح الشقق لحد الحجز — وكل قرار بيوضّح الخطوة اللي بعده.",
  accent: "green",
  width: 1600,
  height: 2380,
  nodes: [
    { id: "s1", label: "فلو الطالب", kind: "start", x: 585, y: 40 },
    { id: "s2", label: "الشقق + الفلاتر", kind: "step", x: 585, y: 170 },
    { id: "s3", label: "تفاصيل الشقة (مرافق + بروفايل المالك)", kind: "step", x: 585, y: 300 },
    { id: "s4", label: "عندك حساب؟", kind: "decision", x: 560, y: 460, h: 200 },
    { id: "s5", label: "تسجيل سريع", kind: "step", x: 1130, y: 460 },
    { id: "s6", label: "شات مع صاحب السكن", kind: "step", x: 585, y: 800 },
    { id: "s7", label: "اتفقتوا؟", kind: "decision", x: 560, y: 940, h: 200 },
    { id: "s8", label: "موثق كطالب؟", kind: "decision", x: 560, y: 1280, h: 200 },
    { id: "s9", label: "توثيق الكارنيه", kind: "step", x: 1130, y: 1280 },
    { id: "s10", label: "إرسال طلب الحجز (بروفايل + عربون اختياري)", kind: "step", x: 585, y: 1620 },
    { id: "s11", label: "المالك وافق؟", kind: "decision", x: 560, y: 1760, h: 200 },
    { id: "s12", label: "رفض – تصفح غيرها", kind: "terminal", x: 1130, y: 1760 },
    { id: "s13", label: "إتمام الدفع (اختياري: عربون أو كامل)", kind: "step", x: 585, y: 2100 },
    { id: "s14", label: "تم الحجز", kind: "end", x: 585, y: 2240 },
  ],
  edges: [
    { from: "s1", to: "s2" },
    { from: "s2", to: "s3" },
    { from: "s3", to: "s4" },
    { from: "s4", to: "s5", label: "لا", tone: "no" },
    { from: "s5", to: "s6", label: "بعد التسجيل", tone: "loop" },
    { from: "s4", to: "s6", label: "نعم", tone: "yes" },
    { from: "s6", to: "s7" },
    { from: "s7", to: "s2", label: "لا", tone: "no", route: "left" },
    { from: "s7", to: "s8", label: "نعم", tone: "yes" },
    { from: "s8", to: "s9", label: "لا", tone: "no" },
    { from: "s9", to: "s10" },
    { from: "s8", to: "s10", label: "نعم", tone: "yes" },
    { from: "s10", to: "s11" },
    { from: "s11", to: "s12", label: "لا", tone: "no" },
    { from: "s11", to: "s13", label: "نعم", tone: "yes" },
    { from: "s13", to: "s14" },
  ],
  groups: [
    ["s1", "s2"],
    ["s3", "s4"],
    ["s5"],
    ["s6", "s7"],
    ["s8"],
    ["s9"],
    ["s10", "s11"],
    ["s12"],
    ["s13", "s14"],
  ],
};

export const ownerFlow: Flow = {
  id: "owner",
  eyebrow: "رحلة المالك",
  title: "مسار المالك",
  subtitle: "التوثيق، ثم لوحة التحكم: ينشر شقة أو يستقبل طلبات — لحد «تم الحجز».",
  accent: "gold",
  width: 1720,
  height: 1740,
  nodes: [
    { id: "o1", label: "فلو المالك", kind: "start", x: 585, y: 40 },
    { id: "o2", label: "توثيق المالك (هوية + عقد الملكية)", kind: "step", x: 585, y: 170 },
    { id: "o3", label: "الأدمن وافق؟", kind: "decision", x: 560, y: 310, h: 200 },
    { id: "o4", label: "لوحة التحكم (شقق + الطلبات + الشات)", kind: "step", x: 585, y: 650 },
    { id: "o5", label: "إضافة شقة + صور", kind: "step", x: 1200, y: 650 },
    { id: "o6", label: "رفع إثبات المرافق (فواتير أو صور)", kind: "step", x: 1200, y: 790 },
    { id: "o7", label: "الأدمن راجع؟", kind: "decision", x: 1175, y: 930, h: 200 },
    { id: "o8", label: "الشقة منشورة", kind: "step", x: 1200, y: 1270 },
    { id: "o9", label: "طلب حجز جديد (من طالب موثق)", kind: "step", x: 585, y: 800 },
    { id: "o10", label: "شات مع الطالب", kind: "step", x: 585, y: 940 },
    { id: "o11", label: "تقبل الطلب؟", kind: "decision", x: 560, y: 1080, h: 200 },
    { id: "o12", label: "رفض الطلب", kind: "terminal", x: 180, y: 1390 },
    { id: "o13", label: "تأكيد الحجز (استلام العربون أو الدفع)", kind: "step", x: 585, y: 1420 },
    { id: "o14", label: "تم الحجز", kind: "end", x: 585, y: 1580 },
  ],
  edges: [
    { from: "o1", to: "o2" },
    { from: "o2", to: "o3" },
    { from: "o3", to: "o2", label: "لا", tone: "no" },
    { from: "o3", to: "o4", label: "نعم", tone: "yes" },
    { from: "o4", to: "o5", label: "ينشر شقة", tone: "main" },
    { from: "o4", to: "o9", label: "يستقبل طلبات", tone: "main", route: "left" },
    { from: "o5", to: "o6" },
    { from: "o6", to: "o7" },
    { from: "o7", to: "o5", label: "لا", tone: "no", route: "right" },
    { from: "o7", to: "o8", label: "نعم", tone: "yes" },
    { from: "o8", to: "o14", label: "منشورة", tone: "main", route: "left" },
    { from: "o9", to: "o10" },
    { from: "o10", to: "o11" },
    { from: "o11", to: "o12", label: "لا", tone: "no" },
    { from: "o11", to: "o13", label: "نعم", tone: "yes" },
    { from: "o13", to: "o14" },
  ],
  groups: [
    ["o1", "o2"],
    ["o3"],
    ["o4"],
    ["o5", "o6", "o7"],
    ["o8"],
    ["o9", "o10", "o11"],
    ["o12"],
    ["o13"],
    ["o14"],
  ],
};
