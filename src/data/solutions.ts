export type Solution = {
  id: string;
  title: string;
  text: string;
  /** file name inside /assets/generated (drop the .png yourself) */
  image: string;
};

export const solutions: Solution[] = [
  {
    id: "roommate",
    title: "زميل سكن مناسب",
    text: "بنوصّل الطالب بزميل سكن متوافق مع احتياجاته وتفضيلاته، بدل ما يدور في جروبات كتير.",
    image: "solution-roommate",
  },
  {
    id: "manage",
    title: "إدارة العقارات",
    text: "صاحب السكن يضيف ويعدّل عقاراته، ويدير بياناته وطلبات التواصل من مكان واحد.",
    image: "solution-manage",
  },
  {
    id: "filters",
    title: "بحث بفلاتر",
    text: "السعر، والموقع، والجامعة، والمرافق — الطالب يفلتر ويوصل للسكن اللي يناسبه.",
    image: "solution-filters",
  },
  {
    id: "verify",
    title: "توثيق وثقة",
    text: "بنوثّق أصحاب السكن والعقارات، عشان نقلل مخاطر الإعلانات غير الموثوقة.",
    image: "solution-verify",
  },
  {
    id: "chat",
    title: "محادثة مباشرة",
    text: "تواصل مباشر بين الطالب وصاحب السكن، من غير وسطاء ومن غير لف ودوران.",
    image: "solution-chat",
  },
  {
    id: "transport",
    title: "الموقع والمواصلات",
    text: "موقع السكن، والمسافة، وطريق الوصول للجامعة — كله واضح قبل ما تقرر.",
    image: "solution-transport",
  },
];

export type Feature = {
  id: string;
  title: string;
  note: string;
  icon: "search" | "shield" | "users" | "bus" | "building";
};

export const features: Feature[] = [
  {
    id: "search",
    title: "البحث المتقدم عن السكن",
    note: "فلاتر للسعر والموقع والجامعة والمرافق.",
    icon: "search",
  },
  {
    id: "verify",
    title: "التحقق من صاحب السكن والعقار",
    note: "توثيق للطرفين قبل أي تعامل.",
    icon: "shield",
  },
  {
    id: "roommate",
    title: "البحث عن شريك سكن",
    note: "تطابق حسب الميزانية ونمط الحياة.",
    icon: "users",
  },
  {
    id: "transport",
    title: "معلومات المواصلات والمسافة للجامعة",
    note: "المسافة وطريق الوصول واضحين.",
    icon: "bus",
  },
  {
    id: "owner",
    title: "خدمات مخصصة لأصحاب السكن",
    note: "إعلانات وطلبات وتواصل في مكان واحد.",
    icon: "building",
  },
];
