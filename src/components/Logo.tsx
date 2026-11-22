export function LogoImage({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src="/assets/logo.png"
      alt="وافد"
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`select-none object-contain ${className}`}
    />
  );
}

/** Simplified vector mark: pin + house + gold travel path. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 300" fill="none" className={className} aria-hidden>
      <path
        d="M110 8C55 8 12 51 12 105c0 62 68 130 98 178 30-48 98-116 98-178C208 51 165 8 110 8Z"
        fill="#0f5e58"
      />
      <circle cx="110" cy="104" r="62" fill="#fdfaf3" />
      <path
        d="M110 46c-7 0-13 3-18 8l-32 31c-4 4-1 11 5 11h10v34c0 4 3 7 7 7h56c4 0 7-3 7-7v-34h10c6 0 9-7 5-11l-32-31c-5-5-11-8-18-8Z"
        fill="#ca9c5e"
      />
      <path
        d="M72 175c34 26 78 6 98-40 12-27 7-47-6-48-10-1-19 12-27 30-13 30-38 47-65 58Z"
        fill="#ca9c5e"
        opacity="0.92"
      />
      <rect x="88" y="118" width="20" height="26" rx="3" fill="#0f5e58" opacity="0.14" />
    </svg>
  );
}
