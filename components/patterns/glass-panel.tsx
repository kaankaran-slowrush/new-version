import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   GlassPanel — a thin, typed wrapper over the `.glass` utility.
   =============================================================================

   The effect itself lives in `globals.css` (`.glass`), not here. This component
   exists only so callers get radius / padding / elevation as props instead of
   re-deriving them, and so the three rules below travel with the API.

   THE THREE GLASS RULES
   ---------------------
   1. NAVIGATIONAL CHROME ONLY. Topbar, side rails, composer, floating command
      surfaces. Never body content, never data-dense cards, never anything a
      user reads for more than a glance. Reading beats effect — use `Card`.
   2. THE BARRIER LAYER IS MANDATORY, and is already built into the utility:
      `.glass::before` paints a solid low-opacity fill beneath the content,
      because `--color-glass` alone is too sheer for text to survive over an
      arbitrary backdrop. That layer is what keeps text at ≥4.5:1 instead of
      "usually fine". Do not reimplement glass with a bare `bg-white/55` —
      you will lose it.
   3. ALWAYS PAIRED WITH ELEVATION. Translucency on its own reads as broken
      rendering; translucency plus lift reads as floating above the page. The
      utility ships `--shadow-lg`; `elevation` here only lets you retune which
      step, never remove it — which is why there is no `none`.

   UX NOTES
   --------
   • Glass is only worth its cost when there is something behind it to refract.
     Pair it with `.ambient-ground` + `.anim-aurora`; over a flat fill it is a
     blur of nothing and you have paid for a backdrop-filter for free.
   • `backdrop-filter` is expensive and compositor-bound. A handful of glass
     surfaces per view, not a grid of them.
   • Degradation is handled centrally: `prefers-contrast: more` and
     `prefers-reduced-transparency` both collapse `.glass` to an opaque surface
     in `globals.css`. Nothing to do per instance.
   ============================================================================= */

const glassPanelVariants = cva(["glass"], {
  variants: {
    /* Radius rungs only — the capsule for topbars, the two large rungs for
       panels and dialogs. Anything smaller than `lg` is a control, and controls
       are too small to show a blur. */
    radius: {
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full",
    },
    padding: {
      none: "p-0",
      xs: "p-1",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
    },
    /* No `none`: rule 3. */
    elevation: {
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      composer: "shadow-(--shadow-composer)",
    },
    /* Opt-in hairline for a panel whose edge lands on a busy backdrop. */
    bordered: {
      /* .glass already paints a --border-width-panel edge; this variant only
           STRENGTHENS it rather than adding a second one. */
        true: "border-line-strong",
    },
  },
  defaultVariants: {
    radius: "2xl",
    padding: "md",
    elevation: "lg",
  },
});

export interface GlassPanelProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof glassPanelVariants> {}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  function GlassPanel(
    { className, radius, padding, elevation, bordered, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          glassPanelVariants({ radius, padding, elevation, bordered }),
          className,
        )}
        {...props}
      />
    );
  },
);

export { glassPanelVariants };
