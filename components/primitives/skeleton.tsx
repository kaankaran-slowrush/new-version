import * as React from "react";
import { cn } from "@/lib/cn";

/* =============================================================================
   Skeleton
   =============================================================================
   UX NOTES
   --------
   • A skeleton must match the SHAPE AND SIZE of what replaces it, or the page
     reflows the moment data lands — which is worse than a brief blank, because
     the user has already started reading and moving their cursor.
   • Use skeletons only where the layout is predictable (a known list of rows, a
     known card). For unpredictable content, prefer an honest progress state.
   • Motion self-gates: the shimmer lives inside `prefers-reduced-motion:
     no-preference` via `.anim-sheen`. With motion reduced, this stays a static
     block — still communicating "content pending" through position, not motion.
   • Every skeleton block carries `aria-hidden`; the loading state is announced
     once by the container (`aria-busy`), not thirty times by its placeholders.
   ============================================================================= */

export interface SkeletonProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Match the radius of the real element this stands in for. */
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const radiusMap = {
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
} as const;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ className, radius = "md", ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden
        className={cn(
          "relative overflow-hidden bg-surface-sunken",
          radiusMap[radius],
          className,
        )}
        {...props}
      >
        <span
          className="anim-sheen absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.6)_48%,transparent_66%)] bg-[length:220%_100%] bg-[position:130%_0]"
        />
      </div>
    );
  },
);

/** Convenience: a block of text lines with a shortened last line. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          radius="xs"
          className={cn("h-3.5", i === lines - 1 && "w-3/5")}
        />
      ))}
    </div>
  );
}
