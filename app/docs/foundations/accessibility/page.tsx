import { TriangleAlert } from "lucide-react";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Accessibility" };

export default function AccessibilityDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Foundations"
        title="Accessibility"
        lede="This design is allowed to be atmospheric only because it degrades honestly when asked to. The escape hatches are load-bearing — remove them and the glass treatment stops being defensible."
      />

      <DocSection
        title="Three user preferences, three real fallbacks"
        description="All declared in app/globals.css. None of them is a token-level tweak — each visibly changes the interface."
      >
        <SpecTable
          columns={["Preference", "What changes", "Why"]}
          rows={[
            [
              "prefers-contrast: more",
              "Glass becomes opaque with a real border. Ambient background off. Neumorphic shadows replaced by borders. Hairlines jump from 8% to 35% alpha. Tertiary/muted text darkens.",
              "The whole low-contrast vocabulary (alpha borders, soft shadows, translucency) is exactly what this user cannot see. Nudging opacity would not be enough — the treatments are replaced.",
            ],
            [
              "prefers-reduced-transparency: reduce",
              "Glass becomes opaque. Ambient background off.",
              "Some platforms expose this separately from contrast. Honouring only prefers-contrast misses users who asked specifically about transparency.",
            ],
            [
              "prefers-reduced-motion: reduce",
              "Every named motion is gated off at source; the global block additionally neutralises transitions and smooth scrolling.",
              "Vestibular disorders make large or looping movement genuinely unpleasant, not merely distracting.",
            ],
          ]}
        />

        <UXNote title="Test these, do not assume them">
          <p>
            In Chrome DevTools: <strong>Rendering</strong> panel → emulate{" "}
            <Code>prefers-reduced-motion</Code> and <Code>prefers-contrast</Code>. On
            macOS: System Settings → Accessibility → Display → Increase contrast /
            Reduce transparency / Reduce motion. Every screen in this kit should stay
            fully usable in all three states — that is part of the verification pass,
            not a nice-to-have.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Focus is global, and never removed"
        description="One rule in globals.css handles every focusable element."
      >
        <Example label="Tab to these">
          <button className="rounded-md bg-surface px-4 py-2 text-sm shadow-sm">
            Focus me
          </button>
          <a href="#" className="text-sm text-accent-ink underline-offset-4 hover:underline">
            And me
          </a>
          <input
            aria-label="Focus demo input"
            className="rounded-lg bg-surface-sunken px-3 py-2 text-sm"
            placeholder="And me"
          />
        </Example>
        <p className="mb-5 text-ink-secondary">
          <Code>:focus-visible</Code> gives a 2px accent outline with a 2px offset.
          Because it is <Code>focus-visible</Code> rather than <Code>focus</Code>, mouse
          users never see it and keyboard users always do. Components in this kit do{" "}
          <strong>not</strong> declare their own focus rings — that would produce five
          slightly different rings and guarantee one of them eventually goes missing.
        </p>
        <DontNote>
          <p>
            Never write <Code>outline: none</Code> without an equally visible
            replacement in the same rule. A keyboard user who cannot see where they are
            has lost the ability to use the page at all — it is not a cosmetic
            regression.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Target size"
        description="WCAG 2.2 (2.5.8) sets a 24×24 CSS px minimum; 44×44 is the comfortable bar."
      >
        <SpecTable
          columns={["Token", "Height", "Safe as the only way to do something?"]}
          rows={[
            ["--control-height-sm", "36px", "Borderline. Dense desktop contexts, and only alongside a larger affordance"],
            ["--control-height-md", "40px", "Fine on desktop. Four short of the AAA floor, so pair with generous horizontal padding"],
            ["--control-height-lg", "48px", "Yes — the touch-safe default, now clear of the 44px floor rather than exactly on it"],
            ["--control-height-xl", "56px", "Yes — hero actions"],
          ]}
        />
        <p className="text-ink-secondary">
          Where a visible control must be smaller than the target (a 20px checkbox, a
          14px status mark), extend the hit area with padding or a pseudo-element rather
          than shrinking the target. And never let two hit areas overlap — the user
          cannot tell which one they will get.
        </p>
      </DocSection>

      <DocSection
        title="State is never colour alone"
        description="The single most repeated accessibility rule in this system."
      >
        <Example label="StatusMark pairs colour with shape" stack>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="relative grid size-3.5 place-items-center">
                <span className="size-1.5 rounded-full bg-success" />
                <span className="anim-ring absolute inset-0.5 rounded-full border-[1.5px] border-success opacity-55" />
              </span>
              Live — filled dot, pulsing ring
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full border-[1.5px] border-idle" />
              Idle — hollow dot, no motion
            </span>
            <span className="flex items-center gap-2">
              <TriangleAlert className="size-3.5 text-danger [stroke-width:2.25]" />
              Error — triangle, distinct silhouette
            </span>
          </div>
        </Example>
        <p className="text-ink-secondary">
          Roughly 1 in 12 men has some colour vision deficiency. Beyond that, colour
          survives neither a greyscale print nor a screenshot pasted into a ticket — and
          screenshots are how most product state actually gets discussed. Shape survives
          all of it.
        </p>
      </DocSection>

      <DocSection title="Checklist before shipping a screen">
        <ul className="space-y-2.5 text-ink-secondary">
          {[
            "Traverse the whole screen with Tab only. Every interactive element reachable, focus always visible, order matches visual order.",
            "Escape closes every overlay; focus returns to the element that opened it.",
            "Every icon-only button has an aria-label.",
            "Every status is legible in greyscale.",
            "Body text over glass is at least 4.5:1 (the barrier layer is doing this — do not bypass it).",
            "Emulate reduced motion: nothing is permanently invisible, nothing loops.",
            "Emulate increased contrast: glass is solid, borders are real.",
            "Any number that can change carries the tabular class.",
            "At 320px width nothing scrolls horizontally except containers explicitly marked overflow-x-auto.",
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </DocSection>
    </>
  );
}
