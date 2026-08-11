import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";
import { SectionHeader } from "@/components/patterns";

export const metadata = { title: "Typography" };

/* ONE source for the scale. The live specimen below renders its own labels FROM
   this array rather than hard-coding them — the previous version wrote "Card
   title 16" as a string literal beside a table that said 16px, and when the token
   moved only one of them changed. A specimen that can disagree with its own spec
   table is worse than no specimen. */
const SCALE = [
  { token: "text-4xl", px: "52px", lh: "1.05", use: "The app hero's large-viewport step. One use, and it should stay that way." },
  { token: "text-3xl", px: "40px", lh: "1.12", use: "h1 — the page title. Serif." },
  { token: "text-2xl", px: "32px", lh: "1.22", use: "The large figure — a balance, a hero metric. NOT a heading." },
  { token: "text-xl", px: "26px", lh: "1.3", use: "h2 — the section heading. Serif." },
  { token: "text-lg", px: "20px", lh: "1.4", use: "Dialog titles, lg control variants" },
  { token: "text-base", px: "16px", lh: "1.55", use: "Body default, and h3 / card titles at 600" },
  { token: "text-sm", px: "14px", lh: "1.5", use: "Dense UI, pills, table rows, every support line" },
  { token: "text-xs", px: "12px", lh: "1.45", use: "Metadata, card meta lines" },
  { token: "text-2xs", px: "11px", lh: "1.4", use: "Uppercase eyebrows, badges" },
];

