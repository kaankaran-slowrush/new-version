import Link from "next/link";
import { ArrowRight, Download, Plus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/primitives";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Button" };

export default function ButtonDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Primitives"
        title="Button"
        lede="The reference component for this kit. Every other component follows the conventions established here, so it is worth reading this page even if you never need a button."
      />

      <DocSection
        title="Variants"
        description="Six, each with a specific job. If you cannot say which job you need, you want secondary."
      >
        <Example label="All variants at size md">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost-danger">Ghost danger</Button>
          <Button variant="link">Link</Button>
        </Example>

        <SpecTable
          columns={["Variant", "Use for", "Notes"]}
          rows={[
            ["primary", "The one high-emphasis action on the view", "INK fill (--color-action), not accent. One per view — if two things are primary, neither is."],
            ["secondary", "Most actions. The default.", "White surface + elevation. Reads as a real, liftable object."],
            ["ghost", "Toolbars and dense rows", "No box at rest. A bordered button every 40px turns a table into a grid of boxes."],
            ["danger", "Destructive confirmation, inside a dialog", "Solid red. Reserve it for the moment of commitment."],
            ["ghost-danger", "Destructive action in a row or list", "Red text, no fill. Keeps red from shouting at rest across a whole table."],
            ["link", "Inline text action inside a sentence", "No box at all. Height and padding are stripped."],
          ]}
        />

        <UXNote title="Why danger has two variants">
          <p>
            A table with eight rows, each carrying a solid red Delete button, is a page
            that looks like it is on fire. Red at rest should be rare, so list-level
            destructive actions use <Code>ghost-danger</Code> and the solid fill is saved
            for the confirmation dialog, where alarm is appropriate and there is exactly
            one of them.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Sizes"
        description="Four, mapped to the shared control rhythm so buttons line up with inputs and selects."
      >
        <Example label="sm → xl">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra large</Button>
        </Example>

        <SpecTable
          columns={["Size", "Height", "Radius", "Text", "Touch-safe alone?"]}
          rows={[
            ["sm", "32px", "10px", "13px", "No — desktop-dense contexts only"],
            ["md", "36px", "10px", "13px", "Borderline; fine on desktop"],
            ["lg", "44px", "14px", "15px", "Yes — the WCAG 2.2 target-size floor"],
            ["xl", "52px", "16px", "15px / 600", "Yes — hero actions"],
          ]}
        />

        <UXNote title="Radius grows with size on purpose">
          <p>
            A 52px button at a 10px radius reads squarish; a 32px button at a 16px radius
            reads like a pill that lost its nerve. Each size variant carries its own
            matched radius rather than all four sharing one — the ratio of radius to
            height is what your eye actually reads.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Icons, loading, and full width">
        <Example label="Icon slots">
          <Button startIcon={<Plus />}>Create</Button>
          <Button endIcon={<ArrowRight />}>Continue</Button>
          <Button variant="ghost" startIcon={<Download />}>
            Download
          </Button>
          <Button variant="ghost-danger" startIcon={<Trash2 />}>
            Delete
          </Button>
          <Button iconOnly aria-label="Add item">
            <Plus />
          </Button>
        </Example>

        <Example label="Loading — note the width does not change">
          <Button variant="primary" loading>
            Generate
          </Button>
          <Button variant="secondary" loading>
            Save changes
          </Button>
        </Example>

        <UXNote>
          <p>
            <strong>Loading keeps the label in the flow at zero opacity</strong> so the
            button&apos;s width is stable. A button that shrinks to fit a spinner moves
            everything next to it, mid-click — one of the most common and most avoidable
            layout jumps in a form.
          </p>
          <p>
            The indicator is three pulsing marks rather than a rotating spinner, matching
            the working-state vocabulary used elsewhere in the product. And{" "}
            <Code>loading</Code> sets both <Code>disabled</Code> and{" "}
            <Code>aria-busy</Code>, so a double-submit is impossible and screen readers
            are told what is happening.
          </p>
        </UXNote>

        <Example label="Full width — for forms and narrow cards" stack>
          <div className="w-full max-w-xs space-y-2">
            <Button variant="primary" size="lg" fullWidth>
              Sign in
            </Button>
            <Button variant="secondary" size="lg" fullWidth>
              Continue with SSO
            </Button>
          </div>
        </Example>
      </DocSection>

      <DocSection title="States">
        <Example label="Default · hover (try it) · disabled">
          <Button variant="primary">Enabled</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
          <Button variant="ghost" disabled>
            Disabled
          </Button>
        </Example>
        <p className="mb-5 text-ink-secondary">
          Focus is not styled here — it comes from the global{" "}
          <Code>:focus-visible</Code> rule. Tab to any button above to see it. Disabled is
          conveyed by <strong>both</strong> colour and{" "}
          <Code>cursor: not-allowed</Code>, never colour alone.
        </p>
        <DontNote>
          <p>
            When you disable a button, <strong>say why nearby</strong>. A dead button with
            no explanation reads as a bug. The composer does this: an unaffordable
            generation disables send <em>and</em> shows a banner naming the two figures,
            with the reason also in the button&apos;s <Code>aria-label</Code>.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Navigation: use buttonVariants, not Button"
        description="The one gotcha worth knowing before you copy this component."
      >
        <Example label="A Link styled as a button">
          <Link href="/agents" className={buttonVariants({ variant: "primary", size: "lg" })}>
            <Plus />
            Open Agents
          </Link>
          <Link href="/docs" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            Read the docs
          </Link>
        </Example>

        <UXNote title="Why the variants live in their own file">
          <p>
            <Code>button.tsx</Code> carries <Code>&quot;use client&quot;</Code> (consumers
            attach <Code>onClick</Code>), which makes everything it exports a client
            binding. A server component calling <Code>buttonVariants()</Code> from there
            fails at build time.
          </p>
          <p>
            So the cva map lives in <Code>button-variants.ts</Code> with no directive —
            variant maps are pure string builders with no runtime. Both environments can
            import it, which matters because{" "}
            <strong>styling a Link as a button in a server-rendered page is the single
            most common thing you will do with this component.</strong>
          </p>
          <p>
            Never nest a <Code>&lt;button&gt;</Code> inside an{" "}
            <Code>&lt;a&gt;</Code> to get around it — that is invalid HTML and it breaks
            keyboard semantics.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="The conventions this component sets">
        <SpecTable
          columns={["Convention", "Why"]}
          rows={[
            ["cva for the variant × size matrix", "Every legal combination is readable in one place, and the API documents itself."],
            ["className merged LAST through cn()", "A caller can always override. Without tailwind-merge, a component's default padding could silently beat the override passed in."],
            ["Native element + forwardRef", "No wrapper div, no lost ref, no broken focus management."],
            ["No per-component focus ring", "One global rule means one consistent ring, and none can go missing."],
            ["Variant classes written literally inside cva", "Tailwind's scanner cannot see a class built by string concatenation. `size-${x}` produces no CSS."],
            ["scale(0.97) on :active", "Tactile receipt that the click landed — the cheapest perceived-performance win there is."],
          ]}
        />
      </DocSection>
    </>
  );
}
