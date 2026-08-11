import Link from "next/link";
import { cn } from "@/lib/cn";

/* =============================================================================
   Wordmark — the mark plus the name
   =============================================================================

   ⚠️  THE MARK BELOW IS A TRACE, NOT THE OFFICIAL ASSET.

   It was rebuilt from a raster screenshot — the only form of the logo this repo
   has been given — by rasterising candidate SVGs with `qlmanage` and comparing
   them against the reference by eye, over several passes. The CONSTRUCTION is
   right: square-topped block, downward-converging point, a diagonal parallelogram
   counter on the left, a left-pointing triangle counter on the right, the whole
   move repeated in a lower half that carries the mark to its point.

   The exact VERTICES are still not the official ones. A brand mark that is
   *nearly* right is worse than an obvious placeholder, because nobody notices it
   is wrong — so this stays flagged until the real geometry lands.

   TO MAKE IT EXACT — any one of these, all one file, all about a minute:
     a. Open the official .svg in a text editor and paste its <path d="…"> values
        over the two below, matching the viewBox to the real artwork.
     b. Or drop the file at `components/chrome/logo.svg` and import it —
        Next.js handles SVG imports, though you then lose `currentColor`.
     c. Or paste the SVG source into chat as text and it can be dropped in here.
   Then delete this warning. Nothing else in the kit references the logo.

   WHY IT IS INLINE SVG AND NOT AN IMAGE FILE
   `currentColor` is the point. The mark inherits `--color-ink`, so it stays
   correct if the surface under it changes, if a dark theme is ever added by
   remapping the semantic layer, and under `prefers-contrast: more`. A PNG or a
   colour-baked SVG in `public/` would need a second copy for every one of those
   cases. It also avoids a network request for ~40 bytes of geometry.

   ACCESSIBILITY. The mark is `aria-hidden` and the link carries one clean
   accessible name. Without that, a screen reader announces the graphic and then
   the text and you hear the brand twice.
   ============================================================================= */

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 190 214"
      className={className}
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      {/*
        UPPER — a full-width block whose underside converges to a downward point.

        Both counters are CUT with `evenodd` rather than painted as white shapes,
        so the mark is a genuine single-colour silhouette. That is what lets it
        ride on `currentColor` and sit on any surface without a second asset.

        The two counters are deliberately NOT mirror images — a diagonal
        parallelogram on the left, a left-pointing triangle on the right — and that
        asymmetry is the most characteristic thing about the original.

        The right counter's lower vertex is at y=72, not 78. The block's diagonal
        edge passes through y≈74.8 at that x, so anything lower pokes through and
        leaves a sliver of fill outside the silhouette. Caught by rasterising the
        SVG and looking at it, not by reading the path.
      */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0h190v60L95 124 0 60V0Zm22 22v26l74 46V70L22 22Zm146 0-44 27 44 25V22Z"
      />
      {/*
        LOWER — the same move again, terminating in the mark's point.

        Separated from the upper block by a real gap rather than butted against it:
        the two halves read as distinct folded planes, and closing the gap collapses
        them into one blob at nav size.
      */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 110l95 62 95-62v42l-95 62L0 152v-42Zm22 26v24l74 48v-24l-74-48Z"
      />
    </svg>
  );
}

export function Wordmark({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="model.store — home"
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full whitespace-nowrap",
        className,
      )}
    >
      <LogoMark className={cn("h-6 w-auto text-ink", markClassName)} />
      {/* Always visible. An icon-only navigation can compact its destinations —
          they are recoverable on hover and the active one keeps its label — but the
          product's own name is not a destination, and a bar that never says what
          product you are in is disorienting on a first visit and anonymous on
          every one after. */}
      <span aria-hidden className="font-mono text-base font-semibold tracking-mono">
        <span className="text-ink">model</span>
        <span className="text-accent-ink">.store</span>
      </span>
    </Link>
  );
}
