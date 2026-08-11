import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Spacing & radius" };

const RADII = [
  { t: "rounded-xs", px: "6px", use: "Tiny chips, inline marks, focus ring" },
  { t: "rounded-sm", px: "8px", use: "Menu items, small controls" },
  { t: "rounded-md", px: "10px", use: "Buttons (sm/md), nav links" },
  { t: "rounded-lg", px: "14px", use: "Inputs, content pills" },
  { t: "rounded-xl", px: "16px", use: "Large buttons" },
  { t: "rounded-2xl", px: "18px", use: "Cards, floating panels" },
  { t: "rounded-3xl", px: "20px", use: "Dialogs, composer" },
  { t: "rounded-full", px: "999px", use: "Badges, avatars, the topbar pill" },
];

export default function SpacingDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Foundations"
        title="Spacing & radius"
        lede="A 4px base grid and an eight-step radius scale. The point of both is that no value is ever chosen ad hoc — inconsistent spacing is the clearest signal that a design has no system behind it."
      />

      <DocSection
        title="Spacing — 4px base"
        description="Tailwind's default spacing scale, kept as-is. What matters is not the numbers but using them at the right altitude."
      >
        <SpecTable
          columns={["Altitude", "Typical", "Where"]}
          rows={[
            ["Micro", "gap-1 – gap-2 (4–8px)", "Icon to its label; a dot to its text"],
            ["Component", "p-4 – p-6 (16–24px)", "Inside a card, a dialog, a panel"],
            ["Group", "gap-3 – gap-4 (12–16px)", "Between sibling cards in one section"],
            ["Section", "mb-10 – mb-14 (40–56px)", "Between major page regions"],
          ]}
        />

        <UXNote title="Breathe unevenly">
          <p>
            The most common spacing mistake is <strong>uniformity</strong> — the same gap
            everywhere, which flattens the page and forces the reader to work out the
            grouping themselves. Related things should sit tight and unrelated things
            should have real air between them; that contrast is what does the grouping
            for free.
          </p>
          <p>
            Concretely: a prompt and its result belong ~8px apart, while two separate
            turns belong ~24px apart. Same content, and the rhythm alone tells you where
            one thought ends.
          </p>
        </UXNote>

        <DontNote>
          <p>
            Never use negative margins to undo a parent&apos;s padding, and never use
            absolute positioning to escape layout flow. Both are signs the layout is
            being fought rather than described. Lay siblings out with{" "}
            <Code>flex</Code>/<Code>grid</Code> and <Code>gap</Code> — per-element
            margins silently collapse and double in ways gap does not.
          </p>
        </DontNote>
      </DocSection>

      <DocSection title="Radius scale">
        <Example label="rounded-xs → rounded-full">
          {RADII.map((r) => (
            <div key={r.t} className="flex flex-col items-center gap-2">
              <div
                className="size-16 bg-surface shadow-sm"
                style={{ borderRadius: `var(--radius-${r.t.replace("rounded-", "")})` }}
              />
              <span className="font-mono text-2xs text-ink-tertiary">{r.px}</span>
            </div>
          ))}
        </Example>

        <SpecTable
          columns={["Token", "Value", "Use for"]}
          rows={RADII.map((r) => [r.t, r.px, r.use])}
        />
      </DocSection>

      <DocSection
        title="Concentric radius"
        description="The rule that makes nested rounded elements look right — and the most common reason they look subtly wrong."
      >
        <Example label="Wrong vs. right">
          <div className="flex flex-col gap-2">
            <div className="rounded-2xl bg-surface p-3 shadow-sm">
              <div className="h-16 w-40 rounded-2xl bg-surface-sunken" />
            </div>
            <p className="text-xs text-danger">
              Same radius on parent and child — the corners fight
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="rounded-2xl bg-surface p-3 shadow-sm">
              <div className="h-16 w-40 rounded-md bg-surface-sunken" />
            </div>
            <p className="text-xs text-success">
              Child radius = parent radius − padding
            </p>
          </div>
        </Example>

        <p className="mb-5 text-ink-secondary">
          The rule: <Code>innerRadius = outerRadius − padding</Code>. An 18px card with
          12px of padding wants roughly a 6–10px radius on anything sitting inside it.
          When the child matches the parent, the two curves run at different distances
          from the same corner and the gap between them visibly tapers.
        </p>

        <UXNote>
          <p>
            This is also why radius <em>grows with control size</em> in this kit: a 52px
            button at 10px radius reads squarish, and a 32px button at 16px radius reads
            like a pill that lost its nerve. The <Code>Button</Code> size variants each
            carry their own matched radius rather than sharing one.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Layout widths">
        <SpecTable
          columns={["Token", "Value", "Use for"]}
          rows={[
            ["--page-max-width", "1180px", "Dashboard and list-page content"],
            ["--canvas-max-width", "640px", "The session working column, and long-form reading"],
            ["max-w-measure", "62ch", "Body copy measure. Opt-in per block, NOT a global rule — see /docs/patterns/headers"],
            ["--nav-height", "56px", "The centred topbar island. Moves with --control-height-md, which its pills track."],
            ["--rail-width-rest / -open", "184px / 300px", "Timeline rail, collapsed and hover-expanded"],
          ]}
        />
        <p className="text-ink-secondary">
          Proportions say something. A 640px working column inside a 1180px page is a
          statement that the artifact is the subject and everything else is support. If
          you cannot articulate what a proportion is claiming, it is probably not
          claiming anything — pick one that does.
        </p>
      </DocSection>
    </>
  );
}
