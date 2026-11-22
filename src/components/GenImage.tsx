import { useEffect, useRef, useState } from "react";

type GenImageProps = {
  /** file name without extension, e.g. "student-struggle" */
  name: string;
  /** css aspect-ratio, e.g. "4 / 5" */
  ratio: string;
  alt: string;
  className?: string;
  /** shows the file name in the placeholder */
  label?: string;
  priority?: boolean;
};

const EXTENSIONS = ["webp", "png"] as const;

export function GenImage({
  name,
  ratio,
  alt,
  className = "",
  label,
  priority = false,
}: GenImageProps) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const src = attempt < EXTENSIONS.length ? `/assets/generated/${name}.${EXTENSIONS[attempt]}` : null;
  const failed = attempt >= EXTENSIONS.length;

  useEffect(() => {
    setAttempt(0);
    setLoaded(false);
  }, [name]);

  useEffect(() => {
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      {/* branded placeholder, always behind the image */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit] border border-gold/25 bg-gradient-to-br from-[#f4efe2] via-[#fbf7ed] to-[#e8f0ec]">
        <div className="absolute inset-0 grain opacity-60" />
        <svg
          className="absolute -left-10 -top-10 h-64 w-64 text-green/10"
          viewBox="0 0 200 200"
          aria-hidden
        >
          <path
            d="M100 22c-28 0-50 21-50 48 0 34 50 88 50 88s50-54 50-88c0-27-22-48-50-48Z"
            fill="currentColor"
          />
          <path d="M66 40C40 60 36 104 60 132" stroke="#ca9c5e" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 px-5 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-gold/40 bg-white/60 text-gold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <rect x="3.5" y="5" width="17" height="14" rx="3" />
              <circle cx="9" cy="10" r="1.6" />
              <path d="m5 17 4.6-4.2 3.2 2.8 2.6-2.2L20 17" />
            </svg>
          </span>
          <span className="line-clamp-2 text-[15px] font-medium leading-snug text-green/80">{alt}</span>
          <span className="num rounded-full border border-green/10 bg-white/60 px-3 py-1 text-[12px] tracking-wide text-ink-soft" dir="ltr">
            {label ?? `${name}.png`}
          </span>
        </div>
      </div>

      {src && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setAttempt((value) => value + 1);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {failed && <span className="sr-only">الصورة {name} لسه، هيظهر مكانها لما تضيفها</span>}
    </div>
  );
}
