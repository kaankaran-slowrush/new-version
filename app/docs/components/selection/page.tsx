import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";
import {
  CheckboxDemo,
  RadioDemo,
  SegmentedDemo,
  SliderDemo,
  SwitchDemo,
} from "./selection-demos";

export const metadata = { title: "Selection controls" };

export default function SelectionDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Primitives"
        title="Selection controls"
        lede="Switch, SegmentedControl, Slider, Checkbox and Radio. The first three are the only components in this kit permitted to use neumorphism, which makes this the page where that rule is actually explained."
      />

      <DocSection
        title="Picking the right control"
        description="Most selection bugs are really the wrong control, styled well."
      >
        <SpecTable
          columns={["Control", "Use when", "Not when"]}
          rows={[
            ["Switch", "The change takes effect immediately. One thing, on or off.", "There is a Save button — that is a Checkbox."],
            ["Checkbox", "A value in a form you submit later, or multiple independent selections.", "The options are mutually exclusive."],
            ["Radio", "Mutually exclusive options, 2–6, where all should be visible.", "More than about 6 — use Select."],
            ["SegmentedControl", "Switching the MODE of something that stays on screen. 2–5 options.", "The whole panel below changes — that is Tabs."],
            ["Slider", "Approximate magnitude where the exact number is secondary.", "The user needs to type or compare an exact value — use a number input."],
          ]}
        />
      </DocSection>

      <DocSection
        title="Why these three may use neumorphism"
        description="The narrow licence, and the reasoning behind it."
      >
        <UXNote title="The licence">
          <p>
            Neumorphism removes contrast <em>by design</em>: a control the same colour as
            its ground, separated only by a soft shadow. That fails WCAG 2.2 for non-text
            UI components and genuinely disappears on a laptop screen in sunlight. So it
            is not this system&apos;s language — it is a garnish with a narrow permit.
          </p>
          <p>
            The permit covers a <strong>small tactile control whose pressed-versus-raised
            physicality IS the information, and which carries no text</strong>. A switch
            is a thing that slides in a groove; a segmented control is a well with one
            segment lifted out of it; a slider is a thumb in a channel. In all three, the{" "}
            <Code>.neu-inset</Code> track and <Code>.neu-raised</Code> nub tell you which
            part moves — which no amount of flat styling communicates as directly.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Neumorphism never carries state on its own.</strong> The switch adds a
            solid accent fill when checked; the slider adds an accent-filled indicator;
            the segmented control&apos;s active segment is an opaque raised surface with
            full-contrast text. Strip the colour and every one of them becomes
            unreadable — which is exactly the trap neumorphic UI falls into when it is
            used as a whole design language instead of a texture.
          </p>
          <p>
            And: <strong>no text on a neumorphic surface.</strong> Labels live on opaque
            siblings. The segmented control is the edge case, and it survives only because
            the active segment is raised and opaque while inactive labels use{" "}
            <Code>text-ink-secondary</Code> on the sunken fill rather than relying on
            shadow for legibility.
          </p>
        </DontNote>

        <p className="text-ink-secondary">
          Under <Code>prefers-contrast: more</Code>, both{" "}
          <Code>.neu-inset</Code> and <Code>.neu-raised</Code> drop their shadows and take
          a real border instead. That fallback is why the treatment is defensible at all.
        </p>
      </DocSection>

      <DocSection title="Switch">
        <Example label="Live">
          <SwitchDemo />
        </Example>
        <SpecTable
          columns={["Detail", "Value"]}
          rows={[
            ["Track", "44 × 24px, fully rounded, .neu-inset"],
            ["Thumb", "20px, .neu-raised, translates 22px"],
            ["Checked", "Track gains bg-accent — colour carries the state, neumorphism carries the feel"],
            ["Label", "Optional; when present the whole label is a hit target via <label htmlFor>"],
            ["Disabled", "50% opacity + cursor-not-allowed"],
          ]}
        />
      </DocSection>

      <DocSection title="SegmentedControl">
        <Example label="Live — arrow keys move between segments" stack>
          <SegmentedDemo />
        </Example>
        <UXNote>
          <p>
            It is a <Code>radiogroup</Code> semantically, with a roving tabindex: one tab
            stop for the whole group, then arrow keys to move — matching native radio
            behaviour, because that is what this is. A row of independently tabbable
            buttons would make a four-option control cost four tab presses to pass.
          </p>
          <p>
            Cap it at about five segments. Past that, labels truncate and you have built a
            bad <Code>Select</Code>. Also resist animating the active segment&apos;s
            travel: mode switching is a many-times-a-day action and choreography makes
            fast interactions feel slow.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Slider">
        <Example label="Live">
          <SliderDemo />
        </Example>
        <UXNote>
          <p>
            <strong>The filled indicator is not optional.</strong> The neumorphic groove
            says &ldquo;something slides here&rdquo;; only the accent fill says{" "}
            <em>how much</em>. A purely neumorphic slider is the canonical illustration of
            the style failing — attractive, and impossible to read a value from.
          </p>
          <p>
            <strong>Always show the number</strong> (<Code>showValue</Code> defaults on).
            A slider communicates approximate magnitude well and exact value badly. The
            visible thumb is 20px but the pointer target is extended to ~44px with
            vertical padding on the control, so the groove can stay slim without the
            control being fiddly.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Checkbox and Radio">
        <Example label="Checkbox — options with descriptions" stack>
          <CheckboxDemo />
        </Example>
        <Example label="Radio — mutually exclusive" stack>
          <RadioDemo />
        </Example>
        <UXNote title="Both are bare controls by design">
          <p>
            Neither ships a built-in label or description prop. That is deliberate: the
            layouts they appear in vary too much (a compact row, a bordered card, a table
            cell) for one wrapper to serve them all, and a component that guesses wrong
            gets fought with <Code>className</Code> overrides forever.
          </p>
          <p>
            So you compose the label yourself — always wrapping in a{" "}
            <Code>&lt;label&gt;</Code> so the entire row becomes the hit target rather
            than just the 18px box. You can see the pattern in the webhook event list and
            in the share dialog&apos;s visibility cards.
          </p>
        </UXNote>
        <DontNote>
          <p>
            Do not use a Checkbox for something that applies instantly. If there is no
            Save button, the user has no model of when their change took effect — that is
            a Switch.
          </p>
        </DontNote>
      </DocSection>
    </>
  );
}
