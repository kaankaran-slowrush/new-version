import { Search } from "lucide-react";
import { Input, Textarea } from "@/components/primitives";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Input & Textarea" };

export default function InputDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Primitives"
        title="Input & Textarea"
        lede="Text entry. Both are inset rather than raised, which is the single most important thing about how they look."
      />

      <DocSection
        title="Inputs are inset, not raised"
        description="A field is a well that receives content. Cards and buttons come toward you; inputs go into the page."
      >
        <Example label="Sizes sm · md · lg" stack>
          <Input size="sm" placeholder="Small" className="max-w-xs" />
          <Input size="md" placeholder="Medium (default)" className="max-w-xs" />
          <Input size="lg" placeholder="Large" className="max-w-xs" />
        </Example>

        <UXNote>
          <p>
            The fill is <Code>--color-surface-sunken</Code>, never{" "}
            <Code>--color-surface</Code>. That single choice does most of the work of
            signalling &ldquo;type here&rdquo; without needing a heavy border — and it is
            why fields in this kit read correctly on a card, which is itself white.
            An input the same colour as the card it sits on has to fall back to a border
            for definition, and borders-plus-elevation is where light UI starts looking
            cheap.
          </p>
        </UXNote>

        <SpecTable
          columns={["Size", "Height", "Radius", "Text", "Use for"]}
          rows={[
            ["sm", "32px", "10px", "13px", "Dense toolbars, inline filters"],
            ["md", "36px", "14px", "13px", "Default — most forms"],
            ["lg", "44px", "14px", "15px", "Auth screens, primary forms, touch"],
          ]}
        />
      </DocSection>

      <DocSection title="Icon slots">
        <Example label="Leading and trailing content" stack>
          <Input
            placeholder="Search runs…"
            startIcon={<Search />}
            className="max-w-xs"
            aria-label="Search"
          />
          <Input
            placeholder="0.00"
            className="max-w-xs pl-7 font-mono"
            aria-label="Amount"
          />
        </Example>
        <p className="text-ink-secondary">
          A leading icon is for <em>identifying</em> the field&apos;s purpose (a
          magnifier, a currency symbol) — not for decoration. If the label already says
          &ldquo;Search&rdquo;, the magnifier is redundant and can go.
        </p>
      </DocSection>

      <DocSection title="Invalid and disabled">
        <Example label="States" stack>
          <Input
            defaultValue="not-an-email"
            invalid
            aria-invalid
            aria-describedby="email-err"
            className="max-w-xs"
            aria-label="Email"
          />
          <p id="email-err" className="text-sm text-danger">
            Enter an email address including the @ symbol.
          </p>
          <Input disabled placeholder="Disabled" className="max-w-xs" />
        </Example>

        <DontNote>
          <p>
            <strong>A red border is not an error message.</strong> Colour alone tells a
            colourblind user nothing, and tells everyone else nothing about{" "}
            <em>what</em> is wrong. Always pair <Code>invalid</Code> with visible text,
            and wire it up with <Code>aria-describedby</Code> so the message is announced
            with the field rather than floating unattached.
          </p>
          <p>
            Also: say what to do, not what happened.{" "}
            <em>&ldquo;Enter an email address including the @ symbol&rdquo;</em> beats{" "}
            <em>&ldquo;Invalid email&rdquo;</em>.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Textarea"
        description="Grows with content up to a ceiling, then scrolls."
      >
        <Example label="Auto-growing" stack>
          <Textarea
            placeholder="Describe the image you want to generate…"
            className="max-w-md"
            aria-label="Prompt"
          />
        </Example>
        <UXNote>
          <p>
            It starts at 52px — the same height as a large control — so a single-line
            prompt does not look like it is asking for an essay, and it expands to about
            140px before scrolling internally. The ceiling matters: an unbounded textarea
            in the composer would push the canvas off screen as someone typed.
          </p>
          <p>
            <Code>resize: none</Code> is deliberate. Manual resize handles let a user
            drag a field into a layout that was never designed, and the auto-grow makes
            them unnecessary.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Labels are not optional">
        <SpecTable
          columns={["Situation", "What to do"]}
          rows={[
            ["Normal form field", "A visible <label htmlFor> above it. Placeholder text is not a label — it disappears the moment someone types, taking the field's identity with it."],
            ["Space-constrained (toolbar filter)", "Visually hidden label or aria-label. Never nothing."],
            ["Error text", "aria-describedby pointing at the message element."],
            ["Optional vs required", "Mark whichever is rarer. If most fields are required, mark the optional ones."],
          ]}
        />
      </DocSection>
    </>
  );
}
