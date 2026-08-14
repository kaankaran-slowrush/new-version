import Link from "next/link";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Spatial" };

const DocLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-accent-ink underline decoration-line-strong underline-offset-2"
  >
    {children}
  </Link>
);

export default function SpatialDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Foundations"
        title="Spatial"
        lede="The product's one design language. An edgeless ground over a photograph held under a measured luminance cap and defocused at 24px, with exactly one raised tier of cards on it. There were three themes; light and dim are deleted, data-theme is gone from every selector, and there is no toggle to look for. The name survives because the code still uses it — SpatialBackdrop, .spatial-backdrop-image, .spatial-ground, this route."
      />

      <DocSection
        title="The three rules"
        description="Rule 1 and rule 2 both changed, and both because they failed in the product rather than on paper. Rule 3 is the one that has now survived two passes."
      >
        <SpecTable
          columns={["Rule", "What it means", "Why"]}
          rows={[
            [
              "One ground, one raised tier on it",
              "The page sits IN the space rather than on a surface. A fixed, edgeless layer darkens the photograph; cards paint one step lighter than it — a 7% white alpha — and nothing paints a third time.",
              "CONTAINERS HAVE EDGES; GROUNDS DO NOT. The rule used to say 'one plane per view', which made the plane a container holding the whole document, and every page read as a sheet of paper on a desk. The one-tier half is untouched: stacked translucency multiplies, so two 0.72 fills composite to 0.92 effective and the inner one reads DARKER than its parent — the exact inversion of what elevation means.",
            ],
            [
              "Blur belongs to chrome, and to the photograph",
              "Eight elements in the product declare a backdrop-filter — the nav, the two session rails, the composer, the docs index, the session header and the two auth panels — and nothing else may. The page spends none of that budget. Its blur is a 24px `filter` on the image layer instead.",
              "A backdrop-filter needs a BOUNDARY, and each one is a compositor pass over its own bounds every frame. A nav pill can afford one because a nav pill IS an object. A page is not: blurring it meant inventing a boundary, and that boundary is what made the page a sheet. Moving the blur onto the photograph also says the true thing — far things are out of focus, near things are sharp.",
            ],
            [
              "Lift is a bevel and a contact shadow, never a blur",
              "--shadow-sm and --shadow-md lead with an inset specular hairline along the top inside face plus a tight contact shadow. lg and xl keep real blur.",
              "A drop shadow works by removing light, and at the ground's luminance of 0.038 there is almost none left to remove; any blur strong enough to see reads as dirt on the glass. lg/xl belong to things that genuinely float clear of the ground — chrome, dialogs, menus, popovers — where there IS separation for a shadow to describe.",
            ],
          ]}
        />

        <UXNote title="The hover step is the bevel brightening, 0.10 → 0.16">
          <p>
            Rule 3&apos;s first pass set <Code>--shadow-sm</Code> and{" "}
            <Code>--shadow-md</Code> to <Code>none</Code> outright, on the grounds that
            nothing could be elevated above a single plane. That is defensible right up
            until you notice that <strong>every hover affordance in the product went with
            them</strong> — <Code>Card</Code>&apos;s <Code>interactive</Code> variant
            hovers from <Code>shadow-sm</Code> to <Code>shadow-md</Code>, so it had
            nothing left to say.
          </p>
          <p>
            The fix is that the two tokens differ only in the strength of their specular
            top bevel: 0.10 at rest, 0.16 on hover, plus the 2px translate the variant
            already had. A fill change cannot do this job — hovering{" "}
            <Code>--color-surface</Code> (0.07) to <Code>--color-surface-hover</Code>{" "}
            (0.09) is a 1.03× move, which is invisible. A brighter line along the top edge
            is both readable and native to the material.
          </p>
          <p>
            <Code>--shadow-xs</Code> stays a ring (white at 0.10) because it is an edge
            rather than a lift, and because its consumers — StatTile <Code>panel</Code>,
            solid FilterPills, Accordion <Code>separated</Code> — carry no{" "}
            <Code>.panel-edge</Code>, so the ring is their only boundary.{" "}
            <Code>sm</Code> and <Code>md</Code> carry no ring, which is what preserves the
            no-doubled-edge rule: a ring under a border is the fastest way to make a UI
            look cheap.
          </p>
        </UXNote>

        <UXNote title="Rule 1 used to say cards paint nothing, and that shipped">
          <p>
            The old wording was &ldquo;one plane per view — cards paint nothing&rdquo;,
            and it was borrowed from a single-screen mockup where it looked disciplined.
            The product has <strong>fifteen grids and rails of peer cards</strong>. With
            nothing painting, three model cards side by side read as one wall of text:
            no object boundaries, so the eye had only the gaps to group by.
          </p>
          <p>
            It also broke the type system silently.{" "}
            <Code>components/patterns/section-header.tsx</Code> states the kit&apos;s
            doctrine as{" "}
            <em>
              &ldquo;the serif/sans boundary and the canvas/surface boundary are the same
              boundary&rdquo;
            </em>{" "}
            — above it you name a place, in the serif, on the canvas; below it you name a
            thing, in the sans, inside a surface. With no surface there was no boundary
            for it to be. Restoring a painted card tier is what makes the kit&apos;s own
            typographic contract true, which is a stronger argument for the tier than
            anything about how it looks.
          </p>
          <p>
            The card tier is also the reason removing the page panel cost nothing.{" "}
            <strong>
              The tier the eye needs is the one between a card and what is behind it
            </strong>
            , not the one between the document and the viewport — and the ground keeps
            the first while deleting the second.
          </p>
        </UXNote>

        <UXNote title="Card is not modified, and that is the point">
          <p>
            <Code>Card</Code> has 121 call sites and <strong>none of them changed</strong>{" "}
            — not when the card tier went transparent, not when it came back, and not when
            the page panel underneath it was deleted. Its fill, its border and its shadow
            all resolve through tokens, so the only thing that moved was the value of{" "}
            <Code>--color-surface</Code>: <Code>transparent</Code> in one release,{" "}
            <Code>oklch(100% 0 0 / 0.07)</Code> in this one. A component that survives its
            own surface being deleted and reinstated without a diff is the best evidence
            in the repo for the claim in{" "}
            <DocLink href="/docs/foundations/color">Color</DocLink> that retheming this
            product means remapping Layer 2 and nothing else.
          </p>
          <p>
            The same held for the neumorphic pair. <Code>.neu-inset</Code> and{" "}
            <Code>.neu-raised</Code> are referenced by Switch, Slider, SegmentedControl,
            Tabs and FilterPills; redefining the two utilities moved all five without a
            call site being edited.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The ground"
        description="What replaced the page plane. The same darkness with no shape — and 'the same' is arithmetic here rather than a figure of speech."
      >
        <p className="mb-6 max-w-measure text-ink-secondary">
          Every page used to be one rounded rectangle with a border, a radius and a lift,
          holding the whole document, with the photograph as the frame around it. It read
          as <strong>a sheet of paper on a desk</strong>. The cause was the rule this page
          itself documented: &ldquo;one plane per view&rdquo; made the plane a{" "}
          <em>container</em> when what a translucent language needs underneath text is a{" "}
          <em>ground</em>. Containers have edges; grounds do not. The ground has to be
          dark enough for text to survive on it — it does not have to have a boundary.
        </p>

        <p className="mb-6 max-w-measure text-ink-secondary">
          <strong>The equality is the whole trick.</strong> <Code>--ground-scrim</Code> is
          black at 0.64 over the already-capped backdrop, and it composites to luminance{" "}
          <strong>0.0383</strong>. The panel it replaced was <strong>0.0388</strong>. That
          is deliberate and load-bearing: the card tier, all eight ink levels, the groove
          and both edge tokens carry over with <em>no re-derivation</em>. The darkness did
          not change; its shape did. Which is also why{" "}
          <Code>--ground-scrim</Code> is not a taste knob — change it and every figure on
          this page has to be re-measured from rendered pixels.
        </p>

        <UXNote title="Fixed, because a scrolling gradient is a legibility bug">
          <p>
            <Code>.spatial-ground</Code> is the third layer inside{" "}
            <Code>SpatialBackdrop</Code>, which is <Code>fixed inset-0</Code>. That is
            what makes a gradient safe at all.{" "}
            <strong>
              Anything that scrolls can carry a paragraph through a lighter region
            </strong>
            , and text that is legible only at certain scroll positions is worse than
            text on a panel. A fixed layer cannot do that: a given pixel of the viewport
            has one ground luminance for the whole session.
          </p>
        </UXNote>

        <UXNote title="The feather is derived from the column, so the width and the margin are one decision">
          <p>
            The gradient is <Code>to right</Code> with four stops: transparent at the
            viewport edge, full <Code>--ground-scrim</Code> at{" "}
            <Code>calc(50% - var(--page-max-width) / 2)</Code> and again at{" "}
            <Code>calc(50% + var(--page-max-width) / 2)</Code>, transparent at 100%. So it
            is full strength across <em>exactly</em> the content column and feathers out
            only in the margins, and the reveal <strong>self-tunes</strong>: a wider
            screen gets a wider, softer band of photograph. Below the column&apos;s own
            width the two middle stops clamp and the ground goes uniform, which is what a
            phone should get.
          </p>
          <p>
            <Code>--page-max-width</Code> is therefore one number with two effects, and
            it went <strong>1180 → 1000 → 1440</strong>. The middle step is worth
            recording because it was wrong for a stated reason. At 1000 the ground
            feathered out to roughly 220px of photograph each side at 1440 and the space
            read beautifully; it also left every page looking squeezed into the middle of
            the display, which is a worse daily cost than a thin margin is a daily gain.
            A dashboard should fill the screen it is given.
          </p>
          <p>
            At <strong>90rem (1440px)</strong> the ground is uniform edge to edge on a
            laptop and the photograph survives as <strong>texture</strong> under
            everything rather than as a view beside it — the ground is a 0.64 scrim, not
            paint, so the image&apos;s colour and its large shapes still move underneath.
            And the mechanism scales by itself: at 1920 the feather reopens to 240px a
            side with no change to anything. Wide displays get the margin back; laptops
            get their width back.
          </p>
          <p>
            Line length is not at risk, which is the usual objection to a wide column.
            Every prose block is capped independently — <Code>headerSupportVariants</Code>{" "}
            carries <Code>max-w-measure</Code> (62ch), and FirstRun and the docs kit do
            the same. Only grids, rails and tables use the full width, and those are the
            things that wanted it.
          </p>
          <p>
            A gradient rather than a mask, because a mask would need its own compositing
            layer for no benefit.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Do not add a vertical gradient to the ground.</strong> It is the
            obvious next move — fade the top, pool the light at the bottom — and it is the
            one axis where this cannot work.
          </p>
          <p>
            A lighter band on the vertical axis is a region body text will{" "}
            <strong>scroll through</strong>. The horizontal axis has no such problem
            because content is centred: its horizontal position never changes, so a
            paragraph sits at exactly one place on the gradient forever. That asymmetry is
            the whole reason the feather is horizontal-only, and it is a property of how
            pages scroll rather than a stylistic preference.
          </p>
        </DontNote>

        <UXNote title="The blur moved onto the photograph, and that is a distinction rather than an optimisation">
          <p>
            <Code>--backdrop-blur: 24px</Code> is applied as a <Code>filter</Code> on{" "}
            <Code>.spatial-backdrop-image</Code>, not as a <Code>backdrop-filter</Code> on
            anything above it. Three reasons, and the first one is structural:{" "}
            <strong>
              a backdrop-filter needs a boundary, and the boundary is the thing this
              design removed
            </strong>
            . The blur used to live on a bordered panel; with the panel gone there is
            nothing to bound it.
          </p>
          <p>
            Second, it says the true thing. The photograph is far away, so it is out of
            focus; the cards are near, so they are sharp. That is how depth actually
            reads. Third, it is a static rasterisation rather than a per-frame compositor
            pass over the whole viewport, so the entire blur budget goes back to chrome.
          </p>
          <p>
            24px is bounded on both sides: below roughly 12px the backdrop&apos;s own
            structure still reads as lines through the margins, and above roughly 40px it
            is a flat wash and there was no reason to ship a photograph at all. The image
            layer also carries <Code>scale-105</Code>, which is required rather than
            decorative — <strong>a blur samples beyond its own box</strong>, so a blurred
            layer at <Code>inset-0</Code> fades out at all four viewport edges and you
            would watch the photograph go soft and pale into a border.
          </p>
        </UXNote>

        <UXNote title="The default backdrop changed, and the ground's shape is the reason">
          <p>
            <Code>backdrop-tunnel</Code> was swapped out for{" "}
            <Code>backdrop-bokeh</Code> and then swapped back. That looks like
            indecision and is not: the <strong>selection criterion inverted</strong> when
            the column widened, and the same image is right or wrong depending on which
            shape the ground has.
          </p>
          <p>
            While the column was narrow, the ground feathered out to a real band of
            photograph at each side, so what mattered was whether an image had light at
            its <strong>edges</strong>. A vignette is the worst possible shape for that —
            its interest is dead centre, exactly where the ground is strongest. Tunnel
            measured <strong>0.008 and 0.003</strong> in the left and right margins:
            effectively no photograph. Bokeh&apos;s spread light measured 0.042 and 0.028.
          </p>
          <p>
            At full width there are no margins to fill, so the image is texture under
            everything and the vignette becomes the <em>right</em> shape: its glow lifts
            the middle of the page, where the content is, and its corners recede. Bokeh
            under a uniform ground reads instead as four competing colour fields,
            including a red and a green large enough to argue with the status palette.
            One warm hue is quieter over a long session.
          </p>
          <p>
            Bokeh had previously been rejected, and the objection was real: its cream, red
            and green discs argued with the status palette. That applied when the
            photograph was a full-bleed ground behind everything. It now appears only in
            the margins, under the cap <em>and</em> a 24px defocus, at around 0.03
            luminance — soft colour fields, not shapes.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The verification"
        description="One measurement decides whether the complaint was addressed or merely softened, and it is not a screenshot."
      >
        <SpecTable
          columns={["Measurement", "Value", "What it settles"]}
          rows={[
            [
              "Largest single-step luminance change across the full viewport width",
              "0.003",
              "THERE IS NO EDGE ANYWHERE. A boundary is a step; sweeping the whole width and finding nothing above 0.003 is what says the sheet is gone rather than made subtler. This is the assertion to re-run if anyone touches the ground.",
            ],
            [
              "Ground under the content column",
              "0.0381 max",
              "The darkness text is actually read against, sampled across the full width. The panel it replaced derived to 0.0388 and the design target was 0.0383, so the shipped ground lands within half a percent of what every value in the system was solved against.",
            ],
            [
              "Ground, mean across the width",
              "0.0082",
              "Well below the maximum, because the vignette's corners fall away. The maximum is what the contrast figures are solved against; the mean is what the page mostly looks like.",
            ],
            [
              "Photograph in the margins",
              "n/a at 1440",
              "The column is 1440px, so at a 1440px viewport the ground is uniform and there is no margin to sample. At 1920 the feather reopens to 240px a side and this becomes a real measurement again — the reveal is a function of the display, not a fixed value.",
            ],
          ]}
        />

        <p className="mb-6 max-w-measure text-ink-secondary">
          The first row is the one that matters and it is worth saying why. The complaint
          was never &ldquo;the page is too bright&rdquo; or &ldquo;the radius is
          wrong&rdquo; — it was that the page had a <em>boundary</em>, and a boundary is
          visible as a step in luminance. Softening a border, lowering a lift or widening
          a radius all leave the step there and smaller.{" "}
          <strong>0.003 across the full width is the absence of the step</strong>, not a
          quieter version of it, and it is the only figure on this page that can
          distinguish the two.
        </p>
      </DocSection>

      <DocSection
        title="The backdrop cap"
        description="The one number the whole language rests on, and the reason legibility can be promised over an image the system has never seen."
      >
        <p className="mb-6 max-w-measure text-ink-secondary">
          A photograph has no contrast guarantee. This language does not ask for one — it
          imposes one. <Code>--backdrop-cap</Code> is a black layer over the image at 0.40
          opacity, which pins the brightest pixel <em>any</em> image can produce to 0.22
          luminance. The ground&apos;s scrim and the card&apos;s alpha above it are both
          solved against that ceiling, and every ink value in the system was measured
          against the result. Nothing may come between the cap and the photograph.
        </p>

        <SpecTable
          columns={["Token", "Value", "What it does"]}
          rows={[
            ["--backdrop-cap", "0.40", "Black over the photograph. Pins peak luminance to 0.22."],
            [
              "--ground-scrim",
              "oklch(0% 0 0 / 0.64)",
              "THE GROUND. Black over the capped backdrop, feathered out horizontally to nothing at the viewport edge. Composites to 0.0383 against the panel's 0.0388, which is why nothing below it had to be re-derived.",
            ],
            [
              "--backdrop-blur",
              "24px",
              "Depth of field, as a `filter` on the image layer rather than a `backdrop-filter` on anything above it. Below ~12px the backdrop's structure still reads as lines in the margins; above ~40px it is a flat wash.",
            ],
            [
              "--page-max-width",
              "90rem",
              "1440px. The content column AND the ground's feather, because the gradient's middle stops are calc(50% -/+ half of this). One decision, one number — widen the column and the reveal closes, narrow it and the reveal opens.",
            ],
            [
              "--plane-fill",
              "oklch(18% 0.012 255 / 0.72)",
              "THE CHROME MATERIAL, not a page surface. The nav, the two session rails, the composer, the docs index, the session header, both auth panels and `.glass` itself. The name is kept because `.glass` and every overlay already read it and renaming is churn.",
            ],
            [
              "--plane-blur",
              "40px",
              "One per chrome element, and chrome is the only thing licensed to spend it. Everything inside a blurred element is forbidden from blurring again.",
            ],
            ["--plane-saturate", "165%", "Blur averages colour and therefore desaturates it; this puts it back."],
            [
              "--plane-edge",
              "var(--border-width-panel) solid var(--color-line)",
              "The same 1px hairline a card gets. A translucent fill has no boundary of its own — which is precisely why a page must not have one.",
            ],
            [
              "--plane-lift",
              "0 32px 72px -24px",
              "The one place a large blur is still right: chrome genuinely floats clear of the ground, so there is separation for a shadow to describe.",
            ],
            ["--backdrop-image", "url(...)", "Workspace override. Goes through the same cap, which is what makes it safe."],
          ]}
        />

        <DontNote>
          <p>
            <strong>
              Do not derive the cap by subtracting from 1. CSS composites in gamma space.
            </strong>{" "}
            This token was first written as <Code>0.78</Code>, from 1 − 0.22, as if
            opacity scaled luminance directly. It does not: a peak-white pixel under a
            0.78 black overlay renders at sRGB 0.220, whose luminance is{" "}
            <strong>0.0397 — not 0.22</strong>. Off by 5.5×. That value crushes the
            photograph to a near-black field, and every contrast figure derived from it is
            wrong in the flattering direction.
          </p>
          <p>
            The conversion runs through the transfer function:{" "}
            <Code>cap = 1 − encode(target_luminance)</Code>, which gives 0.40. The same
            correction applies to every composite in the ladder below —{" "}
            <Code>alpha × fg + (1−alpha) × bg</Code> is only valid on encoded values, per
            channel, and <Code>--ground-scrim</Code> is no exception.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="The surface ladder"
        description="Six values, and not one of them is a colour until you know what is behind it. Derived over the worst case — a peak-white pixel in the backdrop, which the shipped photograph genuinely contains."
      >
        <SpecTable
          columns={["Tier", "Token", "Luminance", "Against the ground"]}
          rows={[
            ["backdrop, capped", "--backdrop-cap: 0.40", "0.3185", "The ceiling everything below is solved against."],
            [
              "ground",
              "--ground-scrim",
              "0.0383 (0.0381 sampled)",
              "No tier above it and no edge around it. The derived figure is over a peak-white pixel; 0.0381 is the maximum the shipped photograph actually produces.",
            ],
            ["card", "--color-surface", "0.0602", "1.24×  (1.27× sampled)"],
            ["card edge", "--color-line", "0.0873", "1.55× — and see the padding-box note below for why it is not 1.25×."],
            ["sunken", "--color-surface-sunken", "0.0318", "Below the ground, deliberately. The card is 1.35× it (1.34× sampled)."],
            ["overlay", "--color-surface-solid", "0.0114", "Not a tier. It occludes — see below."],
          ]}
        />

        <p className="mb-6 max-w-measure text-ink-secondary">
          <strong>Not one value in this table moved when the plane became the ground</strong>,
          and that is the point of holding 0.0383 against 0.0388 rather than picking a
          scrim that looked right. The multipliers are contrast ratios in the WCAG form,
          so they sit on the same scale as every figure in the next section.{" "}
          <strong>Roughly 1.10× is where two large adjacent fills stop reading as
          separate</strong>, which is the floor the card tier had to clear. RAISED IS
          LIGHTER, INSET IS DARKER: that sentence is the whole elevation system here, and
          it is why <Code>sunken</Code> sits below the ground rather than above it. A
          groove and a card must never be confusable, and lightness is the only channel
          doing that work.
        </p>

        <UXNote title="The separations were sampled from rendered pixels, not recomputed">
          <p>
            Predicting a composite and then re-deriving it with the same formula proves
            nothing — it only proves the formula is consistent with itself. These two were
            read off the running product: <strong>card against ground 1.27×</strong>{" "}
            against a predicted 1.24, and <strong>card against sunken 1.34×</strong>{" "}
            against a predicted 1.35. Agreement inside 0.03 is the check that the
            compositing model in <Code>styles/tokens.css</Code> describes what the GPU
            actually paints, including its own gamma handling.
          </p>
          <p>
            1.27× is a real but quiet step, and that is the intent. A card here is a
            surface, not a box — and with no page panel left, it is now the only edge on
            the page.
          </p>
        </UXNote>

        <UXNote title="The edge composites over the ground, not over the card">
          <p>
            <Code>.panel-edge</Code> sets <Code>background-clip: padding-box</Code>, so a
            card&apos;s alpha fill does not paint underneath its own border. The 14% edge
            therefore lands on the <em>ground</em>, not on the card, which is why it reads
            at 1.55× rather than the 1.25× you get by compositing it over the card&apos;s
            own fill. <strong>Remove the clip and the edge dilutes by a third</strong> —
            silently, since the border is still &ldquo;there&rdquo; in devtools at the
            value you wrote.
          </p>
          <p>
            This matters more here than it would on an opaque ground: with no drop shadow
            available, the edge is most of what says &ldquo;object&rdquo;.
          </p>
        </UXNote>

        <UXNote title="--border-width-panel moved 1.5px → 1px">
          <p>
            The 1.5px value was justified in the file itself, explicitly, by light mode:{" "}
            <em>
              &ldquo;at 1px a border on a white card reads as a rendering artefact&rdquo;
            </em>
            . That is true of a dark hairline on white. It does not transfer to a white
            hairline on dark glass, where the same 1.5px reads heavy and turns a grid of
            cards into a wireframe of itself. The value moved with the ground it
            describes; internal dividers stay at 1px with{" "}
            <Code>--color-line-inner</Code>.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Measured contrast"
        description="Measured ON THE CARD, which is the worst ground for most text: the card is 1.24× lighter than the ground beneath it, so every figure on the bare ground is higher by exactly that. The card is the only surface worth quoting."
      >
        <SpecTable
          columns={["Token", "Value", "On the card", "Note"]}
          rows={[
            ["--color-ink", "oklch(97% 0.006 255)", "8.74:1", "Body and headings. 15.68:1 on an overlay."],
            ["--color-ink-secondary", "oklch(86% 0.010 255)", "6.23:1", "Supporting copy."],
            [
              "--color-ink-tertiary",
              "oklch(80% 0.012 255)",
              "5.10:1",
              "THE BINDING CONSTRAINT. The ground's scrim and the card's alpha were both solved against this level rather than against --color-ink: it is where real information lives, and it is the first to fail as either tier lightens. Above roughly 0.08 on the card it does.",
            ],
            [
              "--color-ink-muted",
              "oklch(62% 0.014 255)",
              "2.62:1",
              "Placeholder and disabled ONLY, and exempt on both counts. Do not fix this value — a disabled control that reads at full contrast is not disabled. The rule that makes it safe is absolute: no information may live only in muted.",
            ],
            ["--color-accent", "oklch(82% 0.105 224)", "5.60:1", "Links, selection, interactive text."],
            ["--color-success", "oklch(82% 0.125 150)", "5.72:1", ""],
            ["--color-warning", "oklch(87% 0.115 70)", "6.22:1", ""],
            ["--color-danger", "oklch(83% 0.130 25)", "5.04:1", "As TEXT. As a fill it needs --color-danger-text on top of it — see the inversions below."],
          ]}
        />

        <UXNote title="What the shipped photograph actually delivers, sampled">
          <p>
            The column above is the <strong>promise</strong>: every value derived over a
            peak-white backdrop pixel, which is the worst case the cap permits. Sampled
            from rendered pixels instead — over the shipped frame, whose ground averages
            0.0082 and peaks at 0.0381 rather than sitting at the worst case
            everywhere — the same eight levels on a card read{" "}
            <strong>
              ink 12.1 · secondary 8.2 · tertiary 6.0 · muted 2.7 · accent 6.3 · success
              8.1 · warning 9.5 · danger 8.1
            </strong>
            .
          </p>
          <p>
            <strong>Every real-text level clears 4.5:1 in both columns</strong>, muted
            excepted and exempt. Quote the derived column, because it is the one that
            holds for a workspace that supplies its own photograph; the sampled column is
            only evidence that the arithmetic is pessimistic in the right direction.
          </p>
        </UXNote>

        <UXNote title="Media is the one surface with no cap">
          <p>
            The cap applies to the backdrop, not to content. A photograph inside a model
            card is real output sitting <em>above</em> the ground and it can contain a
            blown-out white pixel — the models grid does. The card tier is no help there:
            a 7% white alpha over a blown-out pixel is not a surface, it is the pixel. So{" "}
            <Code>--color-chip-over-media</Code> and{" "}
            <Code>--color-control-over-media</Code> exist for labels and controls that sit
            directly on media, and they are measured against pure white rather than
            against the cap: 10.6:1 for the chip.
          </p>
          <p>
            <Code>[data-media-frame]</Code> is the other half of the same problem. The
            card&apos;s own fill is not strong enough to bound a full-bleed image, so a
            16:9 frame would read as pasted onto the card rather than set into it. An
            inset 12% hairline fixes it without changing the frame&apos;s box, which is
            what keeps it safe across ProceduralCover and the two session media frames.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The tokens the raised tier needed"
        description="Five new semantic tokens. Each exists because a value that was correct against a transparent card is wrong against a painted one, or because a fill inverted when the ground did."
      >
        <SpecTable
          columns={["Token", "Value", "Why it exists"]}
          rows={[
            [
              "--color-surface-solid",
              "oklch(16% 0.012 255 / 0.94)",
              "Occlusion, not elevation. Every tier in the ladder is legible because --backdrop-cap imposes a worst case; nothing imposes anything behind a dropdown.",
            ],
            [
              "--color-surface-raised-hover",
              "oklch(100% 0 0 / 0.14)",
              "For a control that ALREADY paints the card tier. `hover:bg-*` REPLACES a fill rather than overlaying it, so a secondary Button hovering to the transparent-at-rest token goes 0.07 → 0.09: a 1.03× move, i.e. no hover. The other role — ghost buttons, table rows — is correctly tuned at 0.09, and one token cannot serve both.",
            ],
            [
              "--color-surface-disabled",
              "transparent",
              "With a RAISED tier, painting a disabled control `bg-surface` would make it brighter than an enabled one — in a language where raised means interactive, exactly backwards. Flat means flat.",
            ],
            [
              "--color-scrim-dialog",
              "oklch(0% 0 0 / 0.55)",
              "The dialog scrim, which used to be written inline as `bg-ink/35`. See the inversions below.",
            ],
            [
              "--color-danger-text",
              "oklch(18% 0.01 25)",
              "Text ON the danger fill. A fill token and its label token have to move together; --color-accent-text already existed for exactly this reason and this is its missing sibling.",
            ],
          ]}
        />
      </DocSection>

      <DocSection
        title="Overlays occlude; they are not another tier of glass"
        description="Dialog, popover, dropdown-menu, select and tooltip all paint --color-surface-solid at 0.94, and none of them carries a backdrop-filter."
      >
        <p className="mb-6 max-w-measure text-ink-secondary">
          There are two reasons and the second one settles it. First, rule 1 forbids
          stacked translucency, and a translucent overlay over translucent chrome is
          exactly that. Second — and this is the part worth remembering —{" "}
          <strong>blurring an already-blurred field buys nothing</strong>. Everything
          behind an overlay is either the backdrop, which was rasterised at 24px before it
          ever reached the compositor, or product content, which is the thing an overlay
          exists to <em>hide</em> rather than to soften. Rule 2 was written about
          performance; here it turns out to be an argument about appearance as well.
        </p>

        <UXNote title="What an overlay actually needs is the guarantee the ground has">
          <p>
            The whole ladder is legible because <Code>--backdrop-cap</Code> imposes a
            worst case behind it. <strong>Nothing imposes anything behind a dropdown.</strong>{" "}
            A menu can open over generated media, over a bright photograph, over another
            menu — so it cannot be translucent at any value and still carry a promise. At
            0.94 the worst-case reasoning stops being necessary: ink lands at 15.68:1
            regardless of what is underneath.
          </p>
          <p>
            It still reads as part of the same material, because glass reads through its
            bevel, its hairline and its lift rather than through being see-through. That
            is also why <Code>dialog.tsx</Code> gained a <Code>.panel-edge</Code> — it was
            the only overlay without one, and once the fill stopped being translucent the
            edge was the only thing left describing its boundary.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Three inversions, all the same shape"
        description="A value that was correct on a light ground and became its own opposite on a dark one. None of the three threw an error, and none of them is greppable as a class — this is the failure mode of this kind of migration, so it is recorded rather than quietly fixed."
      >
        <SpecTable
          columns={["Was", "What it did on this ground", "Now"]}
          rows={[
            [
              "bg-ink/35 — the dialog scrim",
              "`ink` is near-white here, so every modal painted a NEAR-WHITE 35% wash over the whole viewport. A scrim whose job is to push the page back was pulling it forward.",
              "--color-scrim-dialog, black at 0.55. Its backdrop-blur-[2px] went too: a full-viewport compositor pass every frame, over a field whose only high-frequency detail is a photograph already defocused at 24px. The most expensive no-op available.",
            ],
            [
              "bg-danger text-white — the danger Button",
              "--color-danger is a LIGHT salmon here, so white on it measured 1.89:1. The destructive confirmation button was the least legible control in the product.",
              "--color-danger-text on the same fill: 9.9:1.",
            ],
            [
              "bg-ink-muted — a disabled primary Button",
              "Luminance 0.2386 — brighter than the card AND brighter than the ground, so a disabled Run button was the single brightest object on the page.",
              "The card tier with a muted label. Flat, quiet, and unmistakably not pressable.",
            ],
          ]}
        />
      </DocSection>

      <DocSection
        title="The cascade trap"
        description="Why collapsing three themes into one removed a class of bug rather than patching instances of it."
      >
        <p className="mb-6 max-w-measure text-ink-secondary">
          The old theme block was <strong>unlayered</strong>, deliberately, so that it
          could beat Tailwind&apos;s utilities. That is what made{" "}
          <Code>{'[data-theme="spatial"] .panel-edge { border-color: transparent }'}</Code>{" "}
          outrank every call site in the product.{" "}
          <Code>app/(app)/models/showroom-view.tsx:106</Code> writes{" "}
          <Code>border border-accent/25</Code> on a card, and it silently never painted:
          no error, no warning, and nothing to grep for, because the call site is correct
          and the thing beating it is three files away.
        </p>
        <p className="mb-6 max-w-measure text-ink-secondary">
          Layering the block would have inverted the problem rather than fixed it — it
          would then lose to every utility, including the ones the theme existed to
          override. There was no correct layer for it.
        </p>

        <DontNote>
          <p>
            <strong>
              A theme override that redeclares a CUSTOM PROPERTY is always safe. A theme
              override that overrides a PROPERTY is a trap.
            </strong>
          </p>
          <p>
            <Code>{":root[data-theme=X] { --color-line: … }"}</Code> composes with
            everything: call sites keep winning, and the value they win with is the
            theme&apos;s. <Code>{":root[data-theme=X] .foo { border-color: … }"}</Code>{" "}
            has no good home at any layer. If you are reaching for the second form, the
            token you need does not exist yet.
          </p>
        </DontNote>

        <UXNote title="The card edge came back by DELETING a rule">
          <p>
            Not by adding a token, not by raising a specificity — the fix was removing the
            property override, at which point <Code>--color-line</Code> was already
            correct and <Code>border-accent/25</Code> started painting on its own. With
            one language there are <strong>no property overrides left</strong> in the
            system, which is a stronger guarantee than having fixed the three that
            existed.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="There is nothing to opt into"
        description="The whole data-plane attribute system is deleted. What replaced it is the ground, a layout the routes already carried, and a short list of things that genuinely float."
      >
        <SpecTable
          columns={["Was", "Now", "Why"]}
          rows={[
            [
              "[data-plane-scope] > main — set once in app/(app)/layout.tsx",
              "Nothing. The twelve product routes use the layout they already had: `mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8`.",
              "Content is not ON anything any more; it is in the space, and the space is dark enough to read against. A scope marker only existed to hand a surface to elements that turned out not to want one.",
            ],
            [
              "data-plane — the docs content column",
              "Nothing. The column is bare against the ground.",
              "The default variant gave it a fill, a blur, an edge, a radius and a lift. All five together are what made a document read as an object.",
            ],
            [
              'data-plane="bar" — the session header',
              "`.glass`, with rounded-none, no side or top border, and a bottom hairline.",
              "A CORRECTION, not a workaround. It is persistent navigation you jump around in, which is exactly what glass is licensed for. It keeps the fill, the blur and the bevel — the parts that make it the same material as the nav above it.",
            ],
            [
              'data-plane="rail" — the docs index',
              "`.glass`, sticky, at radius-2xl.",
              "Same argument, plus one only the ground can make: the index sits near the viewport edge, exactly where the ground is feathering out into photograph, so it cannot borrow the ground's contrast and needs its own material.",
            ],
            [
              'data-plane="padded" — the 404 block, the session canvas column',
              "Nothing.",
              "It existed for elements that had no padding of their own because they had never been surfaces. With no page surface, the question does not arise.",
            ],
            [
              "data-media-frame",
              "Unchanged.",
              "An inset hairline, so a photograph reads as set into the card rather than pasted onto it. A card-level concern that the ground never touched.",
            ],
          ]}
        />

        <UXNote title="The two shells that made the scope marker necessary are the two the ground fixed for free">
          <p>
            A page surface could never simply target <Code>main</Code>, because two of the
            four shells would break: /docs renders its main as a flex child beside a
            persistent index, and the 404 renders it as a <Code>min-h-dvh</Code> centring
            grid — a plane on either would have been a full-viewport panel with the
            content floating in the middle of it. That is what the scope marker was for.
          </p>
          <p>
            <strong>
              The ground fixed both by not being an element either of them contains.
            </strong>{" "}
            It is a fixed layer behind everything, so it does not care what shape a{" "}
            <Code>main</Code> is. Both auth pages needed nothing before and need nothing
            now: they render a <Code>GlassPanel</Code>, and <Code>.glass</Code> is the
            chrome material, which is what an auth card always was.
          </p>
        </UXNote>

        <UXNote title="The nesting guard is gone, and the claim it rested on was false">
          <p>
            This page used to say that ten product routes nest a Card inside a Card and
            that <Code>/platform/run-history</Code> nests four deep, and it justified a
            padding-zeroing rule with that. Neither number survived measurement. A DOM
            query across every route says{" "}
            <strong>
              no route nests a <Code>.panel-edge</Code> inside a{" "}
              <Code>.panel-edge</Code>, at any depth, not one
            </strong>
            . The components that appear to
            nest render their <Code>plain</Code> variants — StatTile, DataTable, Toolbar
            and ErrorState all default to <Code>surface: &quot;plain&quot;</Code>, which
            carries no edge and no fill. They are peers inside one card, not surfaces
            inside a surface.
          </p>
          <p>
            So the guard was deleted, because it never fired. The invariant is still
            real — <strong>one raised tier on the ground</strong> — and it is what keeps
            elevation from inverting if someone builds the case. But nothing in the
            product currently tests it, and a rule that fires nowhere is a rule nobody can
            verify.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The two accessibility modes"
        description="Not themes and not escape hatches. Translucency IS this language, so a user who has switched it off is not asking for a flatter version of the product — they are asking for a different rendering of it, and it has to stand on its own."
      >
        <SpecTable
          columns={["Query", "What happens", "Why it does not fall back to a light theme"]}
          rows={[
            [
              "prefers-contrast: more",
              "--backdrop-cap goes to 1 and [data-spatial-backdrop] is display:none, which takes the photograph, the cap AND the ground together — they are one element — leaving --color-canvas as the page ground at 0.0139: opaque, and darker than the 0.0383 it replaces, so every figure on this page improves rather than degrades. Chrome goes opaque: `.glass` paints --color-surface-solid at 18% L with --color-border-contrast as its edge, --plane-blur goes to 0 and the rule sets backdrop-filter: none besides. The card tier goes opaque at 28% L, lines strengthen, and every ink level moves FURTHER from its ground.",
              "The ink tokens are what make this language dark, and they are not what the query switches off. Handing it light surfaces would leave near-white ink on near-white cards.",
            ],
            [
              "prefers-reduced-transparency: reduce",
              "Same destination, different reason: `.glass` goes opaque and unblurred on the same --color-surface-solid, the card tier goes opaque at 28% L, the photograph is neither shown nor downloaded, and the shadow tokens stop being bevels and become blurs again.",
              "Elevation has to come from somewhere. With no translucency doing the separating, a blur is the only mechanism left — which is why lifting rule 3 here is correct rather than inconsistent.",
            ],
          ]}
        />

        <p className="mb-6 max-w-measure text-ink-secondary">
          Values live in two <Code>:root</Code> blocks in{" "}
          <Code>styles/tokens.css</Code>; the handful of places where a component&apos;s
          structure rather than its colour changes live under the same two queries in{" "}
          <Code>app/globals.css</Code>. Keeping the split means there is exactly one file
          to read to know what a mode looks like. See{" "}
          <DocLink href="/docs/foundations/accessibility">Accessibility</DocLink> for the
          rest.
        </p>

        <UXNote title="Asking for more contrast used to reduce it">
          <p>
            The obvious implementation of a high-contrast block pushes ink toward a mid
            grey, and on a light ground that is right. On a dark ground it moves ink{" "}
            <em>closer</em> to its own background. That shipped once and had to be fixed:
            here every level in the query moves away from the ground —{" "}
            <Code>ink-tertiary</Code> from 80% to 88% L, <Code>ink-muted</Code> from 62%
            to 76% — while the surfaces go opaque underneath them.
          </p>
        </UXNote>

        <UXNote title="The photograph is not downloaded when it is not shown">
          <p>
            The image is a CSS <Code>background-image</Code> rather than an{" "}
            <Code>{"<Image>"}</Code>, and a browser does not fetch the background of an
            element whose computed <Code>display</Code> is <Code>none</Code>. Both modes
            hide <Code>[data-spatial-backdrop]</Code>, so a user who has asked not to see
            the backdrop pays <strong>zero bytes</strong> for it rather than downloading
            ~95KB to hide it. An <Code>{"<img>"}</Code> inside a hidden subtree is
            generally still fetched, which is the whole reason for the choice.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The honest objection"
        description="Recorded rather than resolved, because it has not gone away — and collapsing to one language makes it more pointed, not less."
      >
        <DontNote>
          <p>
            <strong>
              Low-contrast light-on-glass is tiring in a tool people sit in for hours.
            </strong>{" "}
            The kit&apos;s original boundary — glass for chrome, opaque for content — was
            there for that reason. Half of it came back with the ground: chrome is once
            again the only thing in the product made of glass. The other half did not.
            Content is still light ink on a dark, atmospheric ground, and when this was one
            theme of three a user who found that tiring could switch. There is no switch
            now: this is the product, and the only other renderings are the two
            accessibility modes, which are opaque dark rather than a light theme.
          </p>
          <p>
            What the language does not do is pretend the cost away. The cap exists
            precisely because &ldquo;usually legible over a photograph&rdquo; is not a
            promise a design system can make, and every quoted number on this page is a
            worst case rather than a typical one: derived over a peak-white pixel the
            shipped image actually contains, on the card rather than on the ground, and
            checked against rendered pixels wherever it could be. If the objection is ever
            going to win, it should win against the real numbers.
          </p>
        </DontNote>
      </DocSection>
    </>
  );
}
