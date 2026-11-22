export const identity = {
  font: {
    name: "Tajawal",
    weights: [
      { label: "REGULAR", value: 400 },
      { label: "Medium", value: 500 },
      { label: "Bold", value: 700 },
    ],
  },
  colors: [
    { hex: "#ca9c5e", name: "ذهبي", text: "#12332d" },
    { hex: "#0f5e58", name: "أخضر غامق", text: "#fdfaf3" },
    { hex: "#374151", name: "رمادي غامق", text: "#fdfaf3" },
    { hex: "#fdfaf3", name: "كريمي", text: "#12332d" },
  ],
  logoIntro:
    "وافد تطبيق يساعد أي طالب على إيجاد سكن طلابي، والشعار يتكوّن من أربعة عناصر، لكل منها معنى مرتبط بالتطبيق.",
  elements: [
    {
      id: "house",
      title: "البيت",
      text: "السكن، وهو الخدمة التي يقدّمها التطبيق",
      icon: "home" as const,
    },
    {
      id: "pin",
      title: "الدبوس",
      text: "علامة الموقع على الخريطة، أي مكان السكن",
      icon: "pin" as const,
    },
    {
      id: "path",
      title: "المسار الذهبي",
      text: "الطريق الخارج من الدبوس، ويدل على الوصول",
      icon: "path" as const,
    },
    {
      id: "waw",
      title: "حرف الواو",
      text: "المساحة داخل الدبوس، وهي أول حرف في «وافد»",
      icon: "waw" as const,
    },
  ],
} as const;
