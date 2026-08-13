import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { headerMetaVariants, headerTitleVariants } from "./section-header";

/* =============================================================================
   Card — the default container for a discrete unit of content.
   =============================================================================

   Server-safe: no state, no effects, no directive. Follows Button's conventions
   (`cva` for variants, `className` merged LAST, native element + `forwardRef`).

   UX NOTES
   --------
   • OPAQUE ON LIGHT AND DIM. `bg-surface` against the `canvas` ground
     is what separates "content" from "chrome" in this product. Glass is for
     navigational chrome only — a card is body content, and translucency behind
     data-dense text costs legibility for an effect nobody asked for.
   • CONCENTRIC RADIUS. A child's radius must be the parent's radius minus the
     padding between them. Card is `rounded-2xl` (18px) with `p-6`; strictly
     that leaves a child at ~0, so in practice any nested surface steps DOWN one
     or two rungs — `rounded-xl` / `rounded-lg`. It must never match or exceed
     the card. Mark nested surfaces with `data-card-inner` and the card applies
     `rounded-xl` for you, so the rule holds without every caller remembering it.
   • ONE elevation step. `shadow-sm` reads as a real object that sits on the page.
     Cards do not compete: if every card were `shadow-md` the page would have no
     foreground, only noise. Lift is reserved for things that actually float
     (menus, dialogs) or for `interactive` hover.
   • The `footerStrip` variant is for result cards — media outputs, fleet rows —
     where the actions belong in a visually separate tray rather than floating in
     the same air as the content. It bleeds a `surface-sunken` band to the card's
     edges under a top hairline, so "read" and "act" are two zones, not one.
   • Text hierarchy is carried by the section components: CardTitle is `ink`,
     CardBody defaults to `ink-secondary`, meta inside it drops to `ink-tertiary`.
     Three levels minimum — two is not a hierarchy, it's a flat box.
   ============================================================================= */

const cardVariants = cva(
  [
    "relative text-ink rounded-2xl",
    /* TRANSLUCENT by default. `bg-surface` is kept as the fallback paint beneath
       `.surface-veil` so a card is never unpainted if the utility is stripped, and
       so `prefers-reduced-transparency` has something to fall back TO.

       Cards are the one content surface licensed for translucency — see
       --color-surface-veil in tokens.css for why 80% is safe (measured ≥4.77:1 for
       every ink level over the densest point of the ambient layer) where glass on
       content still is not. The nesting guard in globals.css turns a card inside a
       card opaque automatically, so elevation never inverts. */
    "bg-surface surface-veil",
    /* Definition comes from the edge, not the shadow. See .panel-edge. */
    "panel-edge",
    /* Concentric guard: nested surfaces step down one rung automatically. */
    "[&_[data-card-inner]]:rounded-xl",
  ],
  {
    variants: {
      variant: {
        /* Content and actions share one padded box. */
        default: "p-6",
        /* Actions live in a sunken tray flush to the card's bottom edge.
           The footer bleeds out of the card's own padding with negative
           margins, so the card keeps `p-6` and nothing has to be recomputed;
           `overflow-hidden` lets the tray inherit the bottom corners. */
        footerStrip: [
          "p-6 overflow-hidden",
          "[&>[data-card-footer]]:-mx-6 [&>[data-card-footer]]:-mb-6 [&>[data-card-footer]]:mt-6",
          "[&>[data-card-footer]]:border-t [&>[data-card-footer]]:border-line-inner",
          "[&>[data-card-footer]]:bg-surface-sunken",
          "[&>[data-card-footer]]:px-6 [&>[data-card-footer]]:py-3",
        ],
      },
      elevation: {
        none: "shadow-none",
        xs: "shadow-xs",
        sm: "shadow-sm",
        md: "shadow-md",
      },
      /* Whole-card affordance (the card is a link/target). Hover raises it by
         exactly one step — enough to feel liftable, not enough to jump. */
      interactive: {
        true: [
          /* Sit above siblings while lifted, or the next card in the grid clips
             this one's shadow. --z-raised exists exactly for this. */
          "hover:z-(--z-raised)",
          "cursor-pointer text-left",
          "transition-[box-shadow,background-color,transform]",
          "duration-(--duration-fast) ease-(--ease-out-quint)",
          /* RISE on hover, PRESS on active. The kit had only the press — every
             interactive card scaled down when clicked and did nothing when
             approached, which is half a gesture. 2px is the whole lift: enough to
             read as liftable, small enough that a grid does not visibly reflow.
             It pairs with `hover:z-(--z-raised)` above, which exists precisely so
             the lifted card's shadow is not clipped by its neighbour. Both live
             inside the transition below, so the global prefers-reduced-motion
             block neutralises them together. */
          "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.995]",
        ],
      },
      /* For grids where cards must share a height and pin their footer down. */
      fill: {
        true: "flex h-full flex-col",
      },
    },
    defaultVariants: {
      variant: "default",
      elevation: "sm",
    },
  },
);

