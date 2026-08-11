import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Agent UX doctrine" };

export default function AgentUxDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Product UX"
        title="Agent UX doctrine"
        lede="An interface where an agent acts on the user's behalf needs patterns a normal chat UI does not. These six rules are the ones that matter, and they are the part of this kit that transfers judgment rather than markup."
      />

      <DocSection
        title="1 · No blank chat"
        description="A user cannot open an empty chat box and type. A session always begins by choosing an agent."
      >
        <UXNote>
          <p>
            This is the single most consequential IA decision in the product. A blank
            prompt box is an <strong>infinite-affordance surface</strong>: it accepts
            anything and promises nothing, so the user&apos;s first move is a guess,
            and their first result is usually a disappointment they blame on the
            product.
          </p>
          <p>
            Choosing an agent first turns that into a bounded promise. The agent card
            states what it produces before a single keystroke, which is why{" "}
            <Code>/agents</Code> is agent-picker-first and the session list sits{" "}
            <em>below</em> it — leading with history would bury the only way to start.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="2 · Capability transparency"
        description="The user knows what an agent can and cannot do before typing — not by hitting a failure."
      >
        <p className="mb-5 text-ink-secondary">
          Implemented as a persistent capability row: on the agent card in the hub, and
          again in the session header where it stays visible for the entire
          conversation. It is never a one-time tooltip or an onboarding step, because
          the question &ldquo;can this thing make audio?&rdquo; recurs.
        </p>
        <DontNote>
          <p>
            The failure mode this prevents: a user asks for something out of scope, gets
            a refusal or a wrong-modality answer, and concludes the agent is bad rather
            than mis-aimed. <strong>A capability discovered by failure is a capability
            you did not communicate.</strong>
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="3 · Honest working states"
        description="Media generation takes real seconds. The interface must say what is happening, not merely that something is."
      >
        <SpecTable
          columns={["Medium", "Working state", "Why this one"]}
          rows={[
            ["Text", "Streams token by token", "Streaming is already an honest progress signal — nothing to add."],
            ["Image", "Sheen sweep across a correctly-sized placeholder", "Nothing meaningful to report mid-render, so the state conveys 'alive' without inventing fake stages."],
            ["Video", "Real stage labels: Preparing scene → Rendering frames → Finalizing", "Video has genuinely distinct phases, and a 40-second wait with no narration feels broken."],
            ["Audio", "Waveform filling bar by bar", "Uses the medium's own visual language; a rectangle would say nothing about sound."],
          ]}
        />
        <UXNote title="Two rules inside this one">
          <p>
            <strong>Size the placeholder to the output.</strong> The working state claims
            the eventual aspect ratio up front so nothing reflows when the result lands.
            A layout that jumps at completion is worse than a slower one — the user has
            already started moving their cursor toward where they expect the artifact.
          </p>
          <p>
            <strong>Stay legible without motion.</strong> Each placeholder carries a
            static icon and a text stage label, so with{" "}
            <Code>prefers-reduced-motion</Code> — or in a screenshot — it still reads as
            &ldquo;working&rdquo; rather than as an empty grey box.
          </p>
        </UXNote>
        <DontNote>
          <p>
            <strong>Never a generic spinner. Never a three-dot typing indicator.</strong>{" "}
            A spinner says &ldquo;something is happening, for an unknown duration, with
            unknown progress&rdquo; — which for a 40-second paid operation is close to
            saying nothing. The three-dot indicator additionally imports a consumer-chat
            register this product does not want.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="4 · Recovery before happy path"
        description="Design the failure card first. It ships more often than anyone plans for."
      >
        <p className="mb-5 text-ink-secondary">
          The <Code>ErrorState</Code> component makes this structural:{" "}
          <Code>onRetry</Code> and <Code>onSecondary</Code> are both{" "}
          <strong>required props</strong>. You cannot render an error in this kit with
          only one way out.
        </p>
        <SpecTable
          columns={["Rule", "Reason"]}
          rows={[
            ["Two actions always: retry, and edit-the-input", "Retry alone is not recovery when the request itself is the problem — retrying a rejected prompt just fails again."],
            ["Say what failed, specifically", "\"The render timed out while finalizing frames\" is actionable. \"Something went wrong\" is not."],
            ["Danger colour as an edge accent and an icon, never a wash", "A full red panel reads as catastrophe for what is usually a retryable hiccup."],
            ["Distinguish policy rejections from technical failures", "They need different copy and different next steps; collapsing them makes both confusing."],
            ["A user-initiated stop is NOT an error", "Styling someone's own decision as a failure is both wrong and faintly insulting. It gets a neutral 'Stopped' state with Resume."],
          ]}
        />
      </DocSection>

      <DocSection
        title="5 · Always-available override"
        description="The user can interrupt, redirect, or take back control at any point."
      >
        <UXNote>
          <p>
            Every working state carries a visible <strong>Stop</strong>. And critically,
            that Stop lives in the generation&apos;s own status banner —{" "}
            <em>not</em> on the send button.
          </p>
          <p>
            An earlier revision overloaded the send button as a global stop control.
            Switching modes mid-generation then left a Stop icon attached to a composer
            that was ready for the next prompt: the mode said Text, the button said
            Stop, and the field held a video prompt. It read as a bug because it{" "}
            <em>was</em> one — conceptually. <strong>One control, one job.</strong>
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="6 · Cost transparency"
        description="Never let someone commit spend they cannot see, and never accept a request you know will fail."
      >
        <SpecTable
          columns={["Where", "What"]}
          rows={[
            ["Composer settings row", "Estimated cost for the current mode and model, updating live as controls change."],
            ["Model picker", "Per-model price, because choosing Sora 2 over Auto is a ~5× change and hiding that is a trap."],
            ["Composer banner", "An explicit insufficient-balance message with the two figures and an Add funds link."],
            ["Send button", "Disabled when the estimate exceeds the balance — with an aria-label saying why, not a silent dead button."],
            ["Topbar", "Remaining balance as a persistent readout, since it is the reason a generation gets blocked."],
          ]}
        />
        <DontNote>
          <p>
            The anti-pattern: accept the prompt, take the click, then fail with
            &ldquo;insufficient credit&rdquo;. It wastes the user&apos;s intent and
            teaches them not to trust the button.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Generative UI over prose"
        description="When the answer is structured, render a component — not a paragraph describing one."
      >
        <p className="mb-4 text-ink-secondary">
          If a response is a list of matching agents, a comparison, a set of results, or
          a piece of media, it should arrive as something the user can{" "}
          <em>act on</em> inline: a card with Download and Regenerate, a table, a
          player. Prose is reserved for replies that are genuinely conversational.
        </p>
        <p className="text-ink-secondary">
          You can see the rule applied in <Code>SessionCanvas</Code>: a text answer
          renders bare, with no card chrome at all, precisely so that the media results
          — which <em>do</em> get chrome, because they have actions — read as artifacts
          to manage rather than sentences to read.
        </p>
      </DocSection>
    </>
  );
}
