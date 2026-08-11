import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Chrome & layout" };

export default function ChromeDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Product UX"
        title="Chrome & layout"
        lede="Navigation, page shells, and the two deliberate exceptions where the app chrome disappears."
      />

      <DocSection
        title="The topbar: three nouns and one dropdown"
        description="Agents, Workflows, Models flat. Everything else behind Platform."
      >
        <SpecTable
          columns={["Slot", "Contents", "Reasoning"]}
          rows={[
            ["Wordmark", "Returns to the dashboard", "Near-universal convention, and it buys back a nav slot — Home is deliberately not a separate item."],
            ["Flat items", "Agents · Workflows · Models", "The product's three core content types — the nouns a user comes here to work with."],
            ["Platform ▾", "Playground, Run History, API Keys, Webhooks, Docs", "Infrastructure visited occasionally. Mixing it with the core three makes the important things compete with plumbing."],
            ["Balance", "Figure always visible; meter reveals on hover", "Metered product: spend is glanceable state and the reason a generation gets blocked, so the FIGURE never collapses. The meter answers a less urgent question and can afford to wait for hover."],
            ["Workspace switcher", "Name, role badge, workspace settings", "Multi-tenant context should never be ambiguous."],
            ["Avatar menu", "Account, docs, log out", "Personal scope, distinct from workspace scope."],
          ]}
        />
        <UXNote title="Why it is a centred island, not a bar">
          <p>
            The topbar is a <strong>compact pill, only as wide as its contents</strong>,
            centred at the top of the viewport — roughly 320px at rest rather than the
            full page width. A bar spends the entire top edge of every screen on five
            links and an avatar; this spends 320px and gives the rest back to the page.
          </p>
          <p>
            It is also what makes glass legitimate on it: a translucent full-bleed band
            reads as a rendering artifact, while a translucent floating object reads as
            an object. On a product whose surfaces are already floating and translucent,
            a welded band across the top is the one element that would look bolted on.
          </p>
        </UXNote>

        <UXNote title="Icon-first, label on hover — and the two rules that make that safe">
          <p>
            Each destination is a glyph at rest and grows its label when the pill is
            hovered. Two decisions stop that from being the usual icon-only disaster:
          </p>
          <p>
            <strong>1 · The active item never collapses.</strong> Icon-only navigation&apos;s
            real failure is not &ldquo;what does this glyph mean&rdquo;, it is{" "}
            <em>where am I</em>. One label is visible at rest and it is the one that
            answers that question.
          </p>
          <p>
            <strong>2 · The whole pill expands, not the hovered item.</strong> Per-item
            expansion is the obvious reading and it is a trap: growing one item shoves
            its neighbours sideways, so aiming at the next one means chasing a moving
            target — the same failure as macOS dock magnification. Hovering anywhere
            opens every label at once, the pill grows a single time, and then nothing
            moves while you travel along it.
          </p>
          <p>
            Labels are collapsed with <Code>max-width: 0</Code> and{" "}
            <Code>overflow: hidden</Code>, never <Code>display: none</Code>, so they
            stay in the accessibility tree — a screen reader and a keyboard user get
            the full name at all times, regardless of hover. The padding that separates
            icon from label lives <em>inside</em> the clipped span; a margin would
            survive <Code>max-width: 0</Code> and leave a visible hole.
          </p>
        </UXNote>
        <DontNote>
          <p>
            Do not grow the flat items past four. Five or more and the row stops reading
            as &ldquo;the main things&rdquo; and starts reading as a menu bar, at which
            point the hierarchy the split was meant to create is gone.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="No NAVIGATION sidebar in the product — and why /models/all still has one"
        description="A deliberate inconsistency, plus the distinction that keeps it from being violated by accident."
      >
        <p className="mb-5 text-ink-secondary">
          The app has no <strong>navigation</strong> sidebar: it costs 240–280px
          permanently, and this product&apos;s screens are data-dense tables and a media
          canvas that both want the width. Wayfinding is handled by the topbar plus a
          page eyebrow (<Code>Platform</Code>, <Code>Settings</Code>) that names the zone.
          A second answer to &ldquo;where am I&rdquo; is worse than a cramped one.
        </p>
        <UXNote title="Navigation rail vs. page controls — the line that matters">
          <p>
            <Code>/models/all</Code> renders an <Code>&lt;aside&gt;</Code> of filter
            facets, and that is <strong>not</strong> an exception to the rule above. The
            rule is about wayfinding. A facet rail is page-scoped <em>controls</em>: it
            only exists while you are on that page, it changes what you are looking at
            rather than where you are, and it leaves when you leave.
          </p>
          <p>
            The test to apply before adding one: <strong>does it survive
            navigation?</strong> If it persists across routes it is navigation, it
            competes with the topbar, and it does not belong. If it dies with the page it
            is a control, and it belongs wherever the page needs it.
          </p>
        </UXNote>
        <p className="text-ink-secondary">
          <Code>/docs</Code> <em>does</em> have a persistent index, because a reference
          site is something you scan and jump around in — a fundamentally different task
          from operating a tool. Same system, different job, different navigation. When
          you port this, do not &ldquo;fix&rdquo; the inconsistency by making them match.
        </p>
      </DocSection>

      <DocSection
        title="Two focus modes where chrome disappears"
        description="Route groups, not conditional rendering."
      >
        <SpecTable
          columns={["Route group", "Chrome", "Why"]}
          rows={[
            ["(app)", "Full topbar + page padding", "Every normal product surface."],
            ["/models \u2192 /models/all", "Same shell; the child adds a filter aside", "Browse and search are different tasks. The showroom is rails of covers for someone who does not yet know what they want; the catalogue is search + facets for someone who does. Splitting them means neither has to compromise \u2014 and a filtered catalogue is a URL people share."],
            ["(focus) — /agents/[id]", "No topbar. The session renders its own header.", "The artifact is the point and needs the full viewport. Reintroducing the topbar would undercut the canvas the whole layout exists to serve."],
            ["(auth) — /login, /signup", "No topbar, centred card", "There is nothing to navigate to yet."],
          ]}
        />
        <UXNote title="A focus mode still needs exits">
          <p>
            The session workspace provides two, matched to how often each is used: a{" "}
            <strong>&ldquo;← Sessions&rdquo;</strong> link at the top of the timeline rail
            (frequent — back to the hub), and the{" "}
            <strong>wordmark in its own header</strong> (occasional — all the way home).
          </p>
          <p>
            A focus mode with no way out is a trap, and &ldquo;press the browser back
            button&rdquo; is not an interface.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Page shell conventions"
        description="Every (app) page follows the same skeleton, so a new page is a filled-in template rather than a fresh layout decision."
      >
        <SpecTable
          columns={["Element", "Convention"]}
          rows={[
            ["Container", "mx-auto max-w-(--page-max-width) px-6 lg:px-8 pb-24"],
            ["Header", "<SectionHeader level={1}> with an eyebrow naming the zone, a title, and a description that says what the page is FOR"],
            ["Entrance", "anim-rise on each major section with stagger-1…5 in reading order"],
            ["Focal element first", "The thing the user came for leads. On Home that is the composer and what it has produced — not a KPI row, and no longer fleet status either: status describes the product as infrastructure to babysit, which is not the proposition."],
            ["Empty states", "Never an empty list under a header. Either omit the section or render <EmptyState>."],
          ]}
        />
        <p className="text-ink-secondary">
          The session workspace is the one page that breaks the container convention: it
          is a fixed <Code>h-dvh</Code> shell whose regions own their own scrolling, so
          the composer stays put while the canvas and rails move independently.
        </p>
      </DocSection>
    </>
  );
}
