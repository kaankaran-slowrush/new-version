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

const DocLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="text-accent-ink underline decoration-line-strong underline-offset-2"
  >
    {children}
  </Link>
);

export default function ElevationDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Foundations"
        title="Elevation & glass"
        lede="Depth here is structural, not decorative. A border defines the edge; lift is a specular bevel plus a tight contact shadow, because a drop shadow works by removing light and at luminance 0.039 there is almost none left to remove. Only the things that genuinely float clear of the plane keep a real blur."
      />

      <DocSection
        title="The elevation scale"
        description="Five steps, and they are deliberately not one shape. xs is a ring, sm and md are a bevel plus a contact shadow, md and up keep real blur."
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
          columns={["Token", "Recipe", "Use for"]}
          rows={[
            [
              "--shadow-xs",
              "0 0 0 1px white @ 0.10",
              "The one ring in the scale, and it stays one: it IS an edge, not a lift, so it cannot double against one. Its consumers — StatTile `panel`, solid FilterPills, Accordion `separated` — carry no `.panel-edge`, and the ring is their only boundary.",
            ],
            [
              "--shadow-sm",
              "inset 0 1px 0 white @ 0.10, then 0 1px 2px black @ 0.28",
              "The default for content surfaces: cards, secondary buttons, the docs' own panels. A specular top bevel plus a tight contact shadow — no ring, because everything using it already has a real border.",
            ],
            [
              "--shadow-md",
              "inset 0 1px 0 white @ 0.16, plus a 6px contact shadow and a 24px diffuse one",
              "Transient overlays that must clearly detach — menus, popovers, dialogs, tooltips — and the hover step of an interactive Card.",
            ],
            [
              "--shadow-lg",
              "0 20px 44px -16px black @ 0.62. Pure blur.",
              "Floating chrome at rest. `.glass` ships it, so GlassPanel gets it without asking.",
            ],
            [
              "--shadow-xl",
              "0 28px 60px -18px black @ 0.7. Pure blur.",
              "Floating chrome, hover or expanded. Deepens as a panel grows, reinforcing that it came forward.",
            ],
            [
              "--shadow-composer",
              "A bevel, an UPWARD 14px shadow, and a downward one",
              "The composer only. It sits above page content, so it casts upward as well as down.",
            ],
          ]}
        />

        <UXNote title="Why the middle of the scale is a bevel and not a blur">
          <p>
            <strong>A drop shadow removes light, and there is almost none to remove
            here.</strong> The plane sits at luminance <strong>0.039</strong>. Any blur
            strong enough to actually see against that reads as{" "}
            <em>dirt on the glass</em> rather than as lift — which is exactly what the
            first pass at this language concluded when it set <Code>sm</Code> and{" "}
            <Code>md</Code> to <Code>none</Code> outright and took every hover affordance
            in the product down with them.
          </p>
          <p>
            The kit already had the dark-ground vocabulary written in two places:{" "}
            <Code>.glass</Code> and the plane both express lift as a{" "}
            <strong>specular top bevel</strong> — a bright hairline along the top inside
            face, the way real glass catches light — plus a tight contact shadow
            underneath. These tokens reuse that rather than inventing a second language
            for the same idea.
          </p>
          <p>
            <strong>The hover step is the bevel brightening, 0.10 → 0.16.</strong> That
            is the fix for <Code>Card</Code>&apos;s <Code>interactive</Code> variant,
            whose affordance had entirely evaporated. A fill change cannot do this job:
            hovering from <Code>--color-surface</Code> (0.07) to{" "}
            <Code>--color-surface-hover</Code> (0.09) is a <strong>1.03× move</strong> —
            invisible. A brighter specular line plus the existing 2px translate is a real
            hover and a glass-native one.
          </p>
          <p>
            <strong><Code>md</Code> and up keep real blur, and that is not an
            inconsistency.</strong> They belong to things that genuinely float{" "}
            <em>clear</em> of the plane — overlays, floating chrome — where there is
            separation for a shadow to describe. A card is not one of those things: it
            rests on the plane.
          </p>
        </UXNote>

        <UXNote title="One edge, one lift — and why they are separate properties">
          <p>
            <strong>The shadow tokens above <Code>xs</Code> carry no{" "}
            <Code>0 0 0 1px</Code> ring.</strong> An earlier revision of this kit put the
            edge inside the shadow, so surfaces had a boundary without a border — and the
            rule was then &ldquo;never add a border on top of a shadow,&rdquo; because
            you would get a doubled edge. That rule is gone, and so is the ring.
            Responsibility moved rather than accumulating:
          </p>
          <ul className="mt-1 mb-3 ml-4 list-disc space-y-1.5 text-ink-secondary">
            <li>
              <strong className="text-ink">The border defines the edge.</strong> One real{" "}
              <Code>--border-width-panel</Code> (1px) in <Code>--color-line</Code>, via
              the <Code>.panel-edge</Code> utility.
            </li>
            <li>
              <strong className="text-ink">The shadow does nothing but lift.</strong> A
              bevel and a contact shadow, and the bevel is <Code>inset</Code> so it sits
              inside the border rather than fighting it.
            </li>
          </ul>
          <p>
            The reason for the swap: a shadow ring is soft and scale-dependent, and it
            fades as the shadow does. A real border stays exactly 1px crisp at any zoom
            and does not soften on hover. It also matters more here than it did on white,
            because with no usable drop shadow the edge is <em>most</em> of what says
            &ldquo;object&rdquo;.
          </p>
          <p>
            <strong>The panel width came DOWN to 1px, from 1.5px.</strong> The old value
            had a stated justification — &ldquo;at 1px a border on a white card reads as a
            rendering artefact&rdquo; — which is true of a dark hairline on white and
            false of a white hairline on dark glass, where 1.5px reads heavy and turns a
            grid of cards into a wireframe. The value moved with the ground it describes.
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
          <p>
            <strong>And do not reach for <Code>--color-line-strong</Code> to divide a
            region.</strong> It is a <em>control</em> edge — badges, pills, checkbox and
            radio boxes, the EmptyState frame, the Toolbar separator. Section boundaries
            come from the tier boundary (a serif title on the plane, cards below it),
            from whitespace, and from <Code>&lt;Separator /&gt;</Code>.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Glass is the language now, not the exception"
        description="This page said “navigational chrome only” for two releases. The rule has not been softened — it has been paid for."
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

        <UXNote title="What changed, and what did not">
          <p>
            <strong>1 · Chrome and content are the same material.</strong>{" "}
            <Code>--color-glass</Code> is <Code>var(--plane-fill)</Code> — not a value
            that resembles the plane, the plane itself. The page IS a translucent panel,
            so a topbar made of something else would read as a second material sitting on
            a first, and the seam where they meet is where you would see it.
          </p>
          <p>
            <strong>What buys that is <Code>--backdrop-cap</Code>, and nothing else
            does.</strong> The old rule existed because a sheer fill over{" "}
            <strong>arbitrary</strong> content makes contrast a matter of luck. Here the
            content behind the plane is a photograph held under a cap that pins its
            brightest possible pixel to <strong>0.22 luminance</strong>, so the worst case
            is imposed rather than hoped for. <strong>Translucent content without that cap
            is still the mistake the rule exists to prevent</strong> — if you are copying
            this treatment somewhere the cap does not reach, you are copying the risk and
            leaving the mitigation behind. The derivation is on{" "}
            <DocLink href="/docs/foundations/spatial">Spatial</DocLink>.
          </p>
          <p>
            <strong>2 · The barrier layer is still not optional.</strong>{" "}
            <Code>--color-glass</Code> alone is too sheer for text to survive whatever
            drifts under a fixed bar. <Code>.glass</Code> paints{" "}
            <Code>--color-glass-barrier</Code> via <Code>::before</Code> beneath the
            content — <Code>oklch(14% 0.012 255 / 0.34)</Code>, a <em>dark</em> barrier
            now, because ink here is near-white. That is what turns &ldquo;contrast is
            usually fine&rdquo; into &ldquo;contrast is guaranteed.&rdquo;
          </p>
          <p>
            <strong>3 · Always paired with elevation and an edge.</strong> Translucency on
            its own reads as broken rendering. Translucency plus a real shadow{" "}
            <em>and</em> a real border reads as a pane of glass. The{" "}
            <Code>.glass</Code> utility carries the 1px panel border and{" "}
            <Code>--shadow-lg</Code> itself, so you never have to remember either.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Overlays are the one thing that does NOT go translucent under a
            translucent language.</strong> All five — <Code>Dialog</Code>,{" "}
            <Code>Popover</Code>, <Code>DropdownMenu</Code>, <Code>Select</Code>,{" "}
            <Code>Tooltip</Code> — take <Code>--color-surface-solid</Code> at 0.94 and get
            no <Code>backdrop-filter</Code> at all. Ink on one measures{" "}
            <strong>15.68:1</strong>, with nothing about the backdrop entering the
            calculation.
          </p>
          <p>
            There are two reasons and the second settles it. Rule 1 of the language
            forbids stacked translucency. And blurring an already-blurred field buys
            nothing: the plane is smooth at 40px, so a second pass is visually identical
            at the cost of a full compositor pass over the overlay&apos;s bounds. What a
            menu actually needs is the guarantee the plane has and it does not —{" "}
            <strong>nothing imposes a cap behind a dropdown.</strong> It can open over
            generated media, over a bright photograph, over another menu.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="Why there is a photograph behind everything"
        description="The one piece of this system that looks decorative, and the argument for it."
      >
        <p className="mb-5 text-ink-secondary">
          Translucency over a flat static colour is wasted — there is nothing to reveal,
          so it costs contrast and buys nothing. A blurred plane over a flat fill is just
          a slightly different flat fill. The photograph exists to give the plane
          something to be translucent <em>over</em>. That is the whole justification; it
          is not there to look futuristic.
        </p>
        <p className="mb-5 text-ink-secondary">
          It lives in <Code>components/chrome/spatial-backdrop.tsx</Code> as a fixed,{" "}
          <Code>aria-hidden</Code>, pointer-events-none layer, and it is a CSS{" "}
          <Code>background-image</Code> rather than an <Code>&lt;Image&gt;</Code> on
          purpose: a browser does not fetch the background of an element whose computed{" "}
          <Code>display</Code> is <Code>none</Code>, so a user who has asked for reduced
          transparency downloads zero bytes for a backdrop they will never see.
        </p>
        <SpecTable
          columns={["Layer", "Value", "Why"]}
          rows={[
            [
              "The photograph",
              "--backdrop-image, defaulting to a non-figurative tunnel frame",
              "Fixed, so the plane scrolls and the image does not — which is most of what makes the plane read as floating in front of something. A workspace can override it, and the override goes through the same cap.",
            ],
            [
              "The cap",
              "--backdrop-cap: 0.4",
              "A black layer over the image that pins the brightest pixel ANY photograph can produce to 0.22 luminance. This is what lets every contrast figure in the kit be a promise about an image the system has never seen.",
            ],
            [
              "The plane",
              "--plane-fill at 0.72, blur(40px), saturate(165%)",
              "28% of the capped photograph comes through, which is what the blur and the saturation are for. Blur averages colours together and therefore desaturates them; the saturation puts it back.",
            ],
            [
              "The plane's lift",
              "inset 0 1px 0 white @ 0.14, then --plane-lift",
              "The same specular bevel the shadow scale uses. It is most of why a translucent panel reads as a pane of something rather than as reduced opacity.",
            ],
          ]}
        />

        <UXNote title="The ceiling is measured, not chosen — and the arithmetic is the interesting part">
          <p>
            <strong>0.40 is not 1 − 0.22.</strong> CSS composites in{" "}
            <em>gamma space</em>: an <Code>opacity</Code> or an alpha fill blends encoded
            sRGB, not linear light. This was first written as <strong>0.78</strong>,
            straight from 1 − 0.22, as if opacity scaled luminance directly. It does not —
            a peak-white pixel under a 0.78 black overlay renders at sRGB 0.220, whose
            luminance is <strong>0.0397</strong>. Off by 5.5×.
          </p>
          <p>
            0.78 crushes the photograph to a near-black field and makes every contrast
            figure derived from it wrong in the flattering direction. The correct
            conversion runs through the transfer function:{" "}
            <Code>cap = 1 − encode(target_luminance)</Code>, so 0.40 → sRGB 0.60 →
            luminance 0.22. The same correction applies to every composite in the token
            file: <Code>alpha × fg + (1−alpha) × bg</Code> is only valid on{" "}
            <strong>encoded</strong> values, per channel.
          </p>
        </UXNote>

        <UXNote title="What replaced what">
          <p>
            This section used to describe an animated CSS ambient layer — drifting blurred
            blobs, a sweep band, a ruled grid, a scrim, a conic wash and a grain overlay,
            all on prime-numbered durations so the combined loop could never be caught.
            That layer is gone, and the component with it. It was doing the same job the
            photograph does now, with one difference that decided it: a generated field
            has no worst case you can name, so its ceiling had to be argued down by
            measurement every time it changed, whereas a capped image has a worst case by
            construction.
          </p>
          <p>
            <Code>.ambient-ground</Code> survives in <Code>globals.css</Code> as a frozen,
            static sample of that palette, and it is used in exactly one place: the
            examples on this docs site that need a representative busy backdrop inside a
            fixed-size box (the glass specimen above is sitting on it). It is not painted
            on any product route.
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
            information. Under <Code>prefers-contrast: more</Code> both surfaces drop
            their shadows and take a real border instead — that fallback is why the
            treatment is defensible at all.
          </p>
          <p>
            <strong>The constraint used to be stated as &ldquo;and it carries no
            text&rdquo;, which was wrong about the code.</strong>{" "}
            <Code>SegmentedControl</Code> and <Code>FilterPills</Code> both put{" "}
            <Code>text-ink</Code> directly on <Code>.neu-raised</Code>, so the raised fill
            is a label&apos;s background in two of its five consumers. The real constraint
            is narrower: the raised fill has to hold body-text contrast. It does — 38% L,
            opaque, <strong>9.2:1</strong> for ink on top of it — and that is what ruled
            out the near-white value this language first tried, which rendered near-white
            text on near-white and made the selected tab unreadable.
          </p>
          <p>
            The lighting is also inverted from a light ground, and has to be. Light falls{" "}
            <em>into</em> a hole from above, so <Code>.neu-inset</Code> puts its shadow at
            the top and a faint sheen at the bottom. The old values had a 70% white line
            along the bottom inside face — correct on white, a bright scratch across a
            dark groove here.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="The glass recipe"
        description="A fill that is the plane's own, 44px of blur, 180% saturation, a dark barrier and a specular top edge — and it disappears entirely until something scrolls under it."
      >
        <SpecTable
          columns={["Ingredient", "Value", "What it is actually for"]}
          rows={[
            ["Fill", "--color-glass = var(--plane-fill)", "One value, so chrome and content cannot disagree about what they are made of. It is the plane's 18% L at 0.72 alpha, not a copy of it."],
            ["Blur", "--blur-glass, 44px", "Readability over a busy backdrop comes from destroying high-frequency detail, not from opacity. A smooth wash can be sat on at an alpha a sharp one could not."],
            ["Saturation", "--saturate-glass, 180%", "The half people forget. Averaging many colours desaturates them, so blur alone yields a grey, washed-out panel. Pushing saturation back up is the difference between frosted glass and a translucent grey rectangle."],
            ["Barrier layer", "--color-glass-barrier, oklch(14% 0.012 255 / 0.34)", "Mandatory, and DARK — it used to be a white 18% wash, which is the correct direction only while the ink is dark. Still the thing that turns “contrast is usually fine” into “contrast is guaranteed”."],
            ["Specular edge", "inset 0 1px 0 white @ 55%", "A bright hairline along the top inside face. Real glass catches light on its top bevel, and this one line is most of why the panel reads as a physical pane rather than as reduced opacity."],
            ["Edge + lift", "1px --color-line, plus --shadow-lg", "Rule 3, shipped inside the utility rather than left to the call site."],
          ]}
        />
        <UXNote title="Where the floor is measured">
          <p>
            The plane is not the binding case and neither is the glass — the{" "}
            <strong>card</strong> is, because it is the lightest thing most text sits on.
            Every ink level clears 4.5:1 there (tertiary at <strong>5.10:1</strong>), and
            on the bare plane every level is higher; the glass adds a dark barrier layer
            on top of that. The full table is on{" "}
            <Code>Color</Code>.
          </p>
          <p>
            That is the opposite of the situation this kit was in on a light ground, where
            chrome was the risky surface and content was safe. What flipped it is the
            cap: the surface with a guaranteed backdrop stopped being the exception.
          </p>
        </UXNote>

        <UXNote title="Adaptive glass: it is not there until it has a job">
          <p>
            At the top of a page there is nothing beneath the bar. The fill, the blur,
            the border and the shadow are separating it from <em>nothing</em> — all
            they do is draw a rectangle over the page. So the topbar renders fully
            transparent and materialises the moment content actually arrives
            underneath, driven by <Code>data-lifted</Code> on the element and the{" "}
            <Code>useScrolled</Code> hook. The barrier layer fades with it, because at
            rest the backdrop is one we control.
          </p>
          <p>
            <strong>It is opt-in, and only the topbar takes it.</strong> The session
            rails and the composer always have content behind them, so they are always
            glass; an element with no <Code>data-lifted</Code> attribute is untouched by
            those rules.
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
