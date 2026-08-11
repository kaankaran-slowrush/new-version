import { cva } from "class-variance-authority";

/* =============================================================================
   Button variants — deliberately in their own, NON-client module.
   =============================================================================
   `button.tsx` carries "use client" (consumers attach onClick), which makes
   everything it exports a client binding — including the variant function. A
   server component calling it then fails at build time with "Attempted to call
   buttonVariants() from the server".

   Variant maps are pure string builders with no runtime and no interactivity, so
   they belong in a shared module both environments can import. This matters in
   practice: applying button styling to a `next/link` inside a server-rendered
   page is the single most common thing you do with it.

   CONVENTION: any component whose variants might be needed for styling a
   different element (Button, Badge, Pill) keeps its cva in a `*-variants.ts`
   sibling. Components whose variants are only ever used internally can keep
   them inline.
   ============================================================================= */

export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2",
    "font-medium whitespace-nowrap select-none",
    "transition-[transform,background-color,box-shadow,color,opacity]",
    "duration-(--duration-instant) ease-(--ease-out-quint)",
    "active:scale-[0.97]",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        /* The one high-emphasis action. INK fill, white text — not the accent.
           See --color-action in tokens.css for why the two were separated. Hover
           lightens, because there is nowhere darker to go from near-black. */
        primary: [
          "bg-action text-action-ink shadow-xs",
          "hover:bg-action-hover",
          "disabled:bg-ink-muted disabled:text-white",
        ],
        /* Default for most actions. Reads as a real, liftable object. */
        secondary: [
          "bg-surface text-ink shadow-sm",
          "hover:bg-surface-hover",
          "disabled:text-ink-muted disabled:shadow-xs",
        ],
        /* Lowest emphasis. For toolbars and dense rows where a bordered button
           every 40px would turn the UI into a grid of boxes. */
        ghost: [
          "bg-transparent text-ink-secondary",
          "hover:bg-surface-hover hover:text-ink",
          "disabled:text-ink-muted disabled:hover:bg-transparent",
        ],
        /* Destructive. Solid fill is reserved for confirmation inside a dialog —
           in a normal row, prefer `ghost-danger` so red is not shouting at rest. */
        danger: [
          "bg-danger text-white shadow-xs",
          "hover:brightness-110",
          "disabled:bg-ink-muted",
        ],
        "ghost-danger": [
          "bg-transparent text-danger",
          "hover:bg-danger-soft",
          "disabled:text-ink-muted disabled:hover:bg-transparent",
        ],
        /* Inline text action. No box at all. */
        link: [
          "bg-transparent text-accent-ink underline-offset-4 h-auto! p-0!",
          "hover:underline",
          "disabled:text-ink-muted disabled:no-underline",
        ],
      },
      size: {
        /* Padding moved up a step with the heights. A button that grows only
           vertically reads as narrow rather than as bigger, and the label ends up
           closer to the edge than it was before. Radius is deliberately unchanged:
           the ask was size, and quietly rounding every button in the product is a
           change to its shape language, not to its scale. */
        sm: "h-(--control-height-sm) rounded-md px-3.5 text-sm [&_svg]:size-3.5",
        md: "h-(--control-height-md) rounded-md px-4 text-sm [&_svg]:size-4",
        lg: "h-(--control-height-lg) rounded-lg px-6 text-base [&_svg]:size-4.5",
        xl: "h-(--control-height-xl) rounded-xl px-7 text-base font-semibold [&_svg]:size-5",
      },
      /* Square footprint for icon-only. Always pass an aria-label with this. */
      iconOnly: {
        true: "px-0 aspect-square",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);
