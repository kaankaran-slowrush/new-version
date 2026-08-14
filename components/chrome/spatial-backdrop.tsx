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

     backdrop-tunnel   DEFAULT. A dark radial vignette, warm, with a soft glow at
                       its centre and corners that fall away.

                       IT WAS SWAPPED OUT AND SWAPPED BACK, and the reason is worth
                       recording because it looks like indecision and is not: the
                       SELECTION CRITERION INVERTED when the content column widened.

                       While the column was narrow, the ground feathered out to a
                       real band of photograph at each side, so what mattered was
                       whether an image had light at its EDGES. A vignette is the
                       worst possible shape for that — its interest is dead centre,
                       exactly where the ground is strongest, so it measured 0.008
                       and 0.003 in the margins. Effectively no photograph.

                       At full width the ground is uniform and there are no margins
                       to fill, so the image is TEXTURE under everything rather than
                       a view beside it. Now the vignette is the right shape: the
                       glow lifts the middle of the page, where the content is, and
                       the corners recede. One warm hue, quiet over a long session.
     backdrop-bokeh    Out-of-focus lights, and the default while the column was
                       narrow — its light is spread, which is what the margins
                       needed. Under a uniform ground the same spread reads as four
                       competing colour fields, including a red and a green large
                       enough to argue with the status palette.
     backdrop-night    A storm over a city. Rejected on looking at it — it has a
                       horizon line and a lightning bolt, so it has a subject, and a
                       subject competes with the interface for the whole session.

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
      /* `fixed`, and this is the whole reason the ground can be a gradient at all.
         Anything that scrolls can carry a paragraph through a lighter region; a
         fixed layer cannot. See the ground note below. */
      className="pointer-events-none fixed inset-0 z-(--z-ambient)"
    >
      {/* 1 · THE PHOTOGRAPH, out of focus. The blur is on the image itself rather
             than a `backdrop-filter` on the content above it, and that is a real
             distinction rather than an optimisation:

             • A backdrop-filter needs a BOUNDARY, and a boundary is exactly the
               thing this design is removing. The blur used to live on a bordered
               panel; with the panel gone there is nothing to bound it.
             • It says the true thing. The photograph is far away, so it is out of
               focus. The cards are near, so they are sharp. That is how depth
               actually reads, and it is why this is not just a cheaper blur.
             • It costs less: a static rasterisation once, rather than a compositor
               pass every frame over the whole viewport.

             `scale-105` is required, not decorative. A blur samples beyond the
             element's own box, so a blurred layer at `inset-0` fades out at all
             four viewport edges — you would see the photograph go soft and pale
             into a border. Overscaling pushes that falloff off-screen. */}
      <div className="spatial-backdrop-image absolute inset-0 scale-105" />

      {/* 2 · THE CAP. Pure black at --backdrop-cap. Nothing may go between this and
             the photograph: it is what pins any image's brightest pixel to 0.22
             luminance, and every value in the system was measured against that
             ceiling. */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: "var(--backdrop-cap, 0.4)" }}
      />

      {/* 3 · THE GROUND — what replaced the page panel.
             ------------------------------------------------------------------
             THE PROBLEM IT SOLVES. Content used to sit on a rounded, bordered,
             lifted panel inset from the viewport. That is a CONTAINER, and a
             container has edges, so the page read as a sheet of paper on a desk
             with the photograph as the mat around it. The ground has to be dark
             for text to work — but it does not have to have a boundary.

             IT IS EXACTLY AS DARK AS THE PANEL WAS. 0.64 black over the capped
             backdrop composites to luminance 0.0383; the panel was 0.0388. That
             equality is deliberate and load-bearing: it means the card tier, all
             eight ink levels, the groove and both edge tokens carry over with no
             re-derivation. The darkness did not change. Its shape did.

             HORIZONTAL FEATHER ONLY, and the stops come from the content column
             rather than from taste — full strength across exactly the column,
             fading to nothing at the viewport edge. So the reveal self-tunes: a
             wider screen gets a wider, softer band of photograph, and below the
             column's own width the stops clamp and the ground goes uniform, which
             is what a phone should get.

             NO VERTICAL GRADIENT, deliberately. A lighter band anywhere on the
             vertical axis is a region that body text will scroll through, and text
             that is legible only at certain scroll positions is worse than text on
             a panel. The horizontal axis has no such problem: content is centred,
             so its horizontal position never changes. */}
      <div className="spatial-ground absolute inset-0" />
    </div>
  );
}
