import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";
import { Button, Badge } from "@/components/primitives";
import { Card, CardBody, SectionHeader } from "@/components/patterns";

export const metadata = { title: "Page & section headers" };

/* One source for the recipes, so the SpecTable below cannot drift from the live
   examples beside it. */
const TIERS = [
  {
    level: "1 · page",
    eyebrow: "yes",
    title: "serif 40 / 400",
    support: "16px, ink-secondary",
    where: "on the canvas, once per screen",
  },
  {
    level: "2 · section",
    eyebrow: "never",
    title: "serif 26 / 400",
    support: "14px, ink-secondary",
    where: "on the canvas",
  },
  {
    level: "3 · block",
    eyebrow: "never",
    title: "sans 16 / 600",
    support: "14px, ink-tertiary",
    where: "inside a surface",
  },
];

export default function HeadersDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Patterns"
        title="Page & section headers"
        lede="Every heading in the product is one of three tiers, and each one is the same triple: eyebrow, title, support. One component renders all three."
      />

      <DocSection
        title="The rule"
        description="One sentence, and everything else follows from it."
      >
        <Card elevation="sm" className="mb-6">
          <CardBody>
            <p className="text-base leading-relaxed text-ink">
              The <strong>serif/sans boundary</strong> and the{" "}
              <strong>canvas/surface boundary</strong> are the same boundary.
            </p>
            <p className="mt-3 max-w-measure text-sm text-ink-secondary">
              Above it you are naming a <em>place</em>, on the canvas, in the serif.
              Below it you are naming a <em>thing</em>, inside a surface, in the sans.
              That is why the split falls between h2 and h3 rather than anywhere else,
              and it is why <Code>CardTitle</Code> renders an <Code>h3</Code>.
            </p>
          </CardBody>
        </Card>

        <SpecTable
          columns={["Tier", "Eyebrow", "Title", "Support line", "Sits"]}
          rows={TIERS.map((t) => [t.level, t.eyebrow, t.title, t.support, t.where])}
        />

        <UXNote title="Why tier 3 is sans, and why that is not a taste call">
          <p>
            Instrument Serif ships exactly one weight — 400. It cannot gain contrast by
            getting bolder, only by getting bigger, so its floor is around 22px: below that, in
            a dense operator tool, it is texture rather than hierarchy. The tier under a
            section heading therefore has to change <strong>face</strong>, not merely
            shrink.
          </p>
          <p>
            This is a property of the face, not of the design. Swap in a display face
            with a real weight axis and the boundary moves — which is exactly why the
            constraint is written next to the <Code>font-weight: 400</Code> rule in{" "}
            <Code>app/globals.css</Code> rather than left as folklore.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The three tiers, live"
        description="Same component, same props, one number different."
      >
        <Example stack label="level={1} — the page header">
          <SectionHeader
            level={1}
            eyebrow="Platform"
            title="Run history"
            description="Every model execution in this workspace, with its status, duration and cost."
            className="mb-0"
          />
        </Example>

        <Example stack label="level={2} — a section of that page">
          <SectionHeader
            title="Continue where you left off"
            description="Sessions you have open, most recent first."
            action={<span>4 open</span>}
            className="mb-0"
          />
        </Example>

        <Example stack label="level={3} — a block inside a surface">
          <Card elevation="sm">
            <CardBody>
              <SectionHeader
                level={3}
                as="h2"
                title="Members"
                description="3 with access · 1 invited"
                action={
                  <Button variant="secondary" size="md">
                    Invite member
                  </Button>
                }
                className="mb-0"
              />
            </CardBody>
          </Card>
        </Example>
      </DocSection>

      <DocSection
        title="level is not the heading tag"
        description="They agree by default and legitimately disagree in two known cases."
      >
        <p className="mb-4 max-w-measure text-ink-secondary">
          <Code>level</Code> is what the thing <em>looks</em> like.{" "}
          <Code>as</Code> is where it sits in the document outline. The defaults pair
          them (1→h1, 2→h2, 3→h3), and most call sites never touch <Code>as</Code>. But
          the two are different questions and both have to stay sayable:
        </p>
        <SpecTable
          columns={["Where", "Props", "Why they disagree"]}
          rows={[
            [
              "settings/*",
              "level={3} as=\"h2\"",
              "The cards ARE the page's sections, so the outline wants h2 — but they read as blocks inside a surface, so the tier is 3.",
            ],
            [
              "login / signup",
              "level={2} as=\"h1\"",
              "One lonely form, so the outline wants a page title — but a 40px serif over a 320px card is absurd.",
            ],
          ]}
        />
        <UXNote>
          <p>
            This is why the face and the weight are written{" "}
            <strong>explicitly on the title</strong> rather than inherited from the tag.{" "}
            <Code>globals.css</Code> gives a bare <Code>h2</Code> the serif at 26px, which
            is right for a bare <Code>h2</Code>; the component overrides it so{" "}
            <Code>level={3} as=&quot;h2&quot;</Code> renders sans. Remove those explicit
            classes and the two silently re-couple.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Two support roles, not one"
        description="A sentence and a machine string are read differently, so they look different."
      >
        <SpecTable
          columns={["Prop", "Contains", "Example", "Rendered"]}
          rows={[
            [
              "description",
              "A sentence. Prose you have to read.",
              "“Revoke anything you do not recognise.”",
              "14px, capped at a measure",
            ],
            [
              "meta",
              "A machine string. Skim or skip.",
              "“1024 × 1024 · seed 88214”",
              "12px, ink-tertiary, level 3 only",
            ],
          ]}
        />
        <p className="mt-4 max-w-measure text-ink-secondary">
          <Code>ModelCard</Code> carries both at once — a vendor line and a description —
          which is the clearest argument that collapsing them into one prop would have
          been the wrong unification.
        </p>
      </DocSection>

      <DocSection
        title="Two “see all” idioms"
        description="One test tells you which."
      >
        <SpecTable
          columns={["Prop", "Use when", "Renders"]}
          rows={[
            [
              "href",
              "The section is a DOORWAY and what you see is a truncated sample. Rails.",
              "The title becomes the link, with a chevron.",
            ],
            [
              "action",
              "There is a peer destination but the section stands on its own.",
              "A trailing slot on the title's baseline.",
            ],
          ]}
        />
        <UXNote title="The action slot styles by inheritance">
          <p>
            The wrapper sets <Code>text-sm text-ink-secondary</Code>, so the common cases
            — a count, a date range, a running/idle line — pass a bare node with no
            classes at all. A link that wants to look like a link opts up with{" "}
            <Code>text-accent-ink</Code>, and opting up reads as intent. It is also{" "}
            <Code>items-center</Code> inside a <Code>self-baseline</Code> wrapper, which
            is what lets a 40px button sit on a 40px title&apos;s baseline without
            floating above it.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Getting it wrong">
        <DontNote>
          <p>
            <strong>Do not put an eyebrow on a section.</strong> It is level 1 only, and
            the type system enforces it. Every section having one is how the home page
            ended up opening five consecutive uppercase labels on the way down — an
            eyebrow answers “where am I” <em>before</em> you read the title, and that
            question is long answered by the third section.
          </p>
          <p>
            <strong>Do not use <Code>.eyebrow</Code> as a supporting line.</strong> The
            agents page rendered <Code>agent.tagline</Code> as an uppercase eyebrow
            <em>below</em> its title while the home page rendered the same field as plain
            14px text. One datum, two typographic identities, in one product.
          </p>
          <p>
            <strong>Do not pick <Code>level</Code> by how big you want it.</strong> Pick
            it by what the thing is — a page, a section of that page, or a block inside a
            surface. If the size is wrong for the tier, the layout is wrong, not the
            tier.
          </p>
          <p>
            <strong>Do not hand-write the block.</strong> Before this component existed
            the same four lines were copy-pasted four times into the home page alone, the
            support line had sixteen distinct spellings, and section headings shipped at
            four different sizes. <Code>SectionHeader</Code> is that block, once.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Where the recipes live"
        description="Three exports, so a component can share the type without adopting the markup."
      >
        <SpecTable
          columns={["Export", "Used by"]}
          rows={[
            [
              "headerTitleVariants",
              "CardTitle, ErrorState — anything that owns a title but has its own layout",
            ],
            ["headerSupportVariants", "The supporting sentence at any tier"],
            ["headerMetaVariants", "CardTitle's meta line"],
          ]}
        />
        <p className="mt-4 max-w-measure text-ink-secondary">
          <Code>DialogTitle</Code>, <Code>PopoverDescription</Code> and{" "}
          <Code>FieldDescription</Code> keep their own markup because they carry Base
          UI&apos;s <Code>aria-labelledby</Code> wiring — they share the recipe, not the
          component. Note that Base UI renders <Code>Dialog.Title</Code> as an{" "}
          <Code>h2</Code>, so it must carry explicit block-tier classes or it inherits the
          26px serif.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="neutral" size="md">components/patterns/section-header.tsx</Badge>
          <Badge variant="neutral" size="md">app/globals.css</Badge>
          <Badge variant="neutral" size="md">styles/tokens.css</Badge>
        </div>
      </DocSection>
    </>
  );
}
