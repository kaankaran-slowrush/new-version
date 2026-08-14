/* SpatialBackdrop — the photograph the product's planes float on.
   ============================================================================

   WHY A DESIGN SYSTEM THAT OTHERWISE REFUSES TO DEPEND ON IMAGES SHIPS ONE.
   Because this language is not "a dark theme with translucency" — translucency
   needs something behind it that rewards being seen through. A blurred plane over
   a flat fill is just a slightly different flat fill. The photograph is what makes
   the blur mean anything.

   THE CAP IS THE WHOLE CONTRACT
   ----------------------------
   A photograph has no contrast guarantee. This component does not ask for one, it
   imposes one: a black layer at `--backdrop-cap` opacity over the image, which
   pins the brightest pixel any image can produce to 0.22 luminance. Every ink and
   surface value in the system was then measured against the plane, and the card
   tier above it, composited over exactly that ceiling — see the ladder in
   styles/tokens.css.

   That is the only way to promise legibility over an image the system has never
   seen, which matters because a workspace is meant to be able to supply its own
   (see `--backdrop-image` below). Without the cap, "legible" would depend on the
   customer's choice of wallpaper.

   The cap value is NOT `1 - 0.22`. CSS opacity blends encoded sRGB, not linear
   light, so the conversion runs through the transfer function and lands on 0.40.
   Writing 0.78 there — as this component first did — crushes the photograph to a
   near-black field and makes every contrast figure derived from it wrong in the
   flattering direction. tokens.css carries the full warning.

   NO next/image, DELIBERATELY
   ---------------------------
   The image is a CSS `background-image`, not an <Image>, and that is what makes the
   accessibility modes free: a browser does not fetch the background of an element
   whose computed `display` is `none`, so a user with `prefers-reduced-transparency`
   downloads zero bytes for a backdrop they have asked not to see. An <img> inside a
   hidden subtree is generally still fetched.

   The cost is the srcset next/image would have generated. For a fixed,
   full-viewport, purely decorative layer sitting behind a cap that hides detail
   anyway, a single 1920x1200 JPEG at ~95KB is the right trade. If that stops being
   true the fix is an `image-set()` in globals.css, not a move to <Image>.

   CHOOSING THE DEFAULT
   --------------------
   Three frames ship (see public/artifacts/CREDITS.md). All three were rendered
   behind the real cap and looked at, not chosen from filenames:

     backdrop-tunnel   DEFAULT. A dark radial vignette with a soft glow at centre.
                       Effectively non-figurative — no subject, no horizon — and the
                       concentric wall texture gives the blur something to refract,
                       which is the point. The glow pooling behind the middle of the
                       plane is the characteristic look.
     backdrop-bokeh    Out-of-focus lights. Non-figurative too, but strongly
                       coloured: cream, red and green discs read through the plane as
                       coloured patches that argue with every status colour in the
                       product. Available, not default.
     backdrop-night    A storm over a city. Quietest and darkest by measurement, and
                       rejected on looking at it — it has a horizon line and a
                       lightning bolt, so it has a subject, and a subject competes
                       with the interface for the whole session.

   A workspace overrides the image by setting `--backdrop-image` on :root to any
   `url()`. It goes through the same cap, which is the point.
   ============================================================================ */

export function SpatialBackdrop() {
  return (
    <div
      aria-hidden
      /* `data-spatial-backdrop` is the hook the two accessibility modes hide this
         through — which is also what cancels its download. See globals.css. */
      data-spatial-backdrop
      /* `fixed` so the plane scrolls and the photograph does not, which is most of
         what makes the plane read as floating in front of something. */
      className="pointer-events-none fixed inset-0 z-(--z-ambient)"
    >
      {/* The photograph. Its background-image lives in globals.css rather than
          here, so that hiding this element in the accessibility modes also prevents
          the fetch. */}
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
