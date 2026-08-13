import { cva, type VariantProps } from "class-variance-authority";
import { Icon } from "@/components/primitives/icon";
import { MODALITY_ICON } from "@/lib/icons";
import type { Modality } from "@/lib/mock/agents";
import { cn } from "@/lib/cn";
import { Waveform } from "./waveform";

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

   ADOPTED BY ALL FIVE, finally: ModelCard, the home page proof strip, the session
   canvas, the session rail's media strip, and the run-history grid. This note used
   to list the last two as outstanding; they are not any more, and each of the three
   literals it replaced had drifted the same two ways — no hue variation, so every
   coverless item on that surface looked like the same object, and hard-coded
   near-white stops, which read as a bright hole on either dark theme.

   AUDIO NEVER REACHES THE WASH. It has a real representation of its own — see
   `components/app/waveform.tsx` — so the `modality === "audio"` branch below sits
   ABOVE the generated fallback. The ordering is the rule: the artifact's own
   picture, then a supplied asset, then the fallback.
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
  /** Audio only, as "m:ss". Passed straight to the waveform, which derives its bar
      count from it — so a 0:08 clip and a 2:30 clip do not draw the same shape. */
  duration?: string;
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
  duration,
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
  /* THE TWO BASE STOPS COME FROM TOKENS, not from literals, because they encode
     "roughly the lightness of the page's own surfaces" — and that is exactly the
     thing a theme changes. Written as 93/83 they were correct for the light theme
     and produced a pale rectangle on the two dark ones. On the spatial theme, where
     there is no card edge around the cover, a pale rectangle does not read as
     generic cover art; it reads as a hole in the plane.

     `--cover-l-dir` carries the SIGN of the variant offsets, and it has to exist:
     "weaker" means lighter on a light ground and darker on a dark one, so `danger`
     moving +2/+5 is right in one theme and backwards in the other. One token, and
     the three variants stay a single expression instead of a per-theme table. */
  const d1 = dim ? 3 : danger ? 2 : 0;
  const d2 = dim ? 9 : danger ? 5 : 0;
  const stop = (base: string, delta: number) =>
    delta === 0 ? `var(${base})` : `calc(var(${base}) + ${delta}% * var(--cover-l-dir))`;

  return (
    /* `data-media-frame` is the hook for the one rule the spatial theme needs
       here: media has to draw its own edge under that theme, because the Card that
       used to provide one paints nothing. On light and dim the attribute does
       nothing at all — see the rule in app/globals.css. */
    <div data-media-frame className={cn(coverVariants({ height }), className)} {...props}>
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element -- the kit ships no
           images, so next/image's optimiser has nothing to do here. This branch
           exists only so a consuming app can supply real artwork. */
        <img src={src} alt="" className="size-full object-cover" />
      ) : modality === "audio" ? (
        /* AUDIO IS NOT A MISSING IMAGE. It has a picture of its own, so it never
           reaches the generated wash below — a waveform is what the artifact
           actually looks like, and it carries the clip's real duration besides.
           See components/app/waveform.tsx. Kept above the wash branch rather than
           inside it so the ordering states the rule: real representation first,
           then the asset, then the fallback. */
        <Waveform seed={seed} duration={duration} />
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
                linear-gradient(155deg, oklch(${stop("--cover-l1", d1)} 0.04 ${hue}) 0%, oklch(${stop("--cover-l2", d2)} 0.07 ${hue + 18}) 100%)`,
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
