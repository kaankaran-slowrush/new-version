import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Porting guide" };

export default function PortingDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Overview"
        title="Porting guide"
        lede="How to get this design system into a production codebase — whether or not that codebase uses Tailwind. The tokens are the contract; everything else is convenience."
      />

      <DocSection
        title="The three-layer token architecture"
        description="Understanding this is most of the work. Only the middle layer matters to components."
      >
        <SpecTable
          columns={["Layer", "Example", "Who references it"]}
          rows={[
            [
              "1 · Base",
              "--color-graphite-300, --color-signal-700",
              "Only the semantic layer. Never a component.",
            ],
            [
              "2 · Semantic",
              "--color-surface, --color-ink-secondary, --color-accent",
              "Every component, exclusively.",
            ],
            [
              "3 · Component",
              "--control-height-lg, --rail-width-rest",
              "One component each — a knob for retuning without touching semantics.",
            ],
          ]}
        />
        <UXNote title="Why the indirection is worth it">
          <p>
            Because <strong>retheming becomes one file</strong>. A dark theme, a
            white-label variant, or a contrast-boosted mode is a remap of layer 2 — no
            component changes. If components referenced{" "}
            <Code>--color-graphite-100</Code> directly, every one of them would encode
            the assumption &ldquo;light theme,&rdquo; and you would be doing a
            find-and-replace across the codebase instead.
          </p>
          <p>
            The rule that makes it hold: <strong>if you find yourself reaching for a
            base ramp inside a component, the semantic layer is missing a token.</strong>{" "}
            Add it there rather than reaching past it.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Path A — you are on Tailwind v4">
        <p className="mb-4 text-ink-secondary">The easy case. Copy three things:</p>
        <ol className="mb-6 space-y-2 text-ink-secondary">
          <li>
            1 · <Code>styles/tokens.css</Code> — the whole file.
          </li>
          <li>
            2 · <Code>styles/animations.css</Code> — the whole file.
          </li>
          <li>
            3 · The <Code>@layer base</Code> and <Code>@layer components</Code> blocks
            plus the accessibility media queries from <Code>app/globals.css</Code>.
          </li>
        </ol>
        <p className="text-ink-secondary">
          Component files then drop in unchanged. Install{" "}
          <Code>@base-ui/react</Code>, <Code>class-variance-authority</Code>,{" "}
          <Code>clsx</Code>, <Code>tailwind-merge</Code>, <Code>lucide-react</Code>, and
          copy <Code>lib/cn.ts</Code>.
        </p>
      </DocSection>

      <DocSection title="Path B — you are on Tailwind v3">
        <p className="mb-4 text-ink-secondary">
          <Code>@theme</Code> does not exist in v3, so the token block needs relocating:
        </p>
        <SpecTable
          columns={["What", "How"]}
          rows={[
            [
              "Tokens",
              "Keep tokens.css as plain CSS by changing @theme { … } to :root { … }. Then mirror the names you want as utilities into tailwind.config.ts under theme.extend, pointing at the variables (e.g. colors: { surface: 'var(--color-surface)' }).",
            ],
            [
              "Arbitrary-var syntax",
              "v4's h-(--token) shorthand is not supported. Rewrite as h-[var(--token)] — mechanical find-and-replace across the component files.",
            ],
            [
              "Nested @layer components",
              "Works in v3, but the .glass ::before barrier layer needs no change.",
            ],
            [
              "OKLCH",
              "Fine in every browser this project targets. If you must support older ones, add a hex fallback declaration before each oklch() line — do not convert the ramps, or you lose the perceptual spacing.",
            ],
          ]}
        />
      </DocSection>

      <DocSection title="Path C — you do not use Tailwind at all">
        <p className="mb-4 text-ink-secondary">
          <Code>tokens.css</Code> is valid plain CSS (after swapping{" "}
          <Code>@theme</Code> for <Code>:root</Code>). Import it once and read{" "}
          <Code>var(--color-surface)</Code> from CSS Modules, styled-components,
          vanilla-extract, or plain stylesheets. You lose the utility classes; you keep
          the entire design system.
        </p>
        <p className="mb-4 text-ink-secondary">
          For the components themselves, do not try to translate class strings. Instead
          read each component&apos;s page in these docs — every one lists its concrete
          measurements (heights, radii, padding, type size, weight, colour token) in a
          spec table precisely so it can be rebuilt in another styling layer without
          reverse-engineering Tailwind.
        </p>
        <p className="text-ink-secondary">
          Base UI is styling-agnostic, so the accessibility and interaction behaviour
          ports even if the styling does not: keep the <Code>Dialog.Root</Code> /{" "}
          <Code>Popup</Code> / <Code>Backdrop</Code> structure and attach your own class
          names.
        </p>
      </DocSection>

      <DocSection
        title="Non-negotiables"
        description="These are not stylistic preferences. Dropping any one of them breaks something real."
      >
        <ul className="space-y-3 text-ink-secondary">
          {[
            ["Glass stays chrome-only, with its barrier layer.", "Put glass on body content or on a dropdown and text contrast becomes a matter of luck."],
            ["Neumorphism stays on small text-free tactile controls.", "It removes contrast by design; widening its remit is how the interface fails an audit."],
            ["Keep all three accessibility media queries.", "They are the reason the atmospheric treatment is defensible at all."],
            ["Status pairs colour with shape or icon, always.", "Colour-only state fails colourblind users, greyscale, and screenshots."],
            ["One accent hue.", "A second one dilutes both and destroys 'find the primary action' scanning."],
            ["The tabular class on any number that can change.", "Otherwise the layout shifts under its own data."],
            ["Focus styling stays global.", "Per-component rings drift, and one eventually goes missing entirely."],
          ].map(([rule, why]) => (
            <li key={rule} className="rounded-2xl bg-surface p-4 shadow-sm">
              <p className="mb-1 font-medium text-ink">{rule}</p>
              <p className="text-sm">{why}</p>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="What this kit does not give you">
        <DontNote>
          <p>
            There is <strong>no business logic anywhere in this repo</strong> — by
            design. You still own: data fetching and caching, generation streaming and
            job polling, auth and session handling, billing and metering, permissions,
            real file upload/storage, and the agent runtime itself.
          </p>
          <p>
            Component props are shaped to receive that data, and{" "}
            <Code>lib/mock/</Code> shows the expected shapes. Where an action is implied,
            the component takes a callback prop rather than doing the work — e.g.{" "}
            <Code>CopyField</Code> takes <Code>onCopy</Code> and never touches the
            clipboard itself.
          </p>
        </DontNote>
      </DocSection>

      <DocSection title="Suggested adoption order">
        <ol className="space-y-2.5 text-ink-secondary">
          {[
            "Tokens + globals + animations. Nothing else works without these, and on their own they already shift the product's look.",
            "cn() and Button. Button is the reference component — matching its conventions keeps everything after it consistent.",
            "The primitives you actually use. You do not need all of them on day one.",
            "Patterns (Card, DataTable, EmptyState, StatusMark). These are where visual consistency across pages comes from.",
            "Chrome (TopNav). Highest-visibility change, so worth doing once the vocabulary beneath it is stable.",
            "Page-by-page migration, leaning on the patterns rather than rebuilding layouts by hand.",
          ].map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="font-mono text-sm text-accent-ink">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </DocSection>
    </>
  );
}
