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
        lede="A cool graphite ground, one saturated accent, and three status hues that are deliberately nothing like the accent. Built in OKLCH so the ramps step evenly to the eye rather than evenly on paper."
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
        description="The cool neutral. Hue 255 at low chroma, and deliberately NOT near-white at the top. This carries roughly 90% of every surface in the product."
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
            <strong>Ground temperature is the single biggest lever on whether a light
            theme reads as futuristic.</strong> A warm neutral reads as paper, print, and
            organic; a cool one reads as glass, metal, and instrument. This ramp was warm
            (hue 75) in an earlier revision and moving it to hue 255 changed the
            product&apos;s register more than any other single edit.
          </p>
          <p>
            It is still not <em>pure</em> grey. A neutral with a deliberate hue bias
            reads as chosen; <Code>#808080</Code> reads as inherited from a framework
            default. Note the chroma is slightly higher than the warm ramp needed
            (0.004–0.015 vs 0.003–0.010): cool greys go lifeless faster than warm ones as
            chroma drops, so they need a little more to avoid looking like dead pixels.
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
        description="Components reference only these. Retheming the product means remapping this table and nothing else."
      >
        <SpecTable
          columns={["Token", "Maps to", "Use for"]}
          rows={[
            ["--color-canvas", "96.5% L light · 30% L dim", "Page ground. Deliberately DARKER than the surfaces on it — see below."],
            ["--color-surface", "white", "Raised: cards, panels, menus, dialogs"],
            ["--color-surface-sunken", "graphite-100", "Inset: inputs, tracks, fills, footer strips"],
            ["--color-surface-veil", "white @ 80%", "TRANSLUCENT content surface — Card, Toolbar"],
            ["--color-surface-hover", "ink @ 3.5%", "Hover fill — an ALPHA overlay, not a ramp step"],
            ["--color-surface-active", "ink @ 7%", "Pressed/selected fill — also alpha"],
            ["--color-ink", "graphite-950", "Primary text, headings, values"],
            ["--color-ink-secondary", "graphite-700", "Supporting body copy"],
            ["--color-ink-tertiary", "graphite-600", "Metadata, timestamps, captions"],
            ["--color-ink-muted", "55% L (not a ramp step)", "Placeholder, disabled. NEVER on the canvas."],
            ["--color-line", "ink @ 14%", "PANEL EDGES — visible on purpose, carries the 1.5px border"],
            ["--color-line-inner", "ink @ 7%", "INTERNAL dividers — table rows, menu rules, footer tops"],
            ["--color-line-soft", "ink @ 5%", "Faintest separation"],
            ["--color-line-strong", "ink @ 24%", "Hover, emphasis"],
            ["--color-action", "graphite-950", "THE primary action fill. Near-black, not accent."],
            ["--color-action-hover", "graphite-800", "Hover — LIGHTENS; nothing is darker than 15%."],
            ["--color-action-ink", "white", "Text on the action fill. 19.7:1."],
            ["--color-accent", "signal-700", "Data, selection, links. NOT the primary button."],
            ["--color-accent-soft", "signal-700 @ 10%", "Tinted wash, selected rows"],
            ["--color-accent-ink", "signal-700", "Accent-coloured text on light"],
            ["--color-success / -soft / -ink", "verdant-600 / -700", "Running, healthy, completed"],
            ["--color-warning / -soft / -ink", "ember-600 / -700", "Degraded, attention, low balance"],
            ["--color-danger / -soft / -ink", "rust-600 / -700", "Failed, destructive"],
            ["--color-idle", "graphite-400", "Standby, inactive"],
            ["--color-glass", "white @ 38%", "Navigational chrome fill"],
            ["--color-glass-barrier", "white @ 18%", "The guaranteed-contrast layer under it"],
          ]}
        />
        <UXNote title="The -ink rule: why status colours come in threes">
          <p>
            A <Code>-soft</Code> fill is its own hue at 8–12% alpha, which means it
            darkens the ground with <strong>the same colour as the text sitting on
            it</strong>. Contrast drops instead of holding, and it does so invisibly —
            the badge still looks fine to someone with normal vision on a good monitor.
          </p>
          <p>
            So: text on a plain surface may use the base token; text on a same-hue{" "}
            <Code>-soft</Code> fill must use <Code>-ink</Code>, which is the 700 step.
            Measured on <Code>Badge</Code>: <Code>text-warning</Code> on{" "}
            <Code>bg-warning-soft</Code> was <strong>3.99:1</strong> — a real failure —
            and <Code>text-warning-ink</Code> is <strong>5.55:1</strong>. Amber is where
            this bites hardest, because luminance peaks near yellow, so the value that
            looks right is usually the value that fails.
          </p>
        </UXNote>

        <UXNote title="Four text levels, not two">
          <p>
            A label/value/meta structure needs at least three of the ink levels to read
            as a hierarchy. Two levels is not a hierarchy — it is a flat page where the
            eye has nowhere to go. The most common tell of generated UI is everything
            sitting at one weight and one colour.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Borders are low-opacity, not solid"
        description="Every line token is the ink colour at low alpha rather than a solid grey hex."
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
          Alpha borders blend with whatever they sit on, so the same token works on
          canvas, on a card, and on a sunken fill. A solid hex border only looks right
          on the one background it was picked against — and reads harsh next to
          everything else.
        </p>
        <p className="text-ink-secondary">
          <strong className="text-ink">These are stronger than they used to be.</strong>{" "}
          Definition of elevated surfaces has moved from shadow to border (see{" "}
          <Code>Elevation &amp; glass</Code>), so <Code>--color-line</Code> now has to
          carry a visible 1.5px edge rather than a hairline nobody looks at.{" "}
          <Code>--color-line-inner</Code> is the old faint value, kept for internal
          dividers — and using the wrong one of the two is the easiest way to make this
          system look wrong: strong lines inside a table turn it into a spreadsheet.
        </p>
      </DocSection>

      <DocSection
        title="The ground is not near-white, and that changed everything"
        description="--color-canvas is 96.5% L. It used to be 99%, and that single value was holding the whole system back."
      >
        <p className="mb-4 text-ink-secondary">
          A white card on a 99%-lightness ground has a <strong>1.01:1</strong>{" "}
          relationship with it. Every panel in the product was floating on nothing, and
          all of the elevation work — the borders, the shadow scale, the concentric radii
          — was invisible. At 96.5% the ground is a real surface: cards read as objects
          sitting on it, and the ambient layer behind has somewhere to live.
        </p>
        <p className="mb-4 text-ink-secondary">
          Chroma rises as it darkens (0.007, not 0.004). A darker neutral at low chroma
          reads as <em>dirty grey</em>; the same lightness with a deliberate cool bias
          reads as a tinted surface. That distinction is the entire difference between
          this and &ldquo;greyed-out light mode&rdquo;.
        </p>
        <UXNote title="What had to move with it — the ripple is the interesting part">
          <p>
            <strong>Sunken fills.</strong> <Code>--color-surface-sunken</Code> was 97.4%,
            which is <em>lighter</em> than the new ground — an inset input would have read
            as raised. It moved to 94%, keeping it below both the canvas and a white card.
          </p>
          <p>
            <strong>Hover and pressed fills became alpha.</strong> They were solid ramp
            steps, and one solid value cannot be right on the canvas, on a white card, on
            a translucent card and on a sunken input at once. They are now ink at 3.5% and
            7%, which darkens whatever they land on by the same perceptual amount
            everywhere. This is the argument the border tokens already made, applied to
            state.
          </p>
          <p>
            <strong><Code>--color-ink-muted</Code> left the ramp.</strong> At
            graphite-500 it measured <strong>2.88:1</strong> on the new sunken fill —
            placeholder text failing even the relaxed 3:1 bar. It is now an explicit 55%
            L: 4.07:1 on sunken, 4.85:1 on white.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The canvas is not a text background"
        description="The one hard constraint the ambient layer imposes, and the reason it is a rule rather than a guideline."
      >
        <DontNote>
          <p>
            <strong>
              Never put <Code>--color-ink-tertiary</Code> or{" "}
              <Code>--color-ink-muted</Code> directly on the canvas.
            </strong>{" "}
            The canvas is not a flat colour — it is the ambient layer, and where its lava
            blobs overlap, measured contrast for tertiary ink falls to{" "}
            <strong>2.54:1</strong>. Muted ink fails on the clean canvas too, at 4.38:1,
            which makes this a pre-existing defect the darker ground merely exposed.
          </p>
          <p>
            Anything below <Code>ink-secondary</Code> needs a surface under it — a card, a
            veil or glass, all of which measure <strong>≥4.77:1</strong> even over the
            densest point of the lava. That is why <Code>SectionHeader</Code>&apos;s eyebrow
            is <Code>ink-secondary</Code> rather than tertiary, and why the same label
            inside a card can safely be tertiary.
          </p>
        </DontNote>
        <SpecTable
          columns={["Where the text sits", "Floor", "Measured worst case"]}
          rows={[
            ["Directly on the canvas", "ink-secondary", "6.5:1 over the densest lava overlap"],
            ["On a veil card (80%)", "ink-muted", "4.59:1 — every level passes"],
            ["On glass chrome", "ink-tertiary", "4.77:1"],
            ["On an opaque surface", "ink-muted", "4.85:1"],
          ]}
        />
      </DocSection>

      <DocSection
        title="Two tiers of transparency, and why only one may touch content"
        description="Glass was never the only option — it was the only one that had been built."
      >
        <SpecTable
          columns={["Tier", "Recipe", "Licensed for"]}
          rows={[
            [".glass", "38% white + blur(44px) saturate(180%) + an 18% barrier + a specular top edge", "Persistent navigational chrome ONLY — topbar, session rails, composer."],
            [".surface-veil", "80% white, NO blur", "Content surfaces — Card, Toolbar. This is the new tier."],
            ["opaque bg-surface", "solid white", "Transient overlays — menus, popovers, dialogs. Non-negotiable."],
          ]}
        />
        <UXNote title="Why the veil is safe where glass is not">
          <p>
            The glass rule bans <em>glass</em> on content, not <em>translucency</em>. Glass
            is dangerous for two specific reasons: <Code>backdrop-filter</Code> is
            compositor-expensive, and a sheer fill over <strong>arbitrary</strong> content
            makes contrast a matter of luck. The veil has neither problem. It does no
            blurring, and it is only ever used where <strong>we control the backdrop</strong>{" "}
            — the ambient layer is ours, so its darkest point is knowable and the worst
            case is computable rather than hoped for.
          </p>
          <p>
            80% rather than glass’s 38% is the whole trade: high enough that every ink level
            clears 4.5:1 over the densest lava, low enough that a wash drifting underneath
            visibly tints the card. That tint is the point — it is what makes the surface
            read as floating rather than merely pale.
          </p>
        </UXNote>
        <DontNote>
          <p>
            <strong>Alpha fills multiply, so a veil inside a veil is a bug</strong> — 0.8 ×
            0.8 = 0.64 effective, and the nested card would read <em>darker</em> than its
            parent, inverting what elevation means. You do not have to remember this: a{" "}
            <Code>.surface-veil</Code> that finds itself inside another one turns opaque
            via a single descendant rule in <Code>globals.css</Code>. Both{" "}
            <Code>prefers-contrast: more</Code> and{" "}
            <Code>prefers-reduced-transparency</Code> collapse it to opaque as well.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="The primary action is ink, not accent"
        description="These used to be one token. Separating them is the single most visible change in the palette."
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
            Near-black is both the stronger and the more restrained move: it is
            unmistakably <em>the</em> action, it never argues with a success or warning
            colour, and it frees the accent to mean exactly two things — &ldquo;this is
            data&rdquo; and &ldquo;this is selected&rdquo;. White on it measures{" "}
            <strong>19.7:1</strong>.
          </p>
          <p>
            One detail worth copying: <Code>--color-action-hover</Code>{" "}
            <strong>lightens</strong> rather than darkens. At 15% L there is nowhere
            darker to go, and a hover that produces no visible change reads as a broken
            control.
          </p>
        </UXNote>
        <DontNote>
          <p>
            <strong>Do not roll the rest of the accent into black as well.</strong>{" "}
            Checkboxes, radios, switches, tab indicators, meter fills, sparklines and
            selected rows all stay on <Code>--color-accent</Code>. If everything
            interactive becomes ink, the page loses its only means of saying &ldquo;this
            one is on&rdquo; at a glance, and every data graphic turns into grey.
          </p>
        </DontNote>
      </DocSection>
      <DocSection
        title="The dim theme"
        description="Dark, deliberately not black — and the first real test of whether the three-layer token split was true."
      >
        <SpecTable
          columns={["Token", "Light", "Dim", "Note"]}
          rows={[
            ["--color-canvas", "96.5% L", "30% L", "Ground. Renders nearer #232b30 once the ambient scrim is over it."],
            ["--color-surface", "white", "34% L", "Raised. Lighter than the ground in BOTH themes — the doctrine does not invert."],
            ["--color-surface-sunken", "94% L", "25% L", "Inset. Darker than its parent surface in both."],
            ["--color-action", "graphite-950", "94% L", "The primary action INVERTS: near-black on light, near-white on dim."],
            ["--color-line", "14% black", "16% white", "Roughly double the alpha, because a light edge on dark reads weaker than the reverse."],
            ["--shadow-*", "full", "~⅓ opacity", "A drop shadow has no light to remove on a dark ground, so borders carry the elevation."],
          ]}
        />
        <UXNote title="It remaps the semantic layer and nothing else">
          <p>
            This file opens by claiming that retheming the product is a matter of
            remapping Layer 2. The dim theme is the first thing that exercised the
            claim, and it held: no base ramp moved, no component reads a different
            variable, and no call site knows a second theme exists. Everything is a{" "}
            <Code>:root[data-theme=&quot;dim&quot;]</Code> block in{" "}
            <Code>styles/tokens.css</Code>.
          </p>
          <p>
            Three things needed a change of <em>shape</em> rather than of value, and
            each is commented where it lives: the primary action inverts, borders take
            over from shadows, and both the glass and the ambient scrim flip direction.
            The scrim in particular had been three literals inside{" "}
            <Code>AmbientBackground</Code> — left alone they would have washed the dim
            canvas back toward pale grey.
          </p>
        </UXNote>
        <UXNote title="The dim theme is the more accessible of the two">
          <p>
            Measured on the raised 34% surface, which is the lightest thing text ever
            sits on here: ink 10.5:1, secondary 5.9:1, <strong>tertiary 4.7:1</strong>.
            All three clear 4.5 — and tertiary does <em>not</em> clear it in the light
            theme, where it sits around 4.6 against a much lighter ground. That is not
            the usual direction for a dark mode, and it is worth keeping true.
          </p>
          <p>
            <Code>--color-ink-muted</Code> is 3.0:1 in both themes and should stay
            there. It is placeholder and disabled text only; a disabled control that
            reads at full contrast is not disabled.
          </p>
        </UXNote>
      </DocSection>

    </>
  );
}
