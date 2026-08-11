/* =============================================================================
   AmbientBackground — the fixed molten layer behind every route
   =============================================================================

   WHY THIS EXISTS AT ALL
   ---------------------
   Two surfaces in this product are translucent: navigational chrome (`.glass`)
   and content cards (`.surface-veil`). Translucency over a flat static colour is
   wasted — it costs contrast and reveals nothing. This layer is what they reveal.
   That is the justification. It is not here to look futuristic; it is here because
   the surfaces above it need something to be translucent *against*.

   THE STACK, back to front
   ------------------------
   0. GROUND — the base colour, opaque, its HUE slowly turning over 181s. The only
      thing on this layer that moves the page's own colour rather than something
      laid over it.
   1. LAVA — four large blurred blobs drifting on independent prime-numbered
      cycles. Where two cross, their alphas compound and the colour deepens; that
      compounding is what reads as molten rather than as a fading gradient.
   2. SCRIM — a broad near-white wash OVER the lava. This is the load-bearing
      readability layer, not decoration: without it, text sitting directly on the
      canvas drops below 4.5:1 wherever blobs overlap (measured: ink-tertiary
      falls to 2.54:1 on a bare three-way overlap). The scrim pulls the middle of
      the frame back up while leaving the outer field saturated, so you still see
      the lava at the edges and through every translucent surface.
   3. CONIC — one slowly rotating conic wash, adding an angular motion the radial
      blobs cannot produce on their own.
   4. GRAIN — static noise. Large smooth gradients band visibly on 8-bit
      displays, and banding is what makes them look cheap.
   5. CURSOR GLOW — the one reactive element. Follows the pointer, but only across
      empty space; it switches off over any card, control or chrome.

   THE STRUCTURAL RULE THIS LAYER IMPOSES
   --------------------------------------
   `--color-ink-tertiary` and `--color-ink-muted` MUST NOT sit directly on the
   canvas. They need a surface under them — a card, a veil, or glass — all of which
   measure ≥4.62:1 even over the densest point of the lava. Primary and secondary
   ink are safe on bare canvas anywhere in frame (secondary: 6.6:1 in the scrimmed
   band, 4.64:1 at the very edge). This is a real constraint the ambient layer
   creates, and it is documented in /docs/foundations/color rather than left for
   someone to discover.

   WHY CSS AND NOT WEBGL
   ---------------------
   A WebGL mesh gradient (@mesh-gradient/react, GradFlow, Stripe's ~10kb
   gradient.js) wins a side-by-side. It also costs a dependency the consuming team
   must adopt, a canvas, and continuous GPU work for a decorative layer — in a
   tool people leave open all day, on battery. Four composited CSS layers get
   substantially the same read for nothing and degrade honestly.

   WHY NOT PARTICLES OR ORBS
   -------------------------
   Discrete floating shapes are the clearest "AI slop" tell in current product
   design. Everything here is blurred past the point of countability on purpose:
   you should not be able to point at a shape.

   DEGRADATION
   -----------
   Motion self-gates on `prefers-reduced-motion` (the utilities carry their own
   media query). The whole layer is REMOVED — not dimmed — under
   `prefers-contrast: more` and `prefers-reduced-transparency`, via the
   `.ambient-layer` hook in globals.css. Dimming would leave it interfering with
   text; the honest answer to "I need more contrast" is to take the atmosphere away.
   ============================================================================= */

import { CursorGlow } from "./cursor-glow";

