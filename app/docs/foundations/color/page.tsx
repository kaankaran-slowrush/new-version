import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  Swatch,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Color" };

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const STATUS_STEPS = [50, 100, 300, 500, 600, 700];

export default function ColorDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Foundations"
        title="Color"
        lede="A cool graphite ground, one saturated accent, and three status hues that are deliberately nothing like the accent. Built in OKLCH so the ramps step evenly to the eye rather than evenly on paper. Almost every surface token is an alpha, because this language is translucent — a token here is not a colour until you know what is behind it."
      />

      <DocSection
        title="Why OKLCH"
        description="Every ramp here is authored in OKLCH rather than hex or HSL. That is not fashion — it changes what you can reason about."
      >
        <ul className="mb-6 space-y-2.5 text-ink-secondary">
          <li>
            <strong className="text-ink">It is perceptually uniform.</strong> Stepping
            lightness produces steps that look evenly spaced. In HSL, yellow at 50%
            lightness reads far brighter than blue at 50% — so an HSL ramp looks lumpy
            even when the numbers are tidy.
          </li>
          <li>
            <strong className="text-ink">The L channel tracks contrast.</strong> You can
            estimate accessibility while picking a value instead of discovering the
            problem in an audit.
          </li>
          <li>
            <strong className="text-ink">Chroma is independent of lightness.</strong>{" "}
            Making a color darker does not accidentally desaturate it, which is what
            makes a near-neutral grey with a deliberate hue bias possible at all.
          </li>
        </ul>
      </DocSection>

      <DocSection
        title="Graphite — the ground"
        description="The cool neutral. Hue 255 at low chroma. Every neutral in the language — the plane, the card, the ink, the failsafe canvas — is authored on this hue and inside this chroma band."
      >
        <div className="mb-6 flex flex-wrap gap-3">
          {STEPS.map((s) => (
            <Swatch
              key={s}
              token={`--color-graphite-${s}`}
              name={`graphite-${s}`}
            />
          ))}
        </div>
        <UXNote title="Why cool, and why not pure grey">
          <p>
            <strong>Ground temperature is the single biggest lever on whether a product
            reads as futuristic.</strong> A warm neutral reads as paper, print, and
            organic; a cool one reads as glass, metal, and instrument. This ramp was warm
            (hue 75) in an earlier revision and moving it to hue 255 changed the
            product&apos;s register more than any other single edit — and it survived the
            ground going dark unchanged, because the argument was never about lightness.
          </p>
          <p>
            It is still not <em>pure</em> grey. A neutral with a deliberate hue bias
            reads as chosen; <Code>#808080</Code> reads as inherited from a framework
            default. Note the chroma is slightly higher than the warm ramp needed
            (0.004–0.015 vs 0.003–0.010): cool greys go lifeless faster than warm ones as
            chroma drops, so they need a little more to avoid looking like dead pixels.
          </p>
          <p>
            <strong>No semantic token names a step from this ramp any more, and it
            cannot.</strong> Most of the surface layer is a white or black alpha, and a
            ramp step is opaque — there is no step that means &ldquo;7% white&rdquo;. The
            ramp is now the reference the semantic values are tuned against rather than
            their source: every neutral below sits on hue 255 at chroma 0.004–0.014,
            which is this ramp&apos;s discipline stated as a constraint instead of as a
            lookup.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Signal — the one accent"
        description="A saturated blue at hue 224. NOT the primary button — see below."
      >
        <div className="mb-6 flex flex-wrap gap-3">
          {STEPS.map((s) => (
            <Swatch key={s} token={`--color-signal-${s}`} name={`signal-${s}`} />
          ))}
        </div>
        <UXNote title="Why this hue, and why only one">
          <p>
            Hue 224 clears the two most exhausted defaults in the category: the{" "}
            <Code>#3B82F6</Code> dev-tool blue (~250) and the indigo/violet SaaS
            gradient (~275).
          </p>
          <p>
            <strong>It moved from 202, and the reason is worth recording.</strong> At
            202 the dark end of the ramp rendered <Code>#005e68</Code> — R0 G94 B104.
            That is technically blue-leaning by ten points, and it read as petrol{" "}
            <em>green</em> to essentially everyone who looked at it, which put the brand
            accent in visual conversation with the success colour. Being right on paper
            is not the test. 224 is unambiguously blue at every step and still sits 26°
            clear of the dev-tool default.
          </p>
          <p>
            <strong>Read the chroma values, not just the hue.</strong> When the ground
            was warm, warm-versus-cool did the work of separating accent from surface.
            On a cool ground that mechanism is gone, and the only one left is chroma
            contrast: a near-neutral ground against a genuinely saturated accent. That
            is why these values are materially more saturated than a warm-ground palette
            would need. Desaturate them and the accent collapses into &ldquo;a slightly
            bluer grey&rdquo; — the failure mode of every cool-on-cool palette.
          </p>
          <p>
            <strong>The semantic accent does not sit in the middle of this ramp.</strong>{" "}
            <Code>--color-accent</Code> is <Code>oklch(82% 0.105 224)</Code> — lighter and
            less saturated than the mid steps here, because a saturated mid-tone that
            sings on white goes muddy on a ground at luminance 0.039, and because every
            accent token in this kit is used as <em>text</em> somewhere.
          </p>
          <p>
            One accent, used sparingly. Roughly 60/30/10: dominant neutral surface,
            secondary tone, ~10% accent. Color that appears everywhere stops meaning
            anything — if the accent marks both &ldquo;primary action&rdquo; and
            decoration, users can no longer use it to find the action.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Status hues"
        description="Success, warning, danger. Each is a different hue from the accent on purpose."
      >
        <div className="mb-4">
          <p className="mb-2 eyebrow text-ink-tertiary">
            Verdant · success · hue 150
          </p>
          <div className="flex flex-wrap gap-3">
            {STATUS_STEPS.map((s) => (
              <Swatch key={s} token={`--color-verdant-${s}`} name={`verdant-${s}`} />
            ))}
          </div>
        </div>
        <div className="mb-4">
          <p className="mb-2 eyebrow text-ink-tertiary">
            Ember · warning · hue 58
          </p>
          <div className="flex flex-wrap gap-3">
            {STATUS_STEPS.map((s) => (
              <Swatch key={s} token={`--color-ember-${s}`} name={`ember-${s}`} />
            ))}
          </div>
        </div>
        <div className="mb-6">
          <p className="mb-2 eyebrow text-ink-tertiary">
            Rust · danger · hue 25
          </p>
          <div className="flex flex-wrap gap-3">
            {STATUS_STEPS.map((s) => (
              <Swatch key={s} token={`--color-rust-${s}`} name={`rust-${s}`} />
            ))}
          </div>
        </div>

        <UXNote title="Semantic color is not brand color">
          <p>
            If status shared the accent hue, &ldquo;this is interactive&rdquo; and
            &ldquo;this is healthy&rdquo; would become the same signal and both would
            degrade. Ember at hue 58 gains from the cool ground: amber is now the
            furthest thing on the colour wheel from every other hue in the system, which
            makes it the loudest warning available without reaching for red. On the old
            warm ground it had to fight a neutral only 17° away from it.
          </p>
          <p>
            The three semantic status tokens land at <strong>82–87% L</strong> — the
            light end of their hue rather than the 600 step a light ground wanted. Every
            one of them is read as text on a dark card, and the fill and the text value
            have converged into one number. Measured on the card:{" "}
            <strong>5.72 / 6.22 / 5.04</strong>.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Never carry state in color alone.</strong> Roughly 1 in 12 men has
            some form of colour vision deficiency, and colour survives neither
            greyscale printing nor a screenshot pasted into a ticket. Every status in
            this kit pairs its colour with a shape or icon — see{" "}
            <Code>StatusMark</Code>, where live is a pulsing dot, idle is a hollow dot,
            and error is a triangle.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Semantic layer — what components actually use"
        description="Components reference only these. There is one language rather than three themes, so this table is the whole of it — no per-theme branch to read alongside."
      >
        <SpecTable
          columns={["Token", "Value", "Use for"]}
          rows={[
            ["--color-canvas", "oklch(24% 0.012 255)", "The FAILSAFE FLOOR behind the photograph — what shows if the image is missing. Not a surface you design on."],
            ["--plane-fill", "oklch(18% 0.012 255 / 0.72)", "The page's own surface. One plane per view, blurred 40px, saturated 165%."],
            ["--color-surface", "oklch(100% 0 0 / 0.07)", "The card tier. Raised, translucent, 1.27× the plane."],
            ["--color-surface-sunken", "oklch(0% 0 0 / 0.28)", "Inset: inputs, tracks, footer strips. BLACK, so “inset is darker” survives on a dark ground."],
            ["--color-surface-solid", "oklch(16% 0.012 255 / 0.94)", "OCCLUSION. All five overlays and sticky table headers. Not a tier — see below."],
            ["--color-surface-veil", "= --color-surface", "INERT on every Card. Kept at the same value so nothing referencing it can drift — see below."],
            ["--color-surface-hover", "oklch(100% 0 0 / 0.09)", "Hover on something TRANSPARENT at rest — ghost buttons, table rows, menu items."],
            ["--color-surface-active", "oklch(100% 0 0 / 0.14)", "Pressed / selected."],
            ["--color-surface-raised-hover", "oklch(100% 0 0 / 0.14)", "Hover on something ALREADY painting the card tier — secondary Button, solid FilterPill."],
            ["--color-surface-disabled", "transparent", "Disabled controls. Flat means flat — see below."],
            ["--color-ink", "oklch(97% 0.006 255)", "Primary text, headings, values. 8.74:1 on the card."],
            ["--color-ink-secondary", "oklch(86% 0.01 255)", "Supporting body copy. 6.23:1."],
            ["--color-ink-tertiary", "oklch(80% 0.012 255)", "Metadata, timestamps, captions. 5.10:1 — the binding constraint of the palette."],
            ["--color-ink-muted", "oklch(62% 0.014 255)", "Placeholder and disabled ONLY. 2.62:1, and that is correct — see below."],
            ["--color-line", "oklch(100% 0 0 / 0.14)", "PANEL EDGES — the card's own boundary, at 1px."],
            ["--color-line-inner", "oklch(100% 0 0 / 0.08)", "INTERNAL dividers — table rows, menu rules, footer tops."],
            ["--color-line-soft", "oklch(100% 0 0 / 0.05)", "Faintest separation."],
            ["--color-line-strong", "oklch(100% 0 0 / 0.3)", "CONTROL edges — badge, pill, checkbox, radio, the EmptyState frame, toolbar separators. NOT a region divider."],
            ["--color-border-contrast", "oklch(100% 0 0 / 0.45)", "prefers-contrast: more only. A real border rather than a heavier alpha."],
            ["--color-action", "oklch(96% 0.004 255)", "THE primary action fill. Near-WHITE here, and the only fully opaque object most screens contain."],
            ["--color-action-hover", "oklch(90% 0.005 255)", "Hover — DARKENS; nothing is lighter than 96%."],
            ["--color-action-ink", "oklch(20% 0.01 255)", "The label ON the action fill. 16.1:1."],
            ["--color-accent", "oklch(82% 0.105 224)", "Data, selection, links. NOT the primary button."],
            ["--color-accent-text", "oklch(18% 0.01 255)", "Text ON an accent fill. 11.1:1."],
            ["--color-accent-soft", "accent @ 0.18", "Tinted wash, selected rows. 0.18 rather than 0.12: a tint over a translucent plane loses about a third of its strength to the photograph."],
            ["--color-accent-ink", "= --color-accent", "Accent-coloured TEXT."],
            ["--color-success / -soft / -ink", "oklch(82% 0.125 150)", "Running, healthy, completed. 5.72:1."],
            ["--color-warning / -soft / -ink", "oklch(87% 0.115 70)", "Degraded, attention, low balance. 6.22:1."],
            ["--color-danger / -soft / -ink", "oklch(83% 0.13 25)", "Failed, destructive. 5.04:1 — the lowest real-text contrast in the product."],
            ["--color-danger-text", "oklch(18% 0.01 25)", "The label ON a danger FILL. 9.9:1. See the inversion bugs below."],
            ["--color-idle", "oklch(58% 0.014 255)", "Standby, inactive."],
            ["--color-glass", "var(--plane-fill)", "Chrome fill — literally the plane's material, not a second recipe."],
            ["--color-glass-barrier", "oklch(14% 0.012 255 / 0.34)", "The guaranteed-contrast layer under glass. DARK, because ink is near-white."],
            ["--color-scrim-dialog", "oklch(0% 0 0 / 0.55)", "Behind a dialog. Black — see the inversion bugs below."],
          ]}
        />
        <UXNote title="The -ink rule: why status colours come in threes">
          <p>
            A <Code>-soft</Code> fill is its own hue at low alpha, which means it shifts
            the ground with <strong>the same colour as the text sitting on it</strong>.
            Contrast drops instead of holding, and it does so invisibly — the badge still
            looks fine to someone with normal vision on a good monitor. So: text on a
            plain surface may use the base token; text on a same-hue <Code>-soft</Code>{" "}
            fill must use <Code>-ink</Code>.
          </p>
          <p>
            <strong>On this ground the two values have converged</strong> — each{" "}
            <Code>-ink</Code> is currently identical to its base token, because the
            legible value and the fill value are the same number once the surface is
            dark. Keep both names anyway. Collapsing them would push the rule out into
            every call site, and the rule is what survives a change of ground; the
            coincidence is not. On the light ground this kit used to have, the same rule
            was the difference between <strong>3.99:1</strong> and <strong>5.55:1</strong>{" "}
            for warning text on <Code>bg-warning-soft</Code>.
          </p>
          <p>
            <Code>--color-accent-text</Code> and <Code>--color-danger-text</Code> are a
            different job and must not be confused with these: they are the label on a
            SOLID accent or danger fill, and both are near-black.
          </p>
        </UXNote>

        <UXNote title="Four text levels, not two">
          <p>
            A label/value/meta structure needs at least three of the ink levels to read
            as a hierarchy. Two levels is not a hierarchy — it is a flat page where the
            eye has nowhere to go. The most common tell of generated UI is everything
            sitting at one weight and one colour.
          </p>
          <p>
            The fourth level is not part of that hierarchy.{" "}
            <Code>--color-ink-muted</Code> measures <strong>2.62:1</strong> on the card,
            which is correct rather than broken — WCAG 1.4.3 exempts inactive components
            and placeholder text that duplicates a visible label, and a disabled control
            that reads at full contrast is not disabled. The rule is absolute:{" "}
            <strong>no information may live only in ink-muted.</strong> Table headers,
            timestamps, hints, captions, counts and eyebrows are all{" "}
            <Code>ink-tertiary</Code>.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The surface ladder"
        description="Four tiers plus an occluding material. Every number is a luminance measured over the WORST CASE — a peak-white pixel in the backdrop photograph, which the shipped image genuinely contains."
      >
        <SpecTable
          columns={["Tier", "Token", "Luminance", "What it is"]}
          rows={[
            ["backdrop, capped", "--backdrop-cap: 0.4", "0.3185", "The photograph, held under the cap. This is the worst case, not the average."],
            ["plane", "--plane-fill", "0.0388", "The page. One per view."],
            ["card", "--color-surface", "0.0602", "Raised. Sampled from the rendered pixels, 1.27× the plane."],
            ["card edge", "--color-line", "0.0873", "1.55× the plane — see the padding-box note below."],
            ["sunken", "--color-surface-sunken", "0.0318", "Inset. The card is 1.34× it."],
            ["overlay", "--color-surface-solid", "0.0114", "Occludes. Not a tier — see below."],
          ]}
        />
        <UXNote title="Raised is lighter, inset is darker — and that sentence is the elevation system">
          <p>
            Lightness is the only channel doing that work here, which is why{" "}
            <Code>sunken</Code> sits <em>below</em> the card rather than above it: a
            groove and a card must never be confusable. On a light ground a sunken fill
            could be a slightly darker grey; here it has to be <strong>black at
            28%</strong>, because any lighter inset would be indistinguishable from the
            card containing it.
          </p>
          <p>
            <strong>0.07 for the card is solved, not chosen.</strong> It is the largest
            value that keeps every ink level above 4.5:1 on the card while putting the
            card a readable distance from the plane. Above ~0.08{" "}
            <Code>--color-ink-tertiary</Code> fails; below ~0.05 the card stops
            separating — roughly 1.10× is where two large adjacent fills merge into one.
          </p>
          <p>
            <strong>The canvas is not on this ladder.</strong>{" "}
            <Code>--color-canvas</Code> is a failsafe floor behind the photograph: it is
            what shows if the image is still loading, blocked or missing, and it is
            deliberately darker than the cap so the plane&apos;s arithmetic does not
            break the moment the image fails. No text ever sits on it.
          </p>
        </UXNote>
        <UXNote title="What the ladder forces elsewhere">
          <p>
            <strong>Two hover tokens, not one.</strong>{" "}
            <Code>hover:bg-*</Code> <em>replaces</em> a fill rather than overlaying it,
            so a control already painting the card tier that hovers to{" "}
            <Code>--color-surface-hover</Code> goes 0.07 → 0.09: a{" "}
            <strong>1.03× move</strong>, which is no hover at all. Raising that one token
            to 0.14 would instead turn every ghost-button hover into a flash. Two
            situations, two tokens — <Code>--color-surface-raised-hover</Code> is for
            anything already painting.
          </p>
          <p>
            <strong>Disabled is transparent, and that is a style rather than the absence
            of one.</strong> An input&apos;s affordance is its recess, so disabling it
            removes the well. On a light theme &ldquo;flat&rdquo; meant a white input on
            a white card. Here the card tier is <em>raised</em>, so painting a disabled
            control <Code>--color-surface</Code> would make it brighter than an enabled
            one — in a language where raised means interactive, exactly backwards.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Borders are low-opacity, not solid"
        description="Every line token is white at low alpha rather than a solid grey hex."
      >
        <Example label="Hairline progression">
          <div className="flex flex-col gap-3">
            {(["soft", "inner", "", "strong"] as const).map((v) => (
              <div key={v} className="flex items-center gap-3">
                <div
                  className="h-12 w-48 rounded-lg bg-surface"
                  style={{
                    border: `var(--border-width-panel) solid var(--color-line${
                      v ? `-${v}` : ""
                    })`,
                  }}
                />
                <code className="font-mono text-xs text-ink-tertiary">
                  --color-line{v ? `-${v}` : ""}
                </code>
              </div>
            ))}
          </div>
        </Example>
        <p className="mb-4 text-ink-secondary">
          Alpha borders blend with whatever they sit on, so the same token works on the
          plane, on a card, and on a sunken fill. A solid hex border only looks right on
          the one background it was picked against — and reads harsh next to everything
          else.
        </p>
        <p className="mb-4 text-ink-secondary">
          <strong className="text-ink">
            <Code>--color-line</Code> is doing more work than a hairline normally does.
          </strong>{" "}
          With no drop shadow available on a ground this dark (see{" "}
          <Code>Elevation &amp; glass</Code>), the edge is most of what says
          &ldquo;object&rdquo;. <Code>--border-width-panel</Code> is{" "}
          <strong>1px</strong>, and it used to be 1.5px on a justification that stopped
          being true when the ground did: &ldquo;at 1px a border on a white card reads as
          a rendering artefact&rdquo; is true of a dark hairline on white, and false of a
          white hairline on dark glass, where 1.5px reads heavy and turns a grid of cards
          into a wireframe.
        </p>
        <UXNote title="Why the edge measures 1.55× when the card measures 1.27×">
          <p>
            <Code>.panel-edge</Code> sets <Code>background-clip: padding-box</Code>, so a
            card&apos;s own alpha fill does <strong>not</strong> paint under its own
            border. The edge therefore composites over the <em>plane</em>, not over the
            card — which is why it reads at 1.55× rather than the ~1.25× you would get by
            stacking it on the card&apos;s fill. Remove the clip and the edge dilutes by
            about a third, with no error and nothing to grep for.
          </p>
        </UXNote>
        <DontNote>
          <p>
            <strong>
              <Code>--color-line-strong</Code> is a CONTROL edge, not a region divider.
            </strong>{" "}
            Its consumers are <Code>Badge</Code>, <Code>Pill</Code>,{" "}
            <Code>Checkbox</Code>, <Code>RadioGroup</Code>, <Code>EmptyState</Code>&apos;s
            dashed frame, <Code>Toolbar</Code>&apos;s separator,{" "}
            <Code>ActivityStrip</Code>&apos;s empty cells, <Code>GlassPanel</Code>&apos;s{" "}
            <Code>bordered</Code>, and <Code>SessionRails</Code> on hover — nine control
            components and zero regions. It was described for a while as &ldquo;the
            region divider now that no card edge performs that job&rdquo;, which was
            wrong twice: there were no region uses, and the card edge was never retired.
          </p>
          <p>
            Section boundaries come from the tier boundary (a serif title on the plane,
            cards below it), from whitespace, and from <Code>&lt;Separator /&gt;</Code>.
            Reaching for a heavier line instead is also how a table turns into a
            spreadsheet: <Code>--color-line</Code> outside, <Code>--color-line-inner</Code>{" "}
            inside. <strong>Strong outside, quiet inside.</strong>
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="The card is the worst ground for text, and that is where the floor is measured"
        description="Every contrast figure in this file is taken on the card, because now that cards paint again it is the lightest thing most text sits on."
      >
        <SpecTable
          columns={["Where the text sits", "Floor", "Measured"]}
          rows={[
            ["On a card — the common case", "ink-tertiary", "ink 8.74 · secondary 6.23 · tertiary 5.10 · accent 5.60 · success 5.72 · warning 6.22 · danger 5.04"],
            ["On the bare plane", "ink-tertiary", "Every level higher than on the card — the card is the binding case, not the plane"],
            ["On a sunken fill", "ink-tertiary", "ink 11.6:1"],
            ["On an overlay (--color-surface-solid)", "ink-tertiary", "ink 15.68:1 — nothing about the backdrop enters the calculation"],
            ["Directly on a photograph", "—", "10.6:1 for a --color-chip-over-media chip against a blown-out white pixel"],
          ]}
        />
        <DontNote>
          <p>
            <strong>
              Never put information in <Code>--color-ink-muted</Code>.
            </strong>{" "}
            It is 2.62:1 on the card and it is meant to be: placeholder and disabled text
            only. If you are reaching for muted on something a user needs to read, you
            want <Code>ink-tertiary</Code>. Do not &ldquo;fix&rdquo; the value — raising
            it would make every disabled control in the product look pressable.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="One material, and the class that does not paint"
        description="Chrome and content are made of the same thing here. The exception is not translucency — it is occlusion."
      >
        <SpecTable
          columns={["Material", "Recipe", "Licensed for"]}
          rows={[
            ["the plane", "--plane-fill (18% L @ 0.72) + blur(40px) saturate(165%) + a 1px edge + a specular top bevel", "The page itself. One per view."],
            [".glass", "--color-glass, which IS --plane-fill, + blur(44px) saturate(180%) + a dark 34% barrier layer + a specular top edge", "Persistent navigational chrome — topbar, session rails, composer. The same material as the plane, deliberately."],
            ["bg-surface", "7% white, NO blur", "The card tier. Content surfaces, sitting on the plane."],
            ["--color-surface-solid", "16% L at 0.94, NO blur, NO backdrop-filter", "Anything that must OCCLUDE what passes beneath it: all five overlays and sticky table headers."],
            [".surface-veil", "background-clip: padding-box, and in practice nothing else", "Nothing you should reach for. See below."],
          ]}
        />
        <UXNote title="Why .surface-veil is inert, and why it is still here">
          <p>
            It was documented for two releases as an 80% translucent content tier sitting
            between glass and opacity. <strong>It has not painted on a Card since
            Tailwind v4.</strong> The layer order is{" "}
            <Code>@layer theme, base, components, utilities</Code>;{" "}
            <Code>.surface-veil</Code> is authored in <Code>@layer components</Code> and{" "}
            <Code>bg-surface</Code> is a utility. Layer order beats specificity, so on
            every element carrying both — <Code>Card</Code> and <Code>Toolbar</Code>
            &apos;s <Code>surface</Code> variant — <Code>bg-surface</Code> wins and the
            veil contributes only its <Code>background-clip</Code>.
          </p>
          <p>
            It genuinely paints in exactly one place in the product: the inert composer
            replica on the dashboard, which carries no <Code>bg-*</Code> of its own. The
            nesting guard <Code>.surface-veil .surface-veil</Code> therefore never fires
            on a Card either — it is not the mechanism keeping nested cards from
            multiplying their alphas.
          </p>
          <p>
            <Code>--color-surface-veil</Code> is now set to the same value as{" "}
            <Code>--color-surface</Code>, so nothing that still references it can drift
            away from the card tier. Do not build on it, and do not describe it as a
            tier.
          </p>
        </UXNote>
        <DontNote>
          <p>
            <strong>Alpha fills multiply, so stacked translucency is still a real
            rule</strong> — two 7% cards are 13.5% effective and the inner one would read
            <em> lighter</em> than a single card by an amount nobody chose. The guard that
            used to be cited for this does not fire (above), so the rule is enforced by
            the language instead: one plane per view, and cards do not nest inside cards.
          </p>
          <p>
            <strong>And nothing that occludes may be translucent.</strong> Every tier
            above is legible because <Code>--backdrop-cap</Code> pins the worst case
            behind the plane. Nothing imposes anything behind a dropdown — it can open
            over generated media, over a bright photograph, over another menu — so it
            takes <Code>--color-surface-solid</Code> and no blur.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="The primary action is ink, not accent"
        description="These used to be one token. Separating them is the single most visible change in the palette — and on this ground “ink” means near-white."
      >
        <Example label="primary · secondary · ghost">
          <button className="inline-flex h-9 items-center rounded-lg bg-action px-4 text-sm font-medium text-action-ink shadow-xs">
            Start making
          </button>
          <button className="inline-flex h-9 items-center rounded-lg panel-edge bg-surface px-4 text-sm font-medium text-ink shadow-sm">
            Secondary
          </button>
          <button className="inline-flex h-9 items-center rounded-lg px-4 text-sm font-medium text-ink-secondary">
            Ghost
          </button>
        </Example>
        <UXNote title="Why the loudest colour should not be on a button">
          <p>
            <Code>--color-accent</Code> and the primary fill were the same value, which
            conflated two different jobs. A saturated fill on the one high-emphasis
            button means the loudest colour on the page is spent on a{" "}
            <em>control</em> rather than on <em>information</em> — and it puts the brand
            accent in direct competition with the status colours sitting next to it in
            every table.
          </p>
          <p>
            The rule being preserved is <strong>&ldquo;the primary action is the
            highest-contrast object on screen&rdquo;</strong>, and on a dark ground the
            only way to satisfy it is to invert: <Code>--color-action</Code> is{" "}
            <Code>oklch(96% 0.004 255)</Code> with a near-black label at{" "}
            <strong>16.1:1</strong>. It is also the only fully opaque object most screens
            contain, which is most of why it reads as definitely-not-part-of-the-glass.
          </p>
          <p>
            One detail worth copying, and it has now inverted twice:{" "}
            <Code>--color-action-hover</Code> <strong>darkens</strong>. At 96% L there is
            nowhere lighter to go — exactly the argument that made it lighten when the
            fill was near-black at 15% L. A hover that produces no visible change reads
            as a broken control, so the direction follows the fill.
          </p>
        </UXNote>
        <DontNote>
          <p>
            <strong>Do not roll the rest of the accent into the action token.</strong>{" "}
            Checkboxes, radios, switches, tab indicators, meter fills, sparklines and
            selected rows all stay on <Code>--color-accent</Code>. If everything
            interactive becomes near-white, the page loses its only means of saying
            &ldquo;this one is on&rdquo; at a glance, and every data graphic turns into
            grey.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Three inversion bugs, all the same shape"
        description="A value that was correct on a light ground becoming its own opposite on a dark one. This is the failure mode of this kind of migration, and naming the shape is more useful than listing the instances."
      >
        <SpecTable
          columns={["What it was", "What it did here", "Fix"]}
          rows={[
            [
              "The dialog scrim: bg-ink/35",
              "`ink` is near-white here, so every modal painted a near-white wash over the whole viewport. A scrim whose job is to push the page back was pulling it forward.",
              "--color-scrim-dialog, black at 0.55.",
            ],
            [
              "The danger Button: bg-danger text-white",
              "--color-danger is a light salmon on this ground, so white on it measured 1.89:1 — the destructive confirmation button was the least legible control in the product.",
              "--color-danger-text, near-black at 9.9:1.",
            ],
            [
              "A disabled primary Button: bg-ink-muted",
              "Luminance 0.2386 — brighter than the card AND brighter than the plane, so a disabled button was the brightest object on the page.",
              "disabled:bg-surface with a muted label: flat, quiet, unmistakably not pressable.",
            ],
          ]}
        />
        <UXNote title="The rule that catches all three">
          <p>
            <strong>When a fill token inverts, its label token must invert with it.</strong>{" "}
            <Code>--color-accent-text</Code> already existed for exactly this reason;{" "}
            <Code>--color-danger-text</Code> was its missing sibling and the gap was
            invisible for as long as the ground stayed light.
          </p>
          <p>
            The general form is worth internalising, because it is not specific to
            colour: <strong>any value chosen against a ground is a claim about that
            ground.</strong> A literal that encodes &ldquo;darker than what is behind
            me&rdquo; as a number, rather than as a token, becomes &ldquo;lighter than
            what is behind me&rdquo; the moment the ground moves — silently, with the
            component still rendering exactly what it was told to.
          </p>
        </UXNote>
      </DocSection>
    </>
  );
}
