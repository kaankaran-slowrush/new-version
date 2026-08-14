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
        lede="The product's one design language. A single translucent plane over a photograph held under a measured luminance cap, with exactly one raised tier of cards on it. There were three themes; light and dim are deleted, data-theme is gone from every selector, and there is no toggle to look for. The name survives because the code still uses it — SpatialBackdrop, .spatial-backdrop-image, this route."
      />

      <DocSection
        title="The three rules"
        description="Rule 1 changed and rule 3 changed, both because they failed in the product rather than on paper. Rule 2 is untouched, and it is now doing more work than either."
      >
        <SpecTable
          columns={["Rule", "What it means", "Why"]}
          rows={[
            [
              "One plane per view, one raised tier on it",
              "The page sits on a single translucent panel. Cards paint one step lighter on it — a 7% white alpha — and nothing paints a third time.",
              "Stacked translucency multiplies: two 0.72 planes composite to 0.92 effective, so the inner one reads DARKER than its parent, which is the exact inversion of what elevation means. One raised tier is the most you can have before that starts.",
            ],
            [
              "One blur per plane",
              "Children never carry their own backdrop-filter. The plane blurs; everything inside it is opaque, an alpha fill, or nothing.",
              "Each backdrop-filter is a separate compositor pass over its own bounds. It is also the argument that settles how overlays are built — blurring a field the plane has already blurred at 40px costs a full pass and returns a visually identical result.",
            ],
            [
              "Lift is a bevel and a contact shadow, never a blur",
              "--shadow-sm and --shadow-md lead with an inset specular hairline along the top inside face plus a tight contact shadow. lg and xl keep real blur.",
              "A drop shadow works by removing light, and at the plane's luminance of 0.039 there is almost none left to remove; any blur strong enough to see reads as dirt on the glass. lg/xl belong to things that genuinely float clear of the plane — dialogs, menus, popovers — where there IS separation for a shadow to describe.",
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
        </UXNote>

        <UXNote title="Card is not modified, and that is the point">
          <p>
            <Code>Card</Code> has 121 call sites and <strong>none of them changed</strong>{" "}
            — not when the card tier went transparent, and not when it came back. Its
            fill, its border and its shadow all resolve through tokens, so the only thing
            that moved was the value of <Code>--color-surface</Code>:{" "}
            <Code>transparent</Code> in one release,{" "}
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
        title="The backdrop cap"
        description="The one number the whole language rests on, and the reason legibility can be promised over an image the system has never seen."
      >
        <p className="mb-6 max-w-measure text-ink-secondary">
          A photograph has no contrast guarantee. This language does not ask for one — it
          imposes one. <Code>--backdrop-cap</Code> is a black layer over the image at 0.40
          opacity, which pins the brightest pixel <em>any</em> image can produce to 0.22
          luminance. The plane&apos;s alpha and the card&apos;s alpha above it are both
          derived from that ceiling, and every ink value in the system was measured
          against the result.
        </p>

        <SpecTable
          columns={["Token", "Value", "What it does"]}
          rows={[
            ["--backdrop-cap", "0.40", "Black over the photograph. Pins peak luminance to 0.22."],
            [
              "--plane-fill",
              "oklch(18% 0.012 255 / 0.72)",
              "The plane. Composites to 0.0388 over the capped peak. It was 0.65, from a version of this language in which nothing sat on the plane at all; the card tier is what pushed it down.",
            ],
            ["--plane-blur", "40px", "One per plane. Everything inside it is forbidden from blurring."],
            ["--plane-saturate", "165%", "Blur averages colour and therefore desaturates it; this puts it back."],
            [
              "--plane-edge",
              "var(--border-width-panel) solid var(--color-line)",
              "The same 1px hairline a card gets. A translucent fill has no boundary of its own.",
            ],
            [
              "--plane-lift",
              "0 32px 72px -24px",
              "The one place a large blur is still right on content: the plane genuinely floats clear of the photograph, so there is separation for a shadow to describe.",
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
            channel.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="The surface ladder"
        description="Six values, and not one of them is a colour until you know what is behind it. All measured over the worst case — a peak-white pixel in the backdrop, which the shipped photograph genuinely contains."
      >
        <SpecTable
          columns={["Tier", "Token", "Luminance", "Against the plane"]}
          rows={[
            ["backdrop, capped", "--backdrop-cap: 0.40", "0.3185", "The ceiling everything below is solved against."],
            ["plane", "--plane-fill", "0.0388", "The ground. One per view."],
            ["card", "--color-surface", "0.0602", "1.24×  (1.27× sampled)"],
            ["card edge", "--color-line", "0.0873", "1.55× — and see the padding-box note below for why it is not 1.25×."],
            ["sunken", "--color-surface-sunken", "0.0318", "Below the plane, deliberately. The card is 1.35× it (1.34× sampled)."],
            ["overlay", "--color-surface-solid", "0.0114", "Not a tier. It occludes — see below."],
          ]}
        />

        <p className="mb-6 max-w-measure text-ink-secondary">
          The multipliers are contrast ratios in the WCAG form, so they sit on the same
          scale as every figure in the next section. <strong>Roughly 1.10× is where two
          large adjacent fills stop reading as separate</strong>, which is the floor the
          card tier had to clear. RAISED IS LIGHTER, INSET IS DARKER: that sentence is the
          whole elevation system here, and it is why <Code>sunken</Code> sits below the
          plane rather than above it. A groove and a card must never be confusable, and
          lightness is the only channel doing that work.
        </p>

        <UXNote title="The separations were sampled from rendered pixels, not recomputed">
          <p>
            Predicting a composite and then re-deriving it with the same formula proves
            nothing — it only proves the formula is consistent with itself. These two were
            read off the running product: <strong>card against plane 1.27×</strong>{" "}
            against a predicted 1.24, and <strong>card against sunken 1.34×</strong>{" "}
            against a predicted 1.35. Agreement inside 0.03 is the check that the
            compositing model in <Code>styles/tokens.css</Code> describes what the GPU
            actually paints, including its own gamma handling.
          </p>
          <p>
            1.27× is a real but quiet step, and that is the intent. A card here is a
            surface, not a box.
          </p>
        </UXNote>

        <UXNote title="The edge composites over the plane, not over the card">
          <p>
            <Code>.panel-edge</Code> sets <Code>background-clip: padding-box</Code>, so a
            card&apos;s alpha fill does not paint underneath its own border. The 14% edge
            therefore lands on the <em>plane</em>, not on the card, which is why it reads
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
        description="Measured ON THE CARD, which is now the worst ground for most text. Every figure on the bare plane is exactly 1.24× higher — the same ink over a ground 1.24× darker — so the card is the only surface worth quoting."
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
              "THE BINDING CONSTRAINT. The plane's alpha and the card's alpha were both solved against this level rather than against --color-ink: it is where real information lives, and it is the first to fail as either tier lightens. Above roughly 0.08 on the card it does.",
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

        <UXNote title="Media is the one surface with no cap">
          <p>
            The cap applies to the backdrop, not to content. A photograph inside a model
            card is real output sitting <em>above</em> the plane and it can contain a
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
        title="Overlays occlude; they are not a second plane"
        description="Dialog, popover, dropdown-menu, select and tooltip all paint --color-surface-solid at 0.94, and none of them carries a backdrop-filter."
      >
        <p className="mb-6 max-w-measure text-ink-secondary">
          There are two reasons and the second one settles it. First, rule 1 forbids
          stacked translucency, and an overlay over the plane is exactly that. Second —
          and this is the part worth remembering —{" "}
          <strong>blurring an already-blurred field buys nothing</strong>. The plane is
          smooth at 40px, so a second pass over it produces a visually identical result at
          the cost of a full compositor pass. Rule 2 was written about performance; here
          it turns out to be an argument about appearance as well.
        </p>

        <UXNote title="What an overlay actually needs is the guarantee the plane has">
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
              "--color-scrim-dialog, black at 0.55. Its backdrop-blur-[2px] went too: a full-viewport compositor pass blurring a field the plane has already blurred at 40px, which is the most expensive no-op available.",
            ],
            [
              "bg-danger text-white — the danger Button",
              "--color-danger is a LIGHT salmon here, so white on it measured 1.89:1. The destructive confirmation button was the least legible control in the product.",
              "--color-danger-text on the same fill: 9.9:1.",
            ],
            [
              "bg-ink-muted — a disabled primary Button",
              "Luminance 0.2386 — brighter than the card AND brighter than the plane, so a disabled Run button was the single brightest object on the page.",
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
        title="Opting a surface in"
        description="Two selectors cover the whole product. Neither is a class you write on a component."
      >
        <SpecTable
          columns={["Hook", "Where it is set", "What it covers"]}
          rows={[
            [
              "[data-plane-scope] > main",
              "app/(app)/layout.tsx, once",
              "All twelve product routes, without editing any of them.",
            ],
            [
              "data-plane",
              "The docs content column",
              "The default: fill, blur, edge, radius, lift.",
            ],
            [
              'data-plane="bar"',
              "The session header",
              "Edge-to-edge: no radius, no lift, a bottom hairline instead. It keeps the fill, the blur and the bevel, which are the parts that make it the same material.",
            ],
            [
              'data-plane="rail"',
              "The docs index",
              "Full-height against the viewport edge: the two corners that meet it lose their radius, because a rounded corner needs a gap behind it to read as a corner.",
            ],
            [
              'data-plane="padded"',
              "The 404 block, the session canvas column",
              "For an element that had no padding of its own because it was never a surface.",
            ],
            [
              "data-media-frame",
              "ProceduralCover, the two session media frames",
              "An inset hairline, so a photograph reads as set into the card rather than pasted onto it.",
            ],
          ]}
        />

        <UXNote title="Why not just target `main`">
          <p>
            Because two of the four shells would break. /docs renders its main as a flex
            child beside a persistent index, and the 404 renders it as a{" "}
            <Code>min-h-dvh</Code> centring grid — a plane on either would be a
            full-viewport panel with the content floating in the middle of it. The scope
            marker is what keeps one rule from reaching them.
          </p>
          <p>
            Both auth pages needed nothing at all. They already render a{" "}
            <Code>GlassPanel</Code>, and <Code>.glass</Code> and the plane are the same
            material by construction, so the login card is a plane without being touched.
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
            real — <strong>one raised tier per plane</strong> — and it is what keeps
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
              "--backdrop-cap goes to 1, so the photograph is a black field and [data-spatial-backdrop] is display:none. The plane goes opaque at 22% L with --color-border-contrast as its edge, --plane-blur goes to 0, the card tier goes opaque at 28% L, lines strengthen, and every ink level moves FURTHER from its ground.",
              "The ink tokens are what make this language dark, and they are not what the query switches off. Handing it light surfaces would leave near-white ink on near-white cards.",
            ],
            [
              "prefers-reduced-transparency: reduce",
              "Same destination, different reason: the plane goes opaque at 24% L with a real --color-line border, the card tier at 28% L, the photograph is neither shown nor downloaded, and the shadow tokens stop being bevels and become blurs again.",
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
            there for that reason, and this language inverts it. When this was one theme
            of three, a user who found it tiring could switch. There is no switch now:
            this is the product, and the only other renderings are the two accessibility
            modes, which are opaque dark rather than a light theme.
          </p>
          <p>
            What the language does not do is pretend the cost away. The cap exists
            precisely because &ldquo;usually legible over a photograph&rdquo; is not a
            promise a design system can make, and every number on this page is a worst
            case rather than a typical one: measured over a peak-white pixel the shipped
            image actually contains, on the card rather than on the plane, and sampled
            from rendered pixels where it could be. If the objection is ever going to win,
            it should win against the real numbers.
          </p>
        </DontNote>
      </DocSection>
    </>
  );
}