export interface CardProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, elevation, interactive, fill, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, elevation, interactive, fill }),
        className,
      )}
      {...props}
    />
  );
});

/* -----------------------------------------------------------------------------
   CardHeader — title block on the left, action affordance on the right.
   `items-start` rather than `items-center`: once the title wraps to two lines,
   a centered action drifts into the middle of the text block.
   --------------------------------------------------------------------------- */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function CardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-card-header=""
      className={cn("flex items-start justify-between gap-4", className)}
      {...props}
    />
  );
});

export interface CardTitleProps extends React.ComponentPropsWithoutRef<"h3"> {
  /** Heading level. Defaults to h3 — pick the one the page outline needs, not
      the one that looks right. The tier is fixed at block either way. */
  as?: "h2" | "h3" | "h4" | "div";
  /**
   * Machine METADATA, not a description — "claude-sonnet-4-6 · eu-west-1",
   * "1024 × 1024 · seed 88214". A dotted string you skim, which is why it is
   * smaller and quieter than a supporting sentence would be. If what you have is
   * prose the reader has to actually read, it belongs in the card body.
   */
  meta?: React.ReactNode;
}

/* A card title is the block tier of the header pattern, so it takes the pattern's
   own recipes rather than restating them. Same definition, different markup —
   see section-header.tsx for why the tier is sans and not the display serif. */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className, as: Tag = "h3", meta, children, ...props }, ref) {
    return (
      <div className="min-w-0">
        <Tag
          ref={ref}
          className={cn(headerTitleVariants({ level: "block" }), className)}
          {...props}
        >
          {children}
        </Tag>
        {meta ? <p className={headerMetaVariants()}>{meta}</p> : null}
      </div>
    );
  },
);

/* -----------------------------------------------------------------------------
   CardAction — the top-right slot. `-mr-1.5 -mt-1.5` pulls a ghost icon button
   back toward the card's optical edge: a transparent button's padding is not
   visible, so left in flow it reads as a hole in the corner.
   --------------------------------------------------------------------------- */
export const CardAction = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function CardAction({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "-mt-1.5 -mr-1.5 flex shrink-0 items-center gap-1",
        className,
      )}
      {...props}
    />
  );
});

export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function CardBody({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-card-body=""
      className={cn(
        "mt-4 flex-1 text-sm text-ink-secondary [&:first-child]:mt-0",
        className,
      )}
      {...props}
    />
  );
});

export interface CardFooterProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Where the footer content sits. `between` for label-left / actions-right. */
  align?: "start" | "between" | "end";
}

const cardFooterVariants = cva(
  ["flex flex-wrap items-center gap-2 text-xs text-ink-tertiary"],
  {
    variants: {
      align: {
        start: "justify-start",
        between: "justify-between",
        end: "justify-end",
      },
    },
    defaultVariants: { align: "between" },
  },
);

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ className, align, ...props }, ref) {
    return (
      <div
        ref={ref}
        /* Card's `footerStrip` variant keys off this attribute to turn the
           footer into a flush sunken action tray. */
        data-card-footer=""
        className={cn("mt-4", cardFooterVariants({ align }), className)}
        {...props}
      />
    );
  },
);

export { cardVariants };
