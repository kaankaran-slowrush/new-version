import type { LucideProps } from "lucide-react";
import type { LucideIcon } from "@/lib/icons";

/* =============================================================================
   Icon — renders an icon COMPONENT from a registry lookup
   =============================================================================

   WHY THIS EXISTS

   `lib/icons.ts` stores icon components rather than rendered elements, which is
   what lets each call site inherit its parent's `[&_svg]:size-*` rule instead of
   being frozen at whatever size the registry author picked. The cost is that a
   lookup returns a component, and JSX cannot render a lowercase-bound component
   inline — you would have to hoist it to a capitalised variable at every use:

     const Glyph = MODALITY_ICON[turn.modality];
     return <Glyph />;

   That is fine inside a `.map()` and unusable inside dense inline JSX. This
   component removes the hoist:

     <Icon of={MODALITY_ICON[turn.modality]} />

   WHY `aria-hidden` DEFAULTS TO TRUE

   Almost every icon in a product interface is decorative — it sits beside a text
   label that already carries the meaning, and announcing both makes a screen
   reader say everything twice. The kit's own convention (see StatusMark) is that
   the CONTAINER carries the accessible name and the glyph is hidden. Defaulting
   to hidden makes the common case correct for free, and the rare meaningful icon
   opts out explicitly:

     <Icon of={TriangleAlert} aria-hidden={false} aria-label="Failed" />

   This deliberately does NOT wrap, size, or colour anything. Icons inherit
   `currentColor` and their size from the parent's `[&_svg]` rule; a wrapper that
   set either would break the one contract that makes the registry work.

   Stroke weight is not a prop here either — it is `--icon-stroke`, applied to
   every icon at once in globals.css. A per-icon weight is a deliberate exception
   and is written as a utility (`[stroke-width:2.25]`) so it is visible in the diff.
   ============================================================================= */

export interface IconProps extends Omit<LucideProps, "ref"> {
  /** The icon component, normally from a `lib/icons.ts` registry lookup. */
  of: LucideIcon;
}

export function Icon({ of: Glyph, "aria-hidden": ariaHidden = true, ...rest }: IconProps) {
  return <Glyph aria-hidden={ariaHidden} {...rest} />;
}
