import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Progressive disclosure" };

export default function DisclosureDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Product UX"
        title="Progressive disclosure"
        lede="This product has genuinely a lot of controls. The answer is not fewer features or smaller text — it is showing each thing at the moment it becomes relevant, on a consistent set of triggers."
      />

      <DocSection
        title="Three triggers, and what each is for"
        description="The trigger is not an arbitrary choice. It encodes how often the content is needed and how deliberate the interaction is."
      >
        <SpecTable
          columns={["Trigger", "Use for", "Never use for"]}
          rows={[
            [
              "Always visible",
              "State that is glanceable-critical: is something running, has something failed, what mode am I in, what is my balance.",
              "Anything a user only needs while actively editing.",
            ],
            [
              "Hover / focus-within",
              "Context that helps when you are about to act: timestamps, thumbnails, mode tabs, status banners.",
              "Values the user needs to ADJUST — a row that vanishes when the pointer drifts is unusable.",
            ],
            [
              "Explicit click (pinned)",
              "Controls you deliberately change and want to keep open: model override, aspect ratio, duration, voice.",
              "Information you only need to read once.",
            ],
          ]}
        />
        <UXNote title="The rule that keeps this coherent">
          <p>
            <strong>Hover reveals; click pins.</strong> If the user is going to interact
            with the revealed thing more than momentarily, hover is the wrong trigger —
            because sustaining a hover while reaching for a control inside the revealed
            area is a fiddly, error-prone gesture. Anything adjustable needs a click that
            latches.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Case study: the composer"
        description="The most disclosed surface in the product, and the clearest demonstration of all three tiers."
      >
        <SpecTable
          columns={["Tier", "Shows", "Trigger"]}
          rows={[
            ["1 · Rest", "Mode glyph + input + send. Nothing else.", "Default"],
            ["2 · Engaged", "Panel lifts (translateY), mode tabs appear, generation-status and balance banners appear", "Hover or focus-within"],
            ["3 · Configuring", "Per-mode controls: model, aspect ratio, duration, voice, cost estimate", "Click the settings toggle — stays until dismissed"],
          ]}
        />
        <p className="mb-5 text-ink-secondary">
          The <Code>translateY</Code> lift in tier 2 is doing real work, not decoration:
          it gives physical feedback that the panel has come forward and become the
          active surface. Motion here communicates a change in focus.
        </p>
        <DontNote>
          <p>
            What this replaced: every one of those controls visible at once, which put a
            wall of pills and two sentences of status text under a text box. The result
            was that <strong>typing — the thing you came to do — was the least
            prominent element on screen</strong>, and the generated artifact above it had
            to fight the composer for attention.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Case study: the timeline rail"
        description="Same doctrine, plus one hard-won correction."
      >
        <p className="mb-5 text-ink-secondary">
          At rest the rail shows a type icon and a one-line prompt. On hover it widens
          and reveals the timestamp and a media thumbnail via opacity. Status marks —
          running, failed — never hide, in either state.
        </p>
        <UXNote title="The correction worth knowing about">
          <p>
            An earlier revision compressed the rest state to 140px, which truncated
            prompts to <Code>Minimal…</Code>, <Code>8s vi…</Code>,{" "}
            <Code>Write a sh…</Code>. That is compact-by-default taken past the point of
            usefulness: you could not tell one turn from another without hovering each
            one, which <strong>defeats the entire purpose of a persistent history
            rail</strong>. 184px is the floor where a row stays identifiable.
          </p>
          <p>
            The general lesson: <strong>compact has a floor, and the floor is
            legibility.</strong> Disclosure is meant to reduce noise, not to make the
            resting state a puzzle.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="What must never be disclosed away"
        description="Some things are exempt regardless of how much room you want back."
      >
        <ul className="space-y-2.5 text-ink-secondary">
          {[
            "Whether something is running or has failed. This is why status marks stay visible in the collapsed rail.",
            "The stop control on an in-flight operation. Override is never behind a hover.",
            "Cost, when a click will spend money.",
            "Session visibility. Who can see this is too consequential to require reopening a dialog.",
            "The current mode. Which of four things you are about to generate must be knowable at rest.",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="Implementation notes">
        <p className="mb-4 text-ink-secondary">
          Reveals use <Code>opacity</Code> paired with <Code>max-height</Code> or{" "}
          <Code>max-width</Code> — opacity for the fade, the max-* for reclaiming layout
          space. Transitioning <Code>max-height</Code> is a compromise (it is not a
          compositor-friendly property), but it is confined to small panels rather than
          long lists, which keeps the cost negligible.
        </p>
        <p className="text-ink-secondary">
          Hover states are always paired with <Code>focus-within</Code>, so keyboard
          users get the same reveal by tabbing into the region. A disclosure that only
          responds to a pointer is a disclosure that excludes people.
        </p>
      </DocSection>
    </>
  );
}
