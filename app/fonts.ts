import { Instrument_Serif, Inter_Tight } from "next/font/google";
import { GeistMono } from "geist/font/mono";

/* =============================================================================
   The type system
   =============================================================================

   THREE ROLES, NEVER MORE. Every piece of type in the product is one of:

     display  headings that name a place or a region — h1 and h2, nothing else
     body     anything a person wrote: copy, labels, descriptions, buttons
     data     anything the machine measured: model IDs, latencies, token counts,
              currency, timestamps

   That mapping is the actual system; the families below are just the current
   answer to it. `styles/tokens.css` is where the roles become tokens
   (`--font-display`, `--font-sans`, `--font-mono`), and nothing else in the
   codebase names a typeface — h1/h2 pick up the display face from one rule in
   `globals.css`, and everything else inherits body from <html>.

   ---------------------------------------------------------------------------
   WHY THESE THREE

   Display was Geist Mono until now, which meant the product had no display face
   at all: headings were the data face at a larger size. That reads as "bigger
   text", not as a voice. Instrument Serif gives the headings something to be —
   and in a category where every competitor ships a grotesque or a mono, a serif
   is the one choice a screenshot cannot be mistaken for someone else's.

   THE SERIF HAS NO WEIGHT AXIS — 400 is the only weight it ships. That single
   fact sets the whole heading ladder, because the face cannot gain contrast by
   getting bolder, only by getting bigger. Its floor is 22px, so the tier below
   a section heading changes FACE rather than shrinking. See the three tiers in
   `app/globals.css` and the pattern at /docs/patterns/headers.

   Body is Inter Tight rather than a companion sans drawn alongside the serif.
   That trade is deliberate: a companion agrees with the display face, but a
   neutral grotesque gets out of its way entirely, and getting out of the way is
   worth more here. The serif is the only thing on the page with a point of view;
   anything else with an opinion competes with it. Inter Tight is also tighter
   than stock Inter, which matters in a product where 13px body copy at 152 call
   sites is the real reading size.

   Data stays Geist Mono, deliberately. It is doing a different job from the
   display face — lining up digits in a column — and it is already correct at
   it. Changing it would have been change for its own sake.

   ---------------------------------------------------------------------------
   TO SWAP THE SYSTEM

   Replace the two `next/font/google` calls below and the matching block in
   `styles/tokens.css` (the three `--font-*` declarations and `--tracking-*`).
   Tracking has to move with the face: a mono needs far more negative tracking
   than a serif, because it starts out wider. And if the new display face has a
   real weight axis, revisit the 22px floor in `globals.css` — it exists only
   because this one does not. Three alternatives that were built and compared:

     Editorial  Instrument_Serif + Instrument_Sans + GeistMono
                the serif's drawn companion, if you want the pair to agree
     Technical  IBM_Plex_Sans (600) + IBM_Plex_Sans + IBM_Plex_Mono
                tracking-display -0.03em
     Grotesk    Bricolage_Grotesque (opsz axis) + Public_Sans + GeistMono
                tracking-display -0.03em

   ---------------------------------------------------------------------------
   `latin-ext` IS NOT OPTIONAL. It carries the Turkish characters (ı, ğ, ş, İ),
   and the product is being built by a Turkish team who will type them into
   every fixture and every demo. Dropping it does not error — it silently falls
   back mid-word, which is worse.
   ============================================================================= */

/* Normal only. The italic was loaded for a while on the theory that it would be
   the emphasis mark inside a heading; it was used zero times, and across two
   subsets that is two preloaded files for a feature that does not exist. Add it
   back the day something actually sets `italic` on a heading, not before. */
export const displayFont = Instrument_Serif({
  weight: "400",
  style: "normal",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display-face",
});

export const bodyFont = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-body-face",
});

/* Geist ships its own next/font instance, already self-hosted. It exposes
   `--font-geist-mono`, which is why tokens.css names that variable rather than a
   uniform `--font-data-face`: renaming it would mean re-wrapping the package for
   no gain. */
export const dataFont = GeistMono;

/** Every font variable, for the <html> className. One export so a new face can
    never be added and then forgotten at the mount point. */
export const fontVariables = [
  displayFont.variable,
  bodyFont.variable,
  dataFont.variable,
].join(" ");
