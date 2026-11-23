import { useState } from "react";

type GenImageProps = {
  /** file name without extension, e.g. "student-struggle" */
  name: string;
  /** css aspect-ratio, e.g. "4 / 5" */
  ratio: string;
  alt: string;
  className?: string;
  /** kept for callers; the filename label is never rendered */
  label?: string;
  priority?: boolean;
};

const EXTENSIONS = ["webp", "png", "jpg"] as const;

/**
 * Images are preloaded and decoded by Boot before the deck mounts, so there is
 * no loading placeholder here at all: the frame stays a plain cream surface
 * until the cached image paints, and a missing file simply stays empty.
 */
export function GenImage({
  name,
  ratio,
  alt,
  className = "",
}: GenImageProps) {
  const [attempt, setAttempt] = useState(0);
  const src = attempt < EXTENSIONS.length ? `/assets/generated/${name}.${EXTENSIONS[attempt]}` : null;

  return (
    <div
      className={`relative overflow-hidden bg-[#f4efe2] ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          draggable={false}
          onError={() => setAttempt((value) => value + 1)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