/* feTurbulence, inlined. ~200 bytes, no network request, no build step. */
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* The four blobs.
   Hues stay inside the SIGNAL family (212–236, around the accent's 224) rather
   than reaching for orange. Real lava is warm, but the only warm hues in this
   palette are ember and rust — the warning and danger semantics — and spending a
   status colour on decoration is exactly the mistake the palette forbids. Lava
   reads as lava through form and flow, not through being orange.

   Alphas are 22% and the blobs sit MOSTLY INSIDE the frame. The previous version
   anchored them off-frame (-24% left, -22% right, -28% bottom) and blurred them at
   64px, which spread them so far that almost none of the colour reached the content
   area — the layer animated correctly and was invisible. Measured in the content
   band, the old settings produced about 4/255 of swing; these produce about 90.

   22% is the measured ceiling, not a taste call: two overlapping blobs plus the
   sweep plus a grid line must still leave `ink-secondary` at 4.5:1 on bare canvas
   (5.26:1 here) and `ink-tertiary` at 4.5:1 on the glass topbar (4.51:1 here). */
const BLOBS = [
  {
    className: "anim-lava-1",
    style: {
      top: "-18%",
      left: "-8%",
      width: "62vmax",
      height: "70vmax",
      background: "radial-gradient(closest-side, oklch(50% 0.16 212 / 0.22), transparent 70%)",
    },
  },
  {
    className: "anim-lava-2",
    style: {
      top: "2%",
      right: "-10%",
      width: "58vmax",
      height: "75vmax",
      background: "radial-gradient(closest-side, oklch(45% 0.15 232 / 0.22), transparent 70%)",
    },
  },
  {
    className: "anim-lava-3",
    style: {
      bottom: "-22%",
      left: "22%",
      width: "66vmax",
      height: "64vmax",
      background: "radial-gradient(closest-side, oklch(62% 0.16 248 / 0.22), transparent 70%)",
    },
  },
  {
    className: "anim-lava-4",
    style: {
      bottom: "-6%",
      right: "14%",
      width: "46vmax",
      height: "56vmax",
      background: "radial-gradient(closest-side, oklch(72% 0.14 218 / 0.20), transparent 68%)",
    },
  },
] as const;

export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-(--z-ambient) overflow-hidden"
    >
      {/* 0 · THE GROUND ITSELF, and it is the only layer that is fully opaque.
             `body` already paints a static --color-canvas underneath, which is what
             every contrast measurement in this kit is computed against and what
             shows if this layer is removed. This sits on top of it and turns, so
             the page's base colour is never quite the same twice.

             Lightness and chroma come from the SAME tokens --color-canvas is built
             from, so this cannot drift out of step with it — only the hue moves.
             See the @property note in globals.css. */}
      <div
        className="anim-ground-hue ambient-layer absolute inset-0"
        style={{
          backgroundColor: "oklch(var(--canvas-l) var(--canvas-c) var(--canvas-hue))",
        }}
      />

      {/* 1 · LAVA. Each blob carries its own blur so the compositor rasterises it
             once and then only moves it — see animations.css for why that matters. */}
      {BLOBS.map((blob) => (
        <div
          key={blob.className}
          className={`ambient-layer absolute blur-[58px] ${blob.className}`}
          style={blob.style}
        />
      ))}

      {/* 2 · SWEEP — one wide band crossing the field.
             The blobs breathe in place, which reads as alive but never as moving.
             This is what gives the layer a DIRECTION, and direction is most of what
             separates an atmosphere from a texture. Oversized and rotated so its
             ends are never in frame. */}
      <div
        className="anim-aurora-sweep ambient-layer absolute top-[-40%] left-[-30%] h-[110%] w-[160%] blur-[46px]"
        style={{
          background:
            "linear-gradient(100deg, transparent 34%, oklch(72% 0.15 236 / 0.3) 47%, oklch(58% 0.16 214 / 0.2) 53%, transparent 66%)",
        }}
      />

      {/* 3 · GRID — the only structural element on this layer.
             A ruled grid is what makes a surface read as an instrument rather than
             a gradient, and it is almost free in contrast terms: one 1px line at 7%
             inside a 56px cell barely moves the local average. It drifts by exactly
             one cell, so the loop is seamless by construction rather than by being
             slow enough to hide a jump. Sized past the viewport so the translate
             never exposes an edge. */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="anim-grid-drift ambient-layer absolute -inset-[60px]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(42% 0.115 224 / 0.07) 1px, transparent 1px), linear-gradient(90deg, oklch(42% 0.115 224 / 0.07) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* 4 · SCRIM — the readability layer, and the reason bare-canvas text is
             legible at all. Strongest through the middle where the content column
             sits, then falling to a FLOOR rather than to transparent.

             The floor is measured, not aesthetic. With the scrim reaching full
             transparency at the frame edge, ink-secondary on the bare canvas
             measured 4.07:1 over a three-blob overlap — a real failure on narrow
             viewports, where the content column reaches the edges. A 16% floor
             brings it to 4.64:1 and still keeps 24/255 of colour swing on the
             translucent surfaces above, so the lava is in no way washed out.

             Two soft stops rather than one hard one, so the falloff never reads as
             a vignette. */}
      <div
        className="ambient-layer absolute inset-0"
        style={{
          background:
            /* The scrim colour is a TOKEN, not a literal, because it has to invert
               with the theme. It exists to lift the middle of the frame away from
               the blobs so ink stays legible there — which on a light ground means
               washing toward white, and on the dim ground means washing toward
               black. Left as `98.5%` it would have turned the dim theme's canvas
               into pale grey and undone the whole point of it. */
            "radial-gradient(ellipse 125% 92% at 50% 44%, var(--color-scrim-strong) 0%, var(--color-scrim-mid) 48%, var(--color-scrim-soft) 84%, var(--color-scrim-soft) 100%)",
        }}
      />

      {/* 5 · CONIC — angular motion the radial blobs cannot make. Sized past the
             viewport because a rotating box smaller than its container sweeps its
             own corners through frame. */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className="anim-slow-spin ambient-layer aspect-square w-[160vmax] rounded-full opacity-45 blur-[70px]"
          style={{
            background: `conic-gradient(from 0deg,
              transparent 0deg,
              oklch(59.5% 0.14 224 / 0.12) 55deg,
              transparent 130deg,
              oklch(42% 0.115 224 / 0.09) 210deg,
              transparent 290deg,
              oklch(69% 0.13 224 / 0.1) 340deg,
              transparent 360deg)`,
          }}
        />
      </div>

      {/* 6 · CURSOR GLOW — the only part of this layer that reacts to input.
             Client-side, and deliberately absent over any painted surface: see its
             own file for why a glow that followed the pointer everywhere would be a
             spotlight rather than an atmosphere. */}
      <CursorGlow />

      {/* 7 · GRAIN. Static — animated noise is a well-known way to make a page
             feel expensive and drain a battery. `soft-light` keeps it as texture
             rather than a grey film over the whole interface. */}
      <div
        className="ambient-layer absolute inset-0 opacity-[0.04] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN_URI, backgroundRepeat: "repeat" }}
      />
    </div>
  );
}
