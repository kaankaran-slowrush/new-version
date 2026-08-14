import Link from "next/link";
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

const DocLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-accent-ink underline decoration-line-strong underline-offset-2"
  >
    {children}
  </Link>
);

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
        description="Declared in app/globals.css, with their token values in styles/tokens.css. None of them is a token-level tweak — each visibly changes the interface."
      >
        <SpecTable
          columns={["Preference", "What changes", "Why"]}
          rows={[
            [
              "prefers-contrast: more",
              "The plane goes opaque and stops blurring; the photograph is not rendered at all. Cards and overlays become solid fills. Hairlines jump from 14% to 36% alpha (inner 8→24%, strong 30→60%). Neumorphic shadows are replaced by borders. Every ink level below primary moves FURTHER from its ground: secondary 86→93% L, tertiary 80→88%, muted 62→76%.",
              "The whole low-contrast vocabulary (alpha borders, bevels, translucency) is exactly what this user cannot see. Nudging opacity would not be enough — the treatments are replaced.",
            ],
            [
              "prefers-reduced-transparency: reduce",
              "Same opaque surfaces, and the photograph is neither shown nor downloaded. Lift stops being a bevel and becomes a real blur again: --shadow-sm and -md go back to drop shadows, and the plane takes --shadow-md as its lift.",
              "Some platforms expose this separately from contrast. Honouring only prefers-contrast misses users who asked specifically about transparency — and with no translucency doing the separating, a blur is the only elevation mechanism left.",
            ],
            [
              "prefers-reduced-motion: reduce",
              "Every named motion is gated off at source; the global block additionally neutralises transitions and smooth scrolling.",
              "Vestibular disorders make large or looping movement genuinely unpleasant, not merely distracting.",
            ],
          ]}
        />

        <UXNote title="These are modes, not themes — and there is nothing else">
          <p>
            <Code>light</Code>, <Code>dim</Code> and <Code>spatial</Code> were collapsed
            into one design language; no selector in the kit reads{" "}
            <Code>data-theme</Code> any more. The two queries above are therefore{" "}
            <strong>the only alternate renderings of the product that exist</strong>,
            which raises what they are: not a courtesy flattening, but a second and third
            complete rendering that each has to stand on its own.
          </p>
          <p>
            <strong>Both fall back to opaque DARK surfaces, never to a light
            theme.</strong> The ink tokens are what make this language dark and they are
            not what these queries switch off. Handing them light surfaces would leave
            near-white ink on near-white cards — a fallback that fails harder than the
            thing it was protecting you from.
          </p>
        </UXNote>

        <UXNote title="Test these, do not assume them">
          <p>
            In Chrome DevTools: <strong>Rendering</strong> panel → emulate{" "}
            <Code>prefers-reduced-motion</Code>, <Code>prefers-contrast</Code> and{" "}
            <Code>prefers-reduced-transparency</Code>. On macOS: System Settings →
            Accessibility → Display → Increase contrast / Reduce transparency / Reduce
            motion. Every screen in this kit should stay fully usable in all three states
            — that is part of the verification pass, not a nice-to-have.
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

      <DocSection
        title="Translucency"
        description="The content surface of this product is a translucent plane over a photograph, so this is a contrast problem rather than an aesthetic one."
      >
        <p className="mb-6 max-w-measure text-ink-secondary">
          The rule this kit shipped for two releases — translucency on navigational
          chrome only, where the <Code>.glass</Code> barrier layer guarantees the text on
          top of it — has not been relaxed so much as paid for. The{" "}
          <DocLink href="/docs/foundations/spatial">one design language</DocLink> puts
          content on a translucent plane, and that is defensible for exactly one reason:
          what sits behind the plane is not arbitrary. It is a photograph held under a
          measured luminance cap, and every figure below is computed over the worst case
          that cap allows.
        </p>

        <SpecTable
          columns={["Mechanism", "Value", "What it guarantees"]}
          rows={[
            [
              "The barrier layer",
              "--color-glass-barrier, on .glass::before",
              "Chrome text stays ≥4.5:1 regardless of what drifts underneath. Mandatory — do not bypass it.",
            ],
            [
              "The backdrop cap",
              "--backdrop-cap: 0.40",
              "Pins ANY photograph's brightest pixel to 0.22 luminance, including one a workspace supplies itself. Without it, legibility would depend on the customer's choice of wallpaper. It is 0.40 rather than 1 − 0.22 because CSS composites in gamma space.",
            ],
            [
              "The measured floor",
              "5.04:1 worst case",
              "--color-danger as text on the card tier, which is the lightest ground most text sits on. Every other real-text level is higher: tertiary 5.10, accent 5.60, success 5.72, warning 6.22, secondary 6.23, ink 8.74.",
            ],
            [
              "Occlusion, not translucency",
              "--color-surface-solid, 0.94",
              "All five overlays and sticky table headers. Nothing imposes a cap behind a dropdown, so it cannot be see-through at any value and still carry a promise. Ink on an overlay is 15.68:1.",
            ],
            [
              "prefers-reduced-transparency",
              "Fully opaque",
              "The plane, the cards and the overlays all take solid fills, and the photograph is neither rendered nor fetched. It falls back to opaque DARK, not to a light theme — the ink is near-white and would vanish on white cards.",
            ],
            [
              "prefers-contrast: more",
              "Opaque + real borders",
              "Glass becomes solid, hairlines become real lines at --color-border-contrast, and the photograph is removed rather than dimmed.",
            ],
          ]}
        />

        <DontNote>
          <p>
            <strong>
              Do not assume a preference query improves contrast just because it is
              named after contrast.
            </strong>{" "}
            The obvious implementation of <Code>prefers-contrast: more</Code> reassigns
            ink tokens toward a mid grey, which is correct on a light ground and pushes a
            dark one the <strong>WRONG WAY</strong>. It shipped that way once and had to
            be fixed. Read the block as a sentence before trusting it: every ink level in
            it must move <em>further</em> from its ground, not toward the middle.
          </p>
          <p>
            <strong>With one language this trap is easier to avoid, and that is a real
            argument for the collapse.</strong> It used to need a correct branch per
            theme inside that query — three chances to get the direction wrong, and a
            fourth for whatever theme was added next. It is now a single{" "}
            <Code>:root</Code> block with one ground to reason about.{" "}
            <Code>--color-border-contrast</Code> still exists as a token rather than a
            literal, because that query also takes the plane opaque and the value has to
            be right against both.
          </p>
        </DontNote>
      </DocSection>

      <DocSection title="Checklist before shipping a screen">
        <ul className="space-y-2.5 text-ink-secondary">
          {[
            "Traverse the whole screen with Tab only. Every interactive element reachable, focus always visible, order matches visual order.",
            "Escape closes every overlay; focus returns to the element that opened it.",
            "Every icon-only button has an aria-label.",
            "Every status is legible in greyscale.",
            "No information lives only in ink-muted. It is 2.62:1 on the card, and that is correct — placeholder and disabled text only.",
            "Body text on a card is at least 4.5:1. The card is the lightest ground most text sits on, so that is where you measure; the floor across the whole product is 5.04:1.",
            "Emulate reduced motion: nothing is permanently invisible, nothing loops.",
            "Emulate increased contrast: the plane is solid, borders are real, and every ink level moved AWAY from its ground rather than toward the middle.",
            "Emulate reduced transparency: no surface is translucent, elevation still reads (the bevels have become blurs), and the backdrop photograph is not just hidden but never fetched.",
            "Check BOTH modes, every time. They are the only alternate renderings of the product that exist, so nothing else is going to catch a regression in them.",
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