export default function TypographyDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Foundations"
        title="Typography"
        lede="Three voices, not one family at different sizes. Instrument Serif names places and regions; Inter Tight carries everything a person wrote; Geist Mono carries everything a machine measured. Nine steps from a 16px base, running at a 1.23–1.30 ratio from the large end down — wide enough that h1, h2 and h3 separate at a glance. The honest number underneath it is that 14px is what the product is actually read at, by a factor of five."
      />

      <DocSection title="The scale">
        <Example stack label="Live specimen">
          {SCALE.map((s) => (
            <p key={s.token} className={s.token}>
              {s.px} · {s.token}
            </p>
          ))}
        </Example>

        <SpecTable
          columns={["Token", "Size", "Line height", "Use for"]}
          rows={SCALE.map((s) => [s.token, s.px, s.lh, s.use])}
        />
      </DocSection>

      <DocSection
        title="Hierarchy comes from three levers, not one"
        description="Size is the weakest of the three. Weight and colour do more work, and cost less vertical space."
      >
        <Example label="Same 16px size, three tiers">
          <div className="space-y-1">
            <p className="text-base font-semibold text-ink">Ticket Triage</p>
            <p className="text-base font-medium text-ink-secondary">Support · live</p>
            <p className="text-base text-ink-tertiary">Last run 12 minutes ago</p>
          </div>
        </Example>

        <UXNote>
          <p>
            All three lines above are the same size. They separate cleanly because
            weight and colour vary together — which is more legible than two regular
            weights two points apart, and keeps dense layouts from ballooning.
          </p>
          <p>
            The practical test: <strong>squint at the screen.</strong> If you cannot
            tell heading from body from label with your eyes blurred, the hierarchy is
            too weak — regardless of what the numbers say.
          </p>
        </UXNote>

        <DontNote>
          <p>
            Do not reach for a bigger size when what you need is more weight or more
            contrast. Stepping a label from 14px to 16px to make it &ldquo;stand
            out&rdquo; usually just makes it collide with body copy; going from{" "}
            <Code>font-medium text-ink-tertiary</Code> to{" "}
            <Code>font-semibold text-ink</Code> at the same size reads louder and
            costs nothing.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Mono is a semantic choice"
        description="The mono is not decoration, and it is no longer the heading face. It marks one specific class of content."
      >
        <Example stack label="What gets mono">
          <div className="space-y-2 font-mono text-sm">
            <p>RUN-2891</p>
            <p className="tabular">212ms · 1,204 tokens</p>
            <p className="tabular">$844.36</p>
            <p>14:32</p>
          </div>
          <p className="max-w-measure text-sm text-ink-secondary">
            Identifiers, latencies, token counts, currency, timestamps, code. Anything
            a user might compare across rows, or copy exactly.
          </p>
        </Example>

        <UXNote title="Always pair mono with tabular numerals">
          <p>
            Add the <Code>tabular</Code> class (
            <Code>font-variant-numeric: tabular-nums</Code>) to <strong>any</strong>{" "}
            number that can change. Without it, proportional digits have different
            widths, so a latency counting from 99ms to 100ms visibly shifts its own
            column — and a table of figures never quite lines up. This is one of the
            cheapest polish wins available and one of the most commonly missed.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Details that are already handled globally">
        <SpecTable
          columns={["Rule", "Applied to", "Why"]}
          rows={[
            [
              "text-wrap: balance",
              "All headings",
              "Prevents a two-word orphan on the last line of a heading.",
            ],
            [
              "text-wrap: pretty",
              "All paragraphs",
              "Avoids single-word final lines in body copy.",
            ],
            [
              "font-size + line-height",
              "h1 · h2 · h3 · h4–h6",
              "40 · 26 · 16 · 14. A bare heading tag is already correct — that is new, and it is what stopped every call site from picking its own size.",
            ],
            [
              "letter-spacing: --tracking-title",
              "h1–h6",
              "Large type reads loose at default tracking; tightening it is what makes headings look set rather than typed. h1 and h2 then override it with their own.",
            ],
            [
              "font-weight: 400 + font-synthesis-weight: none",
              "h1 and h2",
              "Instrument Serif ships one weight. Asking for 600 made the browser smear the 400 outlines into a fake bold — the guard makes a stray font-semibold a no-op instead.",
            ],
            [
              "-webkit-font-smoothing: antialiased",
              "body",
              "macOS renders both faces noticeably heavy without it.",
            ],
          ]}
        />
        <p className="text-ink-secondary">
          You do not need to re-apply any of these per component — they live in{" "}
          <Code>app/globals.css</Code>. Two things are deliberately NOT in that list.
          Uppercase labels need their own treatment, because capitals set tight are hard
          to read — that is the <Code>.eyebrow</Code> utility below.{" "}
          <strong>And there is no global measure rule.</strong> This page used to claim
          one; there never was, and the reality was nine different hand-written caps.
          Capping a column is a per-block decision, so it is a class you opt into —{" "}
          <Code>max-w-measure</Code> at 62ch, or <Code>max-w-measure-narrow</Code> at
          46ch for a centred blurb.
        </p>
      </DocSection>

      <DocSection
        title="Three voices: display, body, data"
        description="A serif names places, a sans carries what people wrote, a mono carries what the machine measured."
      >
        <p className="mb-4 text-ink-secondary">
          Every heading in this product used to be the <em>data</em> face at a larger
          size — Geist Mono doing double duty. That is why the hierarchy read as{" "}
          <em>bigger text</em> rather than as a voice: size is the weakest of the three
          available levers, and it was doing all the work. Splitting display away from
          data is what gives each of the three a single job.
        </p>
        <SpecTable
          columns={["Element", "Face", "Names…"]}
          rows={[
            ["h1 — page title", "serif, 400, 34px, tracking -0.015em", "a PLACE you navigated to"],
            ["h2 — section heading", "serif, 400, 22px, tracking -0.012em", "a REGION of that place"],
            ["h3 — block / card title", "sans, 600, 15px, tracking -0.011em", "a THING inside it"],
            ["body, labels, eyebrows", "--font-sans", "something a person wrote"],
            ["IDs, latencies, costs, timestamps", "--font-mono + .tabular", "something a machine measured"],
          ]}
        />
        <UXNote title="Why a serif, and why the line falls between h2 and h3">
          <p>
            Every product in this category ships a grotesque or a mono — without
            exception. A serif display is the one choice a screenshot of this product
            cannot be mistaken for someone else&apos;s, which is what justifies the second
            webfont that the previous mono display was chosen to avoid. It is paired with
            Inter Tight rather than a companion drawn alongside it, deliberately: a
            companion agrees with the serif, but a neutral grotesque gets out of its way
            entirely, and the serif is the only thing on the page that should have an
            opinion.
          </p>
          <p>
            <strong>The split falls between h2 and h3 because the face runs out.</strong>{" "}
            Instrument Serif ships exactly one weight — 400 — so it cannot gain contrast by
            getting bolder, only by getting bigger. Its floor is 22px; at 15px in a dense
            operator tool it is texture rather than hierarchy. The tier below a section
            heading therefore has to change <em>face</em>, not merely shrink. That is a
            constraint of the face and not a taste call — swap in a display face with a
            real weight axis and this boundary moves. It is also why{" "}
            <Code>CardTitle</Code> renders <Code>h3</Code> by default: the rule and the
            markup were designed to agree, so no call site has to opt in.
          </p>
          <p>
            <strong>Mono&apos;s job got narrower again.</strong> It used to carry four
            unrelated things: data, the wordmark, every uppercase micro-label, and every
            heading. Eyebrows moved to sans and headings moved to the serif, so mono now
            means exactly one thing: the machine speaking.
          </p>
        </UXNote>
        <UXNote title="Tracking belongs to the face, not to the size">
          <p>
            Both display tracking values loosened when the face changed —{" "}
            <Code>-0.03em</Code> to <Code>-0.015em</Code> for h1. That is not a taste
            adjustment. A monospace starts out wide and has to be pulled in hard; a serif
            set that tight collides its own serifs and the headline turns to mush. Any
            team swapping the face has to move these tokens with it — which is also why{" "}
            <Code>--tracking-mono</Code> exists: the wordmark&apos;s tracking belongs to
            Geist Mono, not to the size it happens to be set at.
          </p>
        </UXNote>
        <UXNote title="Two files to swap the whole system">
          <p>
            <Code>app/fonts.ts</Code> loads the faces and <Code>styles/tokens.css</Code>{" "}
            maps them to the three roles, and <Code>app/globals.css</Code> sizes the
            heading tags. Nothing else in the kit names a typeface — no
            component and no page hard-codes a family, and h1/h2 pick up the display face
            from a single rule in <Code>globals.css</Code>. Three alternative systems
            (Technical, Machine, Grotesk) are written out as recipes in the header comment
            of <Code>app/fonts.ts</Code>.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The .eyebrow utility"
        description="One definition, replacing six. The subtitle pairing, too."
      >
        <Example label="An eyebrow, a page title, and its support line">
          <SectionHeader
            level={1}
            eyebrow="Foundations"
            title="Typography"
            description="Three axes change between the title and this line: family, weight, and rhythm."
            className="mb-0"
          />
        </Example>
        <p className="mb-4 text-ink-secondary">
          There were previously <strong>six</strong> hand-written eyebrow recipes —
          tracking of 0.14, 0.12, 0.1, 0.08 and 0.06em plus Tailwind&apos;s{" "}
          <Code>tracking-wide</Code> — split across two font families with no rule about
          which to use where. Nobody was choosing between them; each file inherited
          whatever the last one did. They are now one utility.
        </p>
        <UXNote title="It is deliberately unlayered">
          <p>
            Tailwind&apos;s layer order is <Code>theme, base, components, utilities</Code>,
            so a utility beats anything in a layer — <Code>eyebrow text-xs</Code> used to
            silently win and reopen the six-recipes problem the utility exists to close.
            The rule therefore sits <em>outside</em> every layer, where a normal
            declaration outranks all of them. Colour, margin and display stay overridable,
            which covers every legitimate use. The escape hatch is <Code>text-xs!</Code>,
            and reaching for it is a smell: a second size is a second utility, not an
            override.
          </p>
        </UXNote>
        <DontNote>
          <p>
            An eyebrow belongs above a <strong>page</strong> title, or on a group of
            controls that has no title of its own. It is not a section heading&apos;s
            kicker and it is not a supporting line. Both were tried: the first put five
            consecutive uppercase labels down the home page, and the second gave one
            datum two typographic identities on two different screens.
          </p>
        </DontNote>
        <UXNote title="Colour is deliberately not part of it">
          <p>
            <Code>.eyebrow</Code> sets size, weight, tracking and case, and stops there.
            The ink level depends on what it sits on: <Code>ink-secondary</Code> on the
            canvas — the ambient layer makes anything lighter illegible, see{" "}
            <Code>Color</Code> — and <Code>ink-tertiary</Code> on a surface.
          </p>
        </UXNote>
        <UXNote title="The title / support pair changes on more than size">
          <p>
            The title is the display serif; the support line is the body sans at a smaller
            size and a lighter ink. Family, weight and rhythm all shift, so the pair reads
            as <em>a name and then an explanation</em> rather than as one sentence in two
            sizes. Differentiating by size alone — which is what this used to do — is the
            weakest version of the same idea. The full three-tier pattern, and which tier
            to reach for, is at <Code>/docs/patterns/headers</Code>.
          </p>
        </UXNote>
      </DocSection>
    </>
  );
}
