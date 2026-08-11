import { cva, type VariantProps } from "class-variance-authority";
import { Icon } from "@/components/primitives/icon";
import { MODALITY_ICON } from "@/lib/icons";
import type { Modality } from "@/lib/mock/agents";
import { cn } from "@/lib/cn";

/* =============================================================================
   ProceduralCover — the kit's ONE stand-in for generated media
   =============================================================================

   WHY IT EXISTS AT ALL. This kit ships zero image assets, and inventing stock
   photography would be the one dishonest thing in it: a screenshot full of
   beautiful fake output makes the product look like it does more than it does.
   So anywhere a cover is needed, it is generated from the item's own identity.

   WHY IT EXISTS AS A COMPONENT. The same idea had been hand-written four times —
   session-canvas, the run-history grid, the home page proof strip, and ModelCard —
   and the copies had already drifted apart on every axis that matters: gradient
   angle (135° vs 140°), stop count (2 vs 3), glyph size (24px vs 32px), glyph
   opacity (45% vs 35%), and, worst, hue source. Two of them hard-coded a single
   literal hue, so every tile on those surfaces looked identical.

   DETERMINISTIC, NOT RANDOM. `hueFor(seed)` is a string hash. The same item must
   get the same cover on every render and on every surface, or the grid flickers on
   navigation and — more importantly — a card stops being recognisable as the thing
   you saw a moment ago on another page.

   THE HUE RANGE IS LOAD-BEARING. 190°–265° is the signal family plus a little
   either side, and it is narrow on purpose. A full 360° spread would turn a grid
   into a colour wheel and, worse, collide with the status palette: a green-covered
   tile beside a red "Failed" badge reads as a STATE, not as decoration.

   WHY IT QUANTISES TO BUCKETS INSTEAD OF USING THE RANGE CONTINUOUSLY.
   The first version mapped the hash across all 76 degrees, and on the home page —
   whose turn ids are `t1`…`t5` — it produced 263°, 264° and 265° for three adjacent
   tiles. Indistinguishable. A hash over short, near-identical seeds has almost no
   avalanche, so "spread it over a range" is a promise it cannot keep.

   So the range is cut into 8 buckets 9° apart, and the (avalanche-mixed) hash picks
   one. Two items now either land on the SAME hue — which reads as coincidence, and
   is fine — or on hues at least 9° apart, which is visibly different. A continuous
   range guarantees neither. The mixing steps below are what stop `t1` and `t2` from
   landing in the same bucket every time.

   ADOPTED BY: ModelCard, the home page proof strip.
   NOT YET: `components/app/session-canvas.tsx` and the run-history grid view still
   carry their own literals. They are the remaining adopters — this note is here so
   the claim stays accurate rather than aspirational.
   ============================================================================= */

const coverVariants = cva("relative shrink-0 overflow-hidden bg-surface-sunken", {
  variants: {
    height: {
      sm: "h-28",
      md: "h-36",
      lg: "h-40",
    },
  },
  defaultVariants: { height: "md" },
});

/* A WATERMARK, not a centred icon — and that distinction is the whole point.
   A pale box with a small picture glyph in the middle of it is the universal
   broken-image visual; the previous version reproduced it exactly, so every cover
   on the page read as "this failed to load". Oversized, cropped by the frame and
   pushed into a corner, the same glyph reads as a deliberate mark. */
const glyphVariants = cva("pointer-events-none absolute -right-4 -bottom-8", {
  variants: {
    height: {
      sm: "[&_svg]:size-20",
      md: "[&_svg]:size-24",
      lg: "[&_svg]:size-28",
    },
    tone: {
      accent: "text-accent-ink/20",
      danger: "text-danger/22",
      muted: "text-ink-muted/16",
    },
  },
  defaultVariants: { height: "md", tone: "accent" },
});

/** 8 buckets across 206°–269°, 9° apart. See the note above for why this is
    quantised rather than continuous.

    The base moved up from 190°: at the bottom of the old range the covers came out
    visibly teal-green, which put them in conversation with the success colour — the
    exact collision the narrow range exists to prevent. 206° upward is blue through
    periwinkle, with no green anywhere in it. */
const HUE_BASE = 206;
const HUE_BUCKETS = 8;
const HUE_STEP = 9;

export function hueFor(seed: string): number {
  /* FNV-1a, then a MurmurHash3 finaliser. The finaliser is not decoration: without
     it, two-character seeds differing by one character land on adjacent hash values
     and therefore on the same or neighbouring bucket. */
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return HUE_BASE + (Math.abs(h) % HUE_BUCKETS) * HUE_STEP;
}

export interface ProceduralCoverProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof coverVariants> {
  /** Stable identity — an id, never an index or a title that can change. */
  seed: string;
  modality: Modality;
  /** Halves every alpha. For deprecated / superseded / inactive items. */
  dim?: boolean;
  /** `danger` recolours the whole cover; use it where the item FAILED. */
  tone?: "accent" | "danger";
  /** Real artwork, when a consuming app has it. Wins over the generated cover. */
  src?: string;
  /** Overlay slot — badges, status marks, a play button. Positioned by the caller,
      because what belongs on a cover is the caller's business, not this file's. */
  children?: React.ReactNode;
}

export function ProceduralCover({
  className,
  seed,
  modality,
  height,
  dim = false,
  tone = "accent",
  src,
  children,
  ...props
}: ProceduralCoverProps) {
  const danger = tone === "danger";
  const hue = danger ? 25 : hueFor(seed);
  /* The failed cover is deliberately WEAKER than a normal one. A full-strength red
     panel reads as an alarm, and a finished-but-failed artifact in a browse rail is
     not an emergency — the badge on top already says so. */
  const a1 = dim ? 0.12 : danger ? 0.34 : 0.5;
  const a2 = dim ? 0.09 : danger ? 0.26 : 0.4;
  const baseL1 = dim ? 96 : danger ? 95 : 93;
  const baseL2 = dim ? 92 : danger ? 88 : 83;

  return (
    <div className={cn(coverVariants({ height }), className)} {...props}>
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element -- the kit ships no
           images, so next/image's optimiser has nothing to do here. This branch
           exists only so a consuming app can supply real artwork. */
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              /* THREE LAYERS, and the bottom one is OPAQUE. The previous recipe was
                 a single gradient fading to `transparent 82%`, which meant most of
                 the cover was bare `bg-surface-sunken` — measured, the fill only
                 travelled 63/255 from the base at its single strongest corner and
                 nothing at all across the rest. That is why they looked empty.

                 Now: a deep radial anchored off the top-left corner, a lighter one
                 off the bottom-right, and a tinted base underneath so no part of the
                 box is ever unpainted. */
              background: `
                radial-gradient(130% 110% at 8% -5%, oklch(48% 0.16 ${hue} / ${a1}) 0%, transparent 60%),
                radial-gradient(100% 90% at 95% 105%, oklch(68% 0.15 ${hue + 26} / ${a2}) 0%, transparent 58%),
                linear-gradient(155deg, oklch(${baseL1}% 0.04 ${hue}) 0%, oklch(${baseL2}% 0.07 ${hue + 18}) 100%)`,
            }}
          />
          <div
            aria-hidden
            className={glyphVariants({
              height,
              tone: dim ? "muted" : tone,
            })}
          >
            <Icon of={MODALITY_ICON[modality]} />
          </div>
        </>
      )}
      {children}
    </div>
  );
}

export { coverVariants as proceduralCoverVariants };
