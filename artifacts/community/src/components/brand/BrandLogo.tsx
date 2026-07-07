import { cn } from "@/lib/utils";

/**
 * Crisp, theme-appropriate VectorVest mark rendered as inline SVG so it reads
 * cleanly on the dark navy surfaces everywhere in the app — unlike the raster
 * navy-on-transparent wordmark, which disappears against the navy background.
 */
export function LogoMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} role="img" aria-label="VectorVest">
      <defs>
        <linearGradient id="vv-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ecd69b" />
          <stop offset="0.5" stopColor="#cda35d" />
          <stop offset="1" stopColor="#b5883c" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="#1b2157" />
      {/* gold triangle, lower-left */}
      <polygon points="12,56 44,56 12,88" fill="url(#vv-gold)" />
      {/* white diagonal band */}
      <polygon points="8,30 30,8 92,70 70,92" fill="#f7f8fc" />
    </svg>
  );
}

const MARK_SIZES = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
} as const;

const WORDMARK_SIZES = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
  xl: "text-4xl",
} as const;

export function BrandLogo({
  size = "md",
  showWordmark = true,
  tagline,
  className,
}: {
  size?: keyof typeof MARK_SIZES;
  showWordmark?: boolean;
  tagline?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark className={cn(MARK_SIZES[size], "shrink-0 drop-shadow-sm")} />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display font-bold tracking-tight text-foreground",
              WORDMARK_SIZES[size],
            )}
          >
            VectorVest
          </span>
          {tagline && (
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
