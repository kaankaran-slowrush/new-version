/* SpatialBackdrop — the photograph the spatial theme's planes float on.
   ============================================================================

   Renders only under `data-theme="spatial"`. AmbientBackground stays the backdrop
   for `light` and `dim`; the two never render at once. Both live in the root
   layout and both are switched by CSS rather than by JavaScript — see the note on
   downloads below for why that choice is load-bearing rather than stylistic.

   WHY THIS EXISTS AT ALL, in a design system that otherwise refuses to depend on
   images. Because the spatial language is not "a dark theme with translucency" —
   translucency needs something behind it that rewards being seen through. A blurred
   plane over a flat fill is just a slightly different flat fill. The photograph is
   what makes the blur mean anything.

   THE CAP IS THE WHOLE CONTRACT
   ----------------------------
   A photograph has no contrast guarantee. This component does not ask for one, it
   imposes one: a black layer at `--backdrop-cap` opacity over the image, which
   pins the brightest pixel any image can produce to 0.22 luminance. Every ink and
   status value in the spatial theme was then measured against the plane composited
   over exactly that ceiling — see the derivation in styles/tokens.css.

   That is the only way a design system can promise legibility over an image it has
   never seen, which matters because a workspace is meant to be able to supply its
   own (see `--backdrop-image` below). Without the cap, "legible" would depend on
   the customer's choice of wallpaper.

   The cap value is NOT `1 - 0.22`. CSS opacity blends encoded sRGB, not linear
   light, so the conversion runs through the transfer function and lands on 0.40.
   Writing 0.78 there — as this component first did — crushes the photograph to a
   near-black field and makes every contrast figure derived from it wrong in the
   flattering direction. tokens.css carries the full warning.

   NO next/image, DELIBERATELY
   ---------------------------
   The image is a CSS `background-image`, not an <Image>, and that is what keeps it
   from costing anything to the ~2/3 of users who are not on this theme: a browser
   does not fetch the background of an element whose computed `display` is `none`.
   An <img> inside a hidden subtree is generally still fetched. So light and dim
   download zero bytes for a backdrop they cannot see, and no JavaScript is needed
   to decide that — the theme attribute is already on <html> before first paint,
   set by the blocking script in app/layout.tsx.

   The cost is the srcset that next/image would have generated. For a fixed,
   full-viewport, purely decorative layer sitting behind an opaque-enough cap that
   detail is invisible anyway, a single 1920x1200 JPEG at ~95KB is the right trade.
   If that ever stops being true, the fix is a `image-set()` in globals.css, not a
   move to <Image> — the download-avoidance property is worth more than the srcset.

   CHOOSING THE DEFAULT
   --------------------
   Three frames ship (see public/artifacts/CREDITS.md). All three were rendered
   behind the real cap and looked at, not chosen from filenames:

     backdrop-tunnel   DEFAULT. A dark radial vignette with a soft glow at centre.
                       Effectively non-figurative — no subject, no horizon — and
                       the concentric wall texture gives the blur something to
                       refract, which is the point. The glow pooling behind the
                       middle of the plane is the characteristic look.
     backdrop-bokeh    Out-of-focus lights. Non-figurative too, but strongly
                       coloured: cream, red and green discs read through the plane
                       as coloured patches that argue with every status colour in
                       the product. Available, not default.
     backdrop-night    A storm over a city. Quietest and darkest by measurement,
                       and rejected as default on looking at it — it has a horizon
                       line and a lightning bolt, so it has a subject, and a
                       subject competes with the interface for the whole session.

   A workspace overrides the image by setting `--backdrop-image` on :root to any
   `url()`. It goes through the same cap, which is the point.
   ============================================================================ */

export function SpatialBackdrop() {
  return (
    <div
      aria-hidden
      data-spatial-backdrop
      /* z-(--z-ambient) is the same layer AmbientBackground occupies — they are
         alternatives, so they share a stacking slot rather than competing for one.
         `fixed` so the plane scrolls and the photograph does not, which is most of
         what makes the plane read as floating in front of something. */
      className="pointer-events-none fixed inset-0 z-(--z-ambient)"
    >
      {/* The photograph. Its background-image lives in globals.css, under the theme
          selector, so that this element is `display: none` — and therefore never
          triggers a fetch — for anyone not using this theme. */}
      <div className="spatial-backdrop-image absolute inset-0" />

      {/* THE CAP. Pure black at --backdrop-cap. Nothing else may go between this
          and the plane: anything added here changes the luminance ceiling that
          every ink token in the theme was measured against. */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: "var(--backdrop-cap, 0.4)" }}
      />
    </div>
  );
}
