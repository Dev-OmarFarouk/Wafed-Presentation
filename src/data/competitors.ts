export const features = [
  "البحث المتقدم عن السكن",
  "التحقق من صاحب السكن والعقار",
  "البحث عن شريك سكن",
  "معلومات المواصلات والمسافة للجامعة",
  "خدمات مخصصة لأصحاب السكن",
] as const;

export type BrandId = "wafed" | "casita" | "uhomes" | "sakani";

export const brands: { id: BrandId; name: string; logo: string; note?: string }[] = [
  { id: "wafed", name: "وافد", logo: "/assets/logo.png" },
  { id: "casita", name: "casita", logo: "/assets/brands/casita.png" },
  { id: "uhomes", name: "uhomes", logo: "/assets/brands/uhomes.png" },
  { id: "sakani", name: "سكني", logo: "/assets/brands/sakani.png" },
];

export const matrix: Record<BrandId, boolean[]> = {
  wafed: [true, true, true, true, true],
  casita: [true, true, false, false, false],
  uhomes: [true, true, false, true, false],
  sakani: [true, false, true, false, false],
};
