import Link from "next/link";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Elevation & glass" };

export default function ElevationDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Foundations"
        title="Elevation & glass"
        lede="Depth here is structural, not decorative. Two things do the work and they are strictly separated: a border defines the edge, shadows do the floating. Translucency is reserved for a single, specific job."
      />

      <DocSection
        title="The elevation scale"
        description="Five steps. Every one of them is pure blur — no rings. Edges are a border's job now."
      >
        <Example label="shadow-xs → shadow-xl">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
            <div
              key={s}
              className="grid h-24 w-32 place-items-center rounded-2xl bg-surface font-mono text-xs text-ink-tertiary"
              style={{ boxShadow: `var(--shadow-${s})` }}
            >
              shadow-{s}
            </div>
          ))}
        </Example>

        <SpecTable
          columns={["Token", "Use for", "Notes"]}
          rows={[
            ["--shadow-xs", "Flat chips, subtle definition", "The one exception: ring only, no blur. It IS an edge, not a lift — so it cannot double against one."],
            ["--shadow-sm", "Cards, secondary buttons", "The default for content surfaces."],
            ["--shadow-md", "Menus, popovers, dropdowns", "Transient overlays that must clearly detach."],
            ["--shadow-lg", "Floating chrome at rest", "Topbar, side rails."],
            ["--shadow-xl", "Floating chrome, hover/expanded", "Deepens as a panel grows, reinforcing that it came forward."],
            ["--shadow-composer", "The composer only", "Casts upward as well as down, since it sits above page content."],
          ]}
        />

        <UXNote title="One edge, one lift — and why they are separate properties">
          <p>
            On a light background a single blurred shadow either disappears or turns
            grey and muddy, so each token is <strong>two blurs at different radii</strong>:
            a tight one that grounds the surface and a wide diffuse one that lifts it.
          </p>
          <p>
            <strong>What they no longer contain is a <Code>0 0 0 1px</Code> ring.</strong>{" "}
            An earlier revision of this kit put the edge inside the shadow token, so
            surfaces had a boundary without a border — and the rule was then
            &ldquo;never add a border on top of a shadow,&rdquo; because you would get a
            doubled edge. That rule is gone, and so is the ring. Responsibility moved
            rather than accumulating:
          </p>
          <ul className="mt-1 mb-3 ml-4 list-disc space-y-1.5 text-ink-secondary">
            <li>
              <strong className="text-ink">The border defines the edge.</strong> One real{" "}
              <Code>--border-width-panel</Code> (1.5px) in <Code>--color-line</Code>, via
              the <Code>.panel-edge</Code> utility.
            </li>
            <li>
              <strong className="text-ink">The shadow does nothing but float.</strong>{" "}
              Pure blur, no ring, nothing to double against.
            </li>
          </ul>
          <p>
            The reason for the swap: a shadow ring is soft and scale-dependent, and it
            fades as the shadow does. A real border stays exactly 1.5px crisp at any zoom
            and does not soften on hover. Surfaces read as <em>objects with edges</em>
            rather than soft clouds — while still floating, because the blurs survived
            untouched.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Do not put <Code>--color-line</Code> on internal dividers.</strong>{" "}
            The panel-edge value is deliberately strong enough to be seen. Table row
            separators, menu rules and card footer tops use{" "}
            <Code>--color-line-inner</Code> at 1px instead. Getting this backwards is the
            single easiest way to make this system look wrong: strong lines inside a
            panel turn a table into a spreadsheet. <strong>Strong outside, quiet
            inside.</strong>
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Glass — and the barrier layer"
        description="The .glass utility: translucent fill, backdrop blur, mandatory barrier layer, elevation."
      >
        <Example className="relative overflow-hidden !p-0">
          {/* A busy backdrop so the barrier layer's job is visible. */}
          <div className="relative h-56 w-full ambient-ground">
            <div className="absolute inset-0 grid place-items-center gap-4 p-6">
              <div className="glass w-full max-w-sm rounded-2xl p-5">
                <p className="text-sm font-medium text-ink">Glass with barrier layer</p>
                <p className="mt-1 text-sm text-ink-secondary">
                  Text stays legible because a solid fill sits between it and whatever
                  is behind.
                </p>
              </div>
            </div>
          </div>
        </Example>

        <UXNote title="The three glass rules">
          <p>
            <strong>1 · Navigational chrome only \u2014 except under Spatial.</strong>{" "}
            The topbar, the side rails, the composer. Never body content and never
            data-dense cards \u2014 reading beats effect, every time. The one theme that
            inverts this buys the right to with a measured backdrop cap; see{" "}
            <Link href="/docs/foundations/spatial" className="text-accent-ink underline decoration-line-strong underline-offset-2">Spatial</Link>. Content surfaces that want translucency use{" "}
            <Code>.surface-veil</Code> instead: 80% and no blur, which is safe precisely
            because it drops the two things that make glass risky. See{" "}
            <Code>Color</Code> for the full comparison.
          </p>
          <p>
            <strong>2 · The barrier layer is not optional.</strong>{" "}
            <Code>--color-glass</Code> alone is too sheer for text to survive over an
            arbitrary backdrop. The <Code>.glass</Code> utility paints a solid
            low-opacity fill via <Code>::before</Code> beneath the content, which is
            what turns &ldquo;contrast is usually fine&rdquo; into &ldquo;contrast is
            guaranteed.&rdquo;
          </p>
          <p>
            <strong>3 · Always paired with elevation and an edge.</strong> Translucency
            on its own reads as broken rendering. Translucency plus a real shadow{" "}
            <em>and</em> a real border reads as a pane of glass — which is the point. The{" "}
            <Code>.glass</Code> utility carries the 1.5px panel border itself, so you
            never have to remember it.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Never glass on a transient overlay.</strong> A dropdown or dialog
            appears over unpredictable content — a table, an image, a wall of text.
            Blurring that does not make it readable, it makes it noisy. Menus, popovers
            and dialogs in this kit are opaque <Code>bg-surface</Code> with{" "}
            <Code>shadow-md</Code>. Glass is for surfaces that are{" "}
            <em>always there</em>, whose backdrop you control.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Why there is an animated background at all"
        description="The one piece of this system that looks decorative, and the argument for it."
      >
        <p className="mb-5 text-ink-secondary">
          Translucency over a flat static colour is wasted — there is nothing to reveal, so
          it costs contrast and buys nothing. The ambient layer exists to give the two
          translucent tiers (<Code>.glass</Code> chrome and <Code>.surface-veil</Code>
          content) something to reveal. That is the whole justification. It is not there to
          look futuristic.
        </p>
        <p className="mb-5 text-ink-secondary">
          It lives in <Code>components/chrome/ambient-background.tsx</Code> and stacks
          three layers, each doing one job:
        </p>
        <SpecTable
          columns={["Layer", "What it does", "Why"]}
          rows={[
            ["Lava", "Four blurred blobs, transform-animated on 53s / 67s / 79s / 97s cycles", "The colour. All durations on this layer are PRIME, so the combined pattern's least common multiple is measured in months and the loop can never be caught. Where two blobs cross their alphas compound and the colour deepens — that compounding is what reads as molten rather than as a fading gradient."],
            ["Sweep", "One wide feathered band crossing the field over 131s", "The DIRECTION. The blobs breathe in place, which reads as alive but never as moving; a band that travels all the way across is what turns a texture into weather. Oversized and rotated so its ends are never in frame."],
            ["Grid", "56px ruled grid at 7%, drifting one cell over 89s", "The only structural element here, and the one that does most of the futuristic work. It is also nearly free: a 1px line at 7% inside a 56px cell barely moves the local average, so it buys character at almost no contrast cost. It translates by EXACTLY one cell, which makes the loop seamless by construction rather than by being slow enough to hide a jump."],
            ["Scrim", "A broad near-white radial, 42% at the centre falling to a 14% floor", "LOAD-BEARING, not decorative. It lifts the middle of the frame — where the content column sits — while leaving the outer field saturated. It was 62% and had to come DOWN: at that strength the whole layer animated correctly and was invisible, measuring about 4/255 of colour swing in the content band against about 90 now."],
            ["Conic wash", "One conic gradient rotating over 120s", "Angular motion the radial blobs cannot make. Sized 160vmax because a rotating box smaller than the viewport sweeps its own corners through frame."],
            ["Grain", "Static inline SVG feTurbulence at 4% via soft-light", "Large smooth gradients band visibly on 8-bit displays, and banding is what makes them look cheap. Static, because animated noise is a battery bill for nothing."],
          ]}
        />
        <p className="mt-5 mb-5 text-ink-secondary">
          It is deliberately <strong>not</strong> discrete floating orbs, bubbles, or
          particles. That specific treatment is the clearest &ldquo;AI slop&rdquo; tell in
          current product design, and it would undercut everything else here.
        </p>

        <UXNote title="An ambient layer nobody can see is not restraint, it is waste">
          <p>
            This layer was, for a while, exactly that. The blobs were anchored{" "}
            <em>outside</em> the frame (−24% left, −22% right, −28% bottom) and blurred
            at 64px, which spread them so far that almost none of the colour reached
            the content area — while a 62% scrim removed what did. Every animation ran
            correctly, on the compositor, at the right durations, and the result was a
            flat grey page paying the full cost of six moving layers.
          </p>
          <p>
            The fix was geometric before it was chromatic: pull the blobs{" "}
            <strong>into</strong> frame, drop the blur, and take the scrim down. Alpha
            went from 20% to 22% — barely a change — but measured colour swing in the
            content band went from about <strong>4/255 to about 90/255</strong>.
          </p>
        </UXNote>

        <UXNote title="The ceiling on this layer is measured, not chosen">
          <p>
            22% is where it stops, and the number comes from text rather than taste.
            Two overlapping blobs plus the sweep plus a grid line is the worst point
            the geometry can produce, and at that point <Code>ink-secondary</Code> must
            still clear 4.5:1 on the bare canvas (it holds at <strong>5.26:1</strong>)
            and <Code>ink-tertiary</Code> must clear it on the glass topbar (
            <strong>4.51:1</strong>).
          </p>
          <p>
            This is also what makes the canvas rule binding rather than advisory:
            nothing below <Code>ink-secondary</Code> may sit directly on the ambient
            layer. Strengthening the background turned that from a guideline into a
            constraint, and the section eyebrows on the home page had to move up a
            level to satisfy it.
          </p>
        </UXNote>
        <UXNote title="Why CSS and not WebGL">
          <p>
            A WebGL mesh gradient (<Code>@mesh-gradient/react</Code>, GradFlow,
            Stripe&apos;s ~10kb <Code>gradient.js</Code>) wins a side-by-side comparison.
            It also costs a dependency the consuming team has to adopt, a canvas, and
            continuous GPU work for a purely decorative layer — in a B2B tool people
            leave open all day, on laptops, on battery. Three stacked CSS layers get
            substantially the same read for zero dependencies and degrade honestly.
          </p>
          <p>
            All three layers are <Code>position: fixed</Code> and{" "}
            <Code>pointer-events: none</Code>. Motion stops under{" "}
            <Code>prefers-reduced-motion</Code>, and the entire layer is{" "}
            <em>removed</em> — not dimmed — under <Code>prefers-contrast: more</Code> and{" "}
            <Code>prefers-reduced-transparency</Code>.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Neumorphism, and its one permitted use"
        description="A garnish with a narrow licence."
      >
        <Example label="The only two neumorphic surfaces">
          <div className="flex flex-col gap-2">
            <div className="neu-inset grid h-14 w-56 place-items-center rounded-full">
              <span className="font-mono text-2xs text-ink-tertiary">.neu-inset</span>
            </div>
            <p className="max-w-[14rem] text-xs text-ink-tertiary">
              A well — &ldquo;things go in here.&rdquo; Toggle and segmented tracks.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="neu-raised grid size-14 place-items-center rounded-full">
              <span className="font-mono text-2xs text-ink-tertiary">nub</span>
            </div>
            <p className="max-w-[14rem] text-xs text-ink-tertiary">
              A raised knob — &ldquo;this is the moving part.&rdquo; Thumbs.
            </p>
          </div>
        </Example>

        <UXNote title="Why it is restricted this hard">
          <p>
            Neumorphism removes contrast <em>by design</em>: the control is the same
            colour as its ground and separated only by a soft shadow. That fails WCAG
            2.2 contrast requirements for non-text UI components, and it genuinely
            disappears in sunlight on a laptop screen.
          </p>
          <p>
            So it is allowed in exactly one situation: a <strong>small tactile
            control</strong> whose pressed-versus-unpressed physicality <em>is</em> the
            information, and which carries <strong>no text</strong>. The label always
            lives on an opaque sibling. Under{" "}
            <Code>prefers-contrast: more</Code> these surfaces drop their shadows and
            take a real border instead.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The glass recipe, and why the fill went DOWN as the blur went UP"
        description="38% fill, 44px blur, 180% saturation, a specular top edge — and it disappears entirely until something scrolls under it."
      >
        <SpecTable
          columns={["Ingredient", "Value", "What it is actually for"]}
          rows={[
            ["Fill", "--color-glass, white @ 38%", "Was 55%. Lowered so the colour of the page genuinely comes through, rather than the bar being a white strip that happens to be slightly see-through."],
            ["Blur", "--blur-glass, 44px", "Was 20px. This is what PAYS for the lower fill: readability over a busy backdrop comes from destroying high-frequency detail, not from opacity. A smooth wash can be sat on at 38% where a sharp one could not."],
            ["Saturation", "--saturate-glass, 180%", "The half people forget. Averaging many colours desaturates them, so blur alone yields a grey, washed-out panel. Pushing saturation back up is the difference between frosted glass and a translucent grey rectangle."],
            ["Barrier layer", "--color-glass-barrier, white @ 18%", "Was 28%. Still mandatory, still the thing that turns \u201ccontrast is usually fine\u201d into \u201ccontrast is guaranteed\u201d."],
            ["Specular edge", "inset 0 1px 0 white @ 55%", "A bright hairline along the top inside face. Real glass catches light on its top bevel, and this one line is most of why the panel reads as a physical pane rather than as reduced opacity."],
          ]}
        />
        <UXNote title="Measured, not eyeballed">
          <p>
            Lowering a fill is where a translucent bar usually becomes unreadable, so
            the floor was computed rather than judged. Against a deliberately
            pessimistic backdrop — a quarter of the bar covered by a near-black button
            — <Code>ink</Code> holds at <strong>14.3:1</strong> and{" "}
            <Code>ink-secondary</Code> at <strong>6.5:1</strong>. Over ordinary light
            content both are far higher. <Code>ink-tertiary</Code> falls to 4.26:1
            there, which is why the topbar carries nothing below secondary.
          </p>
        </UXNote>

        <UXNote title="Adaptive glass: it is not there until it has a job">
          <p>
            At the top of a page there is nothing beneath the bar. The fill, the blur,
            the border and the shadow are separating it from <em>nothing</em> — all
            they do is draw a rectangle over the page. So the topbar renders fully
            transparent and materialises the moment content actually arrives
            underneath, driven by <Code>data-lifted</Code> on the element and the{" "}
            <Code>useScrolled</Code> hook.
          </p>
          <p>
            <strong>It is opt-in, and only the topbar takes it.</strong> The session
            rails and the composer always have canvas content behind them, so they are
            always glass; an element with no <Code>data-lifted</Code> attribute is
            untouched by those rules.
          </p>
        </UXNote>
        <DontNote>
          <p>
            <strong>Do not write the filter inline when a state has to change it.</strong>{" "}
            The at-rest state needs <Code>blur(0px)</Code>, and Lightning CSS
            &ldquo;optimises&rdquo; a literal <Code>blur(0px)</Code> into{" "}
            <Code>blur()</Code> — invalid, so the browser drops the entire declaration
            and the transparent state silently never applies. The filter is therefore
            composed from two local custom properties (<Code>--glass-blur</Code>,{" "}
            <Code>--glass-saturate</Code>), which a minifier cannot see inside. This
            was caught by reading the emitted CSS, not the source.
          </p>
        </DontNote>
      </DocSection>
    </>
  );
}
