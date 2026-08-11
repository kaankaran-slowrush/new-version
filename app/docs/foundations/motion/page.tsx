import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Motion" };

export default function MotionDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Foundations"
        title="Motion"
        lede="Six named motions, each tied to a specific state. Motion here is a communication channel, not polish — if you cannot say what an animation tells the user, it does not ship."
      />

      <DocSection
        title="Durations and easing"
        description="Short enough to feel instant. Custom ease-out only."
      >
        <SpecTable
          columns={["Token", "Value", "Use for"]}
          rows={[
            ["--duration-instant", "100ms", "Press feedback, colour swaps"],
            ["--duration-fast", "160ms", "Hover, small reveals, menu enter"],
            ["--duration-normal", "220ms", "Expanding panels, content swaps"],
            ["--duration-slow", "320ms", "Dialogs, drawers"],
            ["--duration-ambient", "60s", "Background drift"],
            ["--ease-out-quint", "cubic-bezier(0.23, 1, 0.32, 1)", "Everything entering or responding"],
            ["--ease-in-out-quint", "cubic-bezier(0.77, 0, 0.175, 1)", "Movement between two on-screen positions"],
          ]}
        />

        <UXNote title="Never ease-in on something the user is waiting for">
          <p>
            <Code>ease-in</Code> starts slow, which means the first few frames — the
            exact moment the user is watching for a response — show almost no movement.
            It reads as lag even when the total duration is identical. Entering elements
            and interaction responses use <strong>ease-out</strong>; only movement
            between two visible positions uses ease-in-out.
          </p>
          <p>
            The browser defaults are also too weak to read as intentional. The quintic
            curves here are much more pronounced, which is what makes a 160ms hover
            feel deliberate rather than accidental.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The motion inventory"
        description="Each one exists because a specific state needed to be communicated — except the ambient set, which exists so the translucent surfaces have something to reveal."
      >
        <SpecTable
          columns={["Motion", "Says", "Where"]}
          rows={[
            [
              "lava-drift ×4",
              "nothing to the user directly — it gives the translucent surfaces something to reveal",
              "Ambient blobs, 53/67/79/97s (all prime, so the combined loop cannot be caught)",
            ],
            [
              "aurora-sweep",
              "direction. The blobs breathe in place; a band that crosses the whole field is what turns a texture into weather",
              "Ambient, 131s",
            ],
            [
              "grid-drift",
              "“this is an instrument”. The one structural element on the ambient layer, and nearly free in contrast terms",
              "Ambient, 89s, translating exactly one 56px cell so the loop is seamless by construction",
            ],
            [
              "slow-spin",
              "angular movement the radial blobs cannot make",
              "Ambient conic wash, 120s",
            ],
            [
              "cursor glow",
              "“the background is aware of you” — and ONLY the background. It switches off over any card, control or chrome",
              "Pointer-driven, no keyframes: transform + opacity written directly, one write per frame",
            ],
            ["fade-in", "“this content just arrived”", "Turn switching, control reveals, banners"],
            ["rise", "“read this in order”", "Page load, staggered 20/80/140/200/260ms"],
            ["ring-pulse", "“this is live right now”", "Status dots on running agents/turns"],
            ["sheen", "“media is being generated”", "Generation placeholders"],
            ["soft-pulse", "“still working” (low urgency)", "Status banner dot, button loading"],
          ]}
        />


        <UXNote title="Why the cursor glow is not on this list as a keyframe">
          <p>
            Every other motion here is a CSS animation with a duration. The glow has
            neither: it is driven by <Code>pointermove</Code>, throttled to one
            <Code>requestAnimationFrame</Code>, and writes only{" "}
            <Code>transform</Code> and <Code>opacity</Code> straight to the node.
            Position never passes through React state — routing 120 events a second
            through a re-render would cost real work for an identical result.
          </p>
          <p>
            <strong>The exclusion is the design, not the following.</strong> A light
            that tracks the pointer everywhere is a spotlight, and a spotlight over
            content competes with whatever you are reading. This one is off over any
            painted surface, so it reads as the background reacting to you rather than
            as an effect applied to the interface. It matters doubly here because
            cards are translucent: a glow underneath one would bleed through and put a
            moving highlight behind body text.
          </p>
          <p>
            One <Code>closest()</Code> decides it, against{" "}
            <Code>.surface-veil</Code> and <Code>.glass</Code> plus the interactive
            elements. Because every <Code>Card</Code> carries the first and all chrome
            carries the second, no component has to opt in.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>A pointer effect needs three gates, not one.</strong> This one is
            never attached under <Code>prefers-reduced-motion</Code> — not dimmed or
            slowed, because a cursor-tracking light has no reduced form worth
            shipping. It is also never attached under <Code>(hover: none)</Code>,
            where it would either never fire or fire once and strand a glow on screen
            after a tap. And it inherits <Code>.ambient-layer</Code>, so{" "}
            <Code>prefers-contrast: more</Code> and{" "}
            <Code>prefers-reduced-transparency</Code> remove it with the rest of the
            layer.
          </p>
          <p>
            It also only ever ADDS light. The ambient layer&apos;s alphas are capped by
            a measured contrast budget; anything that darkened the ground would eat
            into it. A white core can only raise the contrast of nearby ink, so it
            needs no budget of its own.
          </p>
        </DontNote>

        <Example label="ring-pulse — live status" stack>
          <div className="flex items-center gap-3">
            <span className="relative grid size-3.5 place-items-center">
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="anim-ring absolute inset-0.5 rounded-full border-[1.5px] border-accent opacity-55" />
            </span>
            <span className="text-sm text-ink-secondary">Generating — 40s remaining</span>
          </div>
        </Example>

        <Example label="soft-pulse — low-urgency working" stack>
          <div className="flex items-center gap-3">
            <span className="anim-soft-pulse size-2 rounded-full bg-accent" />
            <span className="text-sm text-ink-secondary">Queued</span>
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="The reduced-motion gate is inside each utility"
        description="A structural decision, not a convention you have to remember."
      >
        <p className="mb-5 text-ink-secondary">
          Every animation utility in <Code>styles/animations.css</Code> is declared{" "}
          <em>inside</em> a <Code>@media (prefers-reduced-motion: no-preference)</Code>{" "}
          block. That means an ungated animation cannot ship by accident — if you use{" "}
          <Code>.anim-ring</Code>, the gate comes with it. A global override that
          cancels animations afterwards still leaves the door open for a developer to
          hand-roll a keyframe and forget; this closes it.
        </p>
        <p className="mb-5 text-ink-secondary">
          There is <em>also</em> a global <Code>prefers-reduced-motion: reduce</Code>{" "}
          block in <Code>globals.css</Code>, but its job is only to catch transitions
          and third-party animation — not to be the primary defence.
        </p>
        <UXNote title="Entrance animations and repeat visits">
          <p>
            <Code>.anim-rise</Code> sets <Code>opacity: 0</Code>{" "}
            <strong>only inside the no-preference query</strong>. That detail matters: if
            the initial hidden state were declared unconditionally, a reduced-motion user
            would get a permanently invisible page, since the animation that reveals it
            never runs. This is the single most common way staggered entrances break
            accessibility.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="When not to animate">
        <DontNote>
          <p>
            <strong>Actions performed dozens of times a day get no animation.</strong>{" "}
            A command palette, a keyboard-shortcut-driven panel, switching a mode tab —
            animating these makes a fast interaction feel slow, because the user is
            already ahead of the transition. Reserve motion for occasional surfaces
            (dialogs, drawers, first load) and for genuine state changes.
          </p>
          <p>
            <strong>Never animate from <Code>scale(0)</Code>.</strong> Nothing appears
            from nothing. Start at <Code>scale(0.95)</Code> with{" "}
            <Code>opacity: 0</Code> — the element should feel like it moved into place,
            not like it was born.
          </p>
          <p>
            <strong>Only animate <Code>transform</Code> and <Code>opacity</Code>.</strong>{" "}
            Animating width, height, margin or padding triggers layout and paint every
            frame and drops frames on long lists. Where this kit animates a panel width
            (the hover-expanding rails) it is a deliberate, isolated exception on a
            small, absolutely-positioned element — not a pattern to copy freely.
          </p>
        </DontNote>
      </DocSection>
    </>
  );
}
