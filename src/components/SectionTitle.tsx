export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "right",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "right" | "center";
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "items-center text-center" : "items-start text-right"} flex flex-col gap-4 ${className}`}
    >
      {eyebrow && (
        <span className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {eyebrow}
        </span>
      )}
      <h2 className={`${align === "center" ? "title-lg" : "title-lg"} text-balance`}>{title}</h2>
      {subtitle && <p className={`${align === "center" ? "max-w-[1100px]" : "max-w-[980px]"} lead`}>{subtitle}</p>}
    </div>
  );
}
