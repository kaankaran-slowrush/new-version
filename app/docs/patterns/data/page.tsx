import { Download, Plus } from "lucide-react";
import {
  CodeBlock,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
  StatTile,
  StatusMark,
  Toolbar,
  ToolbarGroup,
  ToolbarLabel,
  ToolbarSeparator,
} from "@/components/patterns";
import { Button } from "@/components/primitives";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";
import { CodeBlockDemo, CopyFieldDemo, FilterPillsDemo } from "./demos";

export const metadata = { title: "Data display" };

export default function DataDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Patterns"
        title="Data display"
        lede="Tables, tiles, snippets and the bars that sit above them. These are the components an operator stares at all day, so the rules here are about scanning: numbers that do not move, columns that compare, and wide content that scrolls itself instead of dragging the page sideways."
      />

      <DocSection
        title="Two rules that apply to everything on this page"
        description="If you take nothing else from it, take these."
      >
        <UXNote title="1 · .tabular on any number that can change">
          <p>
            In a proportional font the digits have different widths — a{" "}
            <Code>1</Code> is narrower than a <Code>0</Code>. So a counter ticking{" "}
            <Code>1,299 → 1,300</Code> re-measures itself, and everything laid out beside
            it twitches. Across a column of forty rows updating on a poll, the whole table
            shimmers.
          </p>
          <p>
            <Code>.tabular</Code> is one line —{" "}
            <Code>font-variant-numeric: tabular-nums</Code> — and it makes every digit
            occupy the same advance width. It is applied for you by{" "}
            <Code>DataTableCell numeric</Code>, <Code>StatTile</Code>&apos;s value and
            delta, <Code>MeterBar</Code>&apos;s readout, <Code>ToolbarLabel</Code> and{" "}
            <Code>FilterPills</Code> counts. Anywhere you write a number by hand, add it
            yourself.
          </p>
          <p>
            The one place not to use it is prose: tabular figures in a sentence look
            slightly loose, because they are optimised for vertical alignment you do not
            have.
          </p>
        </UXNote>

        <UXNote title="2 · Wide content scrolls in its own container">
          <p>
            A twelve-column table, a 300-character JWT, a curl command with four headers
            — all normal, all wider than the column they live in. If the component does
            not bound its own overflow, the <strong>page body</strong> scrolls instead,
            and then the nav, the toolbar and every other section slide off-screen while
            the user is trying to read one value. They now have to scroll back to do
            anything.
          </p>
          <p>
            So the scroll boundary is always inside the component:{" "}
            <Code>DataTable</Code> puts <Code>overflow-x-auto</Code> on a wrapper div
            around the <Code>&lt;table&gt;</Code> (a table cannot be its own scroll
            container), <Code>CodeBlock</Code> puts it on the <Code>&lt;pre&gt;</Code>,{" "}
            <Code>Toolbar</Code> and <Code>FilterPills</Code> on themselves,{" "}
            <Code>ErrorState</Code> on its <Code>detail</Code> line. All of them add{" "}
            <Code>overscroll-x-contain</Code>, which stops a horizontal trackpad swipe
            from turning into browser back-navigation once the scroll hits its end.
          </p>
          <p>
            The matching half of that: <Code>min-w-0</Code>. A flex or grid child defaults
            to <Code>min-width: auto</Code>, so it will happily push its column wider
            rather than scroll. Both <Code>DataTable</Code> and <Code>CodeBlock</Code> set
            it — if you build a new wide component, it is the line you will forget.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="DataTable"
        description="A presentational table shell. There is no columns prop, and there is no sorting."
      >
        <Example label="Composed in JSX — the table owns nothing but the look" stack>
          <DataTable
            surface="panel"
            hoverRows
            caption="Model usage for the last 24 hours"
            wrapperClassName="max-w-full"
          >
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell>Model</DataTableHeadCell>
                <DataTableHeadCell>State</DataTableHeadCell>
                <DataTableHeadCell numeric sortDirection="desc">
                  Calls
                </DataTableHeadCell>
                <DataTableHeadCell numeric sortDirection="none">
                  p95
                </DataTableHeadCell>
                <DataTableHeadCell numeric>Spend</DataTableHeadCell>
                <DataTableHeadCell nowrap>Last run</DataTableHeadCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              <DataTableRow selected>
                <DataTableCell primary>claude-sonnet-4-6</DataTableCell>
                <DataTableCell>
                  <StatusMark status="live" label="Serving" showLabel size="sm" />
                </DataTableCell>
                <DataTableCell numeric>12,904</DataTableCell>
                <DataTableCell numeric>412ms</DataTableCell>
                <DataTableCell numeric>$184.20</DataTableCell>
                <DataTableCell meta nowrap>
                  14s ago
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell primary>flux-1.1-pro</DataTableCell>
                <DataTableCell>
                  <StatusMark status="success" label="Idle, healthy" showLabel size="sm" />
                </DataTableCell>
                <DataTableCell numeric>1,118</DataTableCell>
                <DataTableCell numeric>3.9s</DataTableCell>
                <DataTableCell numeric>$61.05</DataTableCell>
                <DataTableCell meta nowrap>
                  6m ago
                </DataTableCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableCell primary>kling-v2-master</DataTableCell>
                <DataTableCell>
                  <StatusMark status="error" label="Failed: rate limited" showLabel size="sm" />
                </DataTableCell>
                <DataTableCell numeric>96</DataTableCell>
                <DataTableCell numeric>28.4s</DataTableCell>
                <DataTableCell numeric>$212.80</DataTableCell>
                <DataTableCell meta nowrap>
                  41m ago
                </DataTableCell>
              </DataTableRow>
              <DataTableRow muted>
                <DataTableCell primary>sdxl-turbo (retired)</DataTableCell>
                <DataTableCell>
                  <StatusMark status="idle" label="Archived" showLabel size="sm" />
                </DataTableCell>
                <DataTableCell numeric>0</DataTableCell>
                <DataTableCell numeric>—</DataTableCell>
                <DataTableCell numeric>$0.00</DataTableCell>
                <DataTableCell meta nowrap>
                  12 Jun
                </DataTableCell>
              </DataTableRow>
            </DataTableBody>
          </DataTable>
        </Example>

        <UXNote title="Why there is no columns config">
          <p>
            The moment a table accepts a <Code>columns</Code> array it starts owning
            decisions that belong to the feature: how a cell is formatted, what width a
            column wants, which cell holds a status mark, where the sort state lives.
            Those configs grow render props and escape hatches until the &ldquo;simple&rdquo;
            API is harder to use than JSX was.
          </p>
          <p>
            So rows are written by hand and this file owns nothing but the look — cell
            padding, ink levels, hairlines, alignment. That also means the same shell
            works for a four-row summary and a virtualised list, because it never sees
            the data.
          </p>
        </UXNote>

        <SpecTable
          columns={["Prop", "Values", "Default", "Effect"]}
          rows={[
            ["surface", "plain · panel", "plain", "`plain` sits on a Card's existing padding. `panel` gives it 16px radius, bg-surface and shadow-sm — concentric-safe inside an 18px card."],
            ["density", "comfortable · compact", "comfortable", "comfortable: td 12px / th 10px vertical. compact: 8px both. Applied through descendant selectors, so one prop changes every cell."],
            ["hoverRows", "boolean", "false", "tbody rows take bg-surface-hover on hover, 160ms."],
            ["stickyHeader", "boolean", "false", "th sticks to top:0 at z 90 with an opaque bg-surface fill. Needs a height-bounded scroll parent to stick to."],
            ["caption", "node", "—", "Renders a visually hidden <caption>. Give every table a name."],
            ["wrapperClassName", "string", "—", "Targets the scroll wrapper. `className` targets the <table> itself."],
            ["Cell inset", "16px horizontal", "—", "Shared by th and td, so columns line up with the card padding around them."],
          ]}
        />

        <SpecTable
          columns={["Cell prop", "On", "Effect"]}
          rows={[
            ["numeric", "HeadCell, Cell", "text-right + .tabular. Both halves of a comparable number column."],
            ["nowrap", "HeadCell, Cell", "whitespace-nowrap — keeps a column from being squeezed to nothing by a long neighbour."],
            ["primary", "Cell", "font-medium at ink. The row-identifying column."],
            ["meta", "Cell", "12px at ink-tertiary. Timestamps, owners, ids."],
            ["selected", "Row", "bg-accent-soft plus aria-selected. Persistent emphasis — the row a side panel is showing."],
            ["muted", "Row", "text-ink-tertiary. Recedes an archived or disabled record without hiding it."],
            ["sortDirection", "HeadCell", "asc | desc | none. Draws the caret and sets aria-sort. Display only — see below."],
          ]}
        />

        <UXNote title="Numeric columns are right-aligned and tabular — both, always">
          <p>
            Right alignment puts the ones digits in a single vertical line, so{" "}
            <Code>12,904</Code> against <Code>96</Code> is a difference you see as a
            length rather than one you have to parse. Left-align a number column and you
            have thrown away the only free comparison a table offers.
          </p>
          <p>
            Note what rides along with it: when a sortable head cell is{" "}
            <Code>numeric</Code>, the caret flips to the left of the label
            (<Code>flex-row-reverse</Code>) so the label still lands on the alignment edge
            the column established. A caret pushed out to the right would leave the header
            text and the numbers below it on two different edges.
          </p>
          <p>
            Headers are 12px uppercase tracked at <Code>ink-muted</Code> — deliberately the
            weakest ink in the table. A header row in strong ink competes with the data,
            and the data is the reason the table exists. Uppercase plus letter-spacing buys
            presence without weight.
          </p>
        </UXNote>

        <UXNote title="sortDirection is display-only. There is no sorting in this kit.">
          <p>
            <Code>sortDirection</Code> draws the caret and sets <Code>aria-sort</Code>.
            That is all it does. It does not sort the rows, subscribe to anything, or call
            back. Pass <Code>onClick</Code> to the head cell and own the state and the
            ordering yourself.
          </p>
          <p>
            This is not laziness, it is the boundary that keeps the component honest.
            Real sorting is server-side as often as not, may be paginated, may be
            multi-column, and definitely needs to survive a URL. A table that sorts its
            own DOM rows would be correct on a 20-row demo and wrong in production. What
            it can genuinely own is the <em>indicator</em> — including the accessibility
            side, which is the part people forget.
          </p>
          <p>
            Passing the prop at all is what marks a column as sortable, so a column that
            never sorts should omit it entirely rather than pass <Code>&quot;none&quot;</Code>.{" "}
            <Code>&quot;none&quot;</Code> means &ldquo;sortable, not currently
            sorted&rdquo; and renders the neutral double chevron.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>No zebra striping.</strong> Separation is a top hairline per row.
            Stripes add a second alternating background the eye has to filter out on every
            scan, and they compete with hover for the same channel — on a striped table
            the hover state is either invisible on the dark rows or looks like a third
            stripe. <Code>border-t</Code> on each row also means the first row needs no
            rule (the header already ended it) and the last needs no closing one (the
            container edge does that).
          </p>
          <p>
            <strong>And no hover on a table whose rows are not targets.</strong>{" "}
            <Code>hoverRows</Code> is opt-in for a reason: a row that lights up under the
            pointer and then does nothing when clicked is a lie about affordance, and it
            costs you a click of trust every time.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="StatTile"
        description="One metric, read in one glance. Eyebrow → value → delta → optional meter."
      >
        <Example label="A row of tiles, surface=panel" stack>
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <StatTile
              surface="panel"
              label="Calls today"
              value="14,118"
              delta="12.4%"
              deltaDirection="up"
              caption="vs. last 7d"
            />
            <StatTile
              surface="panel"
              label="p95 latency"
              value="412"
              unit="ms"
              delta="8.1%"
              deltaDirection="up"
              invertDelta
              caption="vs. last 7d"
            />
            <StatTile
              surface="panel"
              label="Balance"
              value="$1,284"
              deltaDirection="flat"
              delta="—"
              meter={{ value: 64, tone: "accent", showValue: "64% of plan" }}
              adornment={<StatusMark status="live" label="Metering active" size="sm" />}
            />
          </div>
        </Example>

        <Example label="Sizes and the sunken surface" stack>
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <StatTile surface="sunken" size="sm" label="Queued" value="6" />
            <StatTile surface="sunken" size="md" label="Running" value="12" />
            <StatTile surface="sunken" size="lg" label="Total spend" value="$8,402" />
          </div>
        </Example>

        <SpecTable
          columns={["Element", "Type", "Ink", "Notes"]}
          rows={[
            ["label", "11px sans, uppercase, 0.08em tracking", "ink-tertiary", "A field name you read once. The .eyebrow utility — sans, because a label is something a person wrote. Tracked because uppercase at 11px loses its word shapes."],
            ["value", "sm 18px / md 28px / lg 34px, 600", "ink", "Always .tabular. `sm` for grids of six or more, `lg` for a single hero number."],
            ["unit", "13px", "ink-tertiary", "Baseline-aligned with the value, not superscript."],
            ["delta", "12px, 500, with an arrow glyph", "success / danger / ink-tertiary", "Tone comes from deltaDirection XOR invertDelta."],
            ["caption", "11px", "ink-muted", "Lowest priority: \"vs. last 7d\", \"since Jun 1\"."],
            ["meter", "MeterBar props object", "—", "Renders the shared strip 12px under the value."],
            ["adornment", "node, top-right", "—", "A StatusMark, an icon, a small menu button."],
            ["surface", "plain · panel · sunken", "—", "plain inside an existing card; panel = 16px radius, bg-surface, shadow-xs; sunken = 16px radius on surface-sunken."],
          ]}
        />

        <UXNote title="Hierarchy is size AND weight AND colour — never size alone">
          <p>
            Scaling one number up while everything around it stays the same grey gives
            you a big grey page. Four ink levels are in play in a single tile: an 11px
            tracked sans eyebrow at <Code>ink-tertiary</Code> that recedes, a 32px semibold
            value at <Code>ink</Code> that is the answer, a 12px semantic delta, and an
            11px caption at <Code>ink-muted</Code>. That is what makes the eye land on the
            number without being told to.
          </p>
          <p>
            <strong>The delta direction is an arrow, not just a colour and a sign</strong>
            — same reason as <Code>StatusMark</Code>. And{" "}
            <Code>invertDelta</Code> exists because up is not always good: latency, error
            rate and spend all get worse as they rise, and a green &ldquo;+8.1%&rdquo; next
            to p95 is actively misleading. The component also emits &ldquo;Up&rdquo; /
            &ldquo;Down&rdquo; / &ldquo;No change&rdquo; as <Code>sr-only</Code> text, so
            the direction is not carried by a glyph alone.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Never put a rule between a tile&apos;s own label and its value.</strong>{" "}
            Whitespace groups; a line separates. A hairline there tells the eye these are
            two different things, when the entire point of the tile is that they are one
            fact stated twice — once as a name, once as a number.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="CodeBlock"
        description="A snippet on a sunken surface that scrolls itself. No highlighting, no clipboard write."
      >
        <Example label="With a header, a language tag and a working copy button" stack>
          <div className="w-full min-w-0">
            <CodeBlockDemo />
          </div>
        </Example>

        <Example label="No header · wrap for prose-ish content · clamped height" stack>
          <div className="grid w-full min-w-0 gap-3">
            <CodeBlock
              size="sm"
              code={`MODELSTORE_KEY=sk_live_… \nMODELSTORE_REGION=eu-west-1`}
            />
            <CodeBlock
              wrap
              language="text"
              code="RateLimitError: this project is limited to 40 requests per second on kling-v2-master; the request was rejected after 3 retries with exponential backoff. Raise the ceiling in Settings → Fleet, or route overflow to a secondary model."
            />
            <CodeBlock
              filename="lib/tokens.css"
              language="css"
              maxHeight="7rem"
              code={`:root {\n  --control-height-sm: 2rem;\n  --control-height-md: 2.25rem;\n  --control-height-lg: 2.75rem;\n  --control-height-xl: 3.5rem;\n  --nav-height: 3.5rem;\n  --nav-inset: 1rem;\n  --blur-glass: 44px;\n  --meter-thickness: 3px;\n}`}
            />
          </div>
        </Example>

        <SpecTable
          columns={["Prop", "Values", "Default", "Notes"]}
          rows={[
            ["code", "string", "required", "Passed verbatim into <code>. This component does not highlight."],
            ["filename", "node", "—", "Shows the header strip. Mono 11px at ink-tertiary, truncated."],
            ["language", "string", "—", "Display-only tag. The .eyebrow utility at ink-tertiary."],
            ["onCopy", "MouseEventHandler", "—", "Renders the copy button. Visual only — the caller owns the clipboard write."],
            ["copied", "boolean", "false", "Swaps the icon to a green check and the aria-label to \"Copied\"."],
            ["wrap", "boolean", "false", "Soft-wraps instead of scrolling. Off by default: wrapping real code destroys its indentation cues."],
            ["maxHeight", "CSS length, e.g. \"20rem\"", "—", "Clamps and scrolls vertically inside the block."],
            ["radius", "md · lg · xl", "lg", "Concentric: lg inside a Card, xl on the canvas. Never 2xl — it would match the card."],
            ["size", "sm · md · lg", "md", "11 / 12 / 13px mono."],
            ["bordered", "boolean", "true", "Adds the shadow-xs ring."],
            ["Surface", "bg-surface-sunken", "—", "Sunken, never raised: code is inert content you read or copy, not a control."],
            ["Scroll owner", "the <pre>, tabIndex 0", "—", "Focusable so the scroll region is reachable by keyboard."],
          ]}
        />

        <UXNote title="Why the copy state is a prop and not internal">
          <p>
            <Code>onCopy</Code> is a callback and <Code>copied</Code> is a prop, which
            keeps the component free of state and therefore server-safe — the same reason{" "}
            <Code>CopyField</Code> is built the same way. More importantly it keeps the
            &ldquo;did it work?&rdquo; truth with whoever actually called the clipboard
            API. That call can fail: an insecure origin, a locked-down browser, a denied
            permission. A component that flipped its own check mark on click would confirm
            a copy that never happened.
          </p>
          <p>
            The receipt itself is not optional. A copy button with no visible response
            gets clicked three times, and the user still does not know whether they have
            the value.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="CopyField"
        description="A value whose only job is to be copied. API keys, share links, webhook endpoints, request ids."
      >
        <Example stack>
          <div className="w-full max-w-md">
            <CopyFieldDemo />
          </div>
        </Example>

        <SpecTable
          columns={["Prop / detail", "Value", "Notes"]}
          rows={[
            ["Element", "readOnly <input>, not a div", "Focusable, keyboard-selectable, and scrollable when the value overflows."],
            ["Font", "mono, always", "`l` vs `1` vs `I` and `0` vs `O` are the entire content of an API key."],
            ["Row chrome", "bg-surface-sunken + shadow-xs ring", "The input language, not the button language."],
            ["size", "sm 32px / md 36px / lg 44px", "Radius 8 / 8 / 14px — the lg rung is the input rung and steps down inside a card."],
            ["label", "node", "Mono 11px uppercase at ink-tertiary, above the row. Doubles as the input's accessible name when it is a string."],
            ["hint", "node", "11px at ink-muted, under the row: \"created 12 Jun\", \"read-only scope\"."],
            ["masked", "boolean", "Shows a fixed 24-dot placeholder. The count is fixed on purpose — a dot per character would leak the key length."],
            ["adornment", "node", "Extra control before the copy button: a reveal toggle, a regenerate menu."],
            ["onCopy / copied", "handler / boolean", "Same contract as CodeBlock. The caller owns the write."],
            ["aria-label", "string", "Required when there is no visible label."],
          ]}
        />

        <UXNote title="An input, not a div with user-select">
          <p>
            The two look identical and behave differently in exactly the case that
            matters. When the clipboard API is unavailable — an insecure origin, a
            hardened browser, a policy — the copy button cannot work, and the only
            remaining route to the value is selecting it by hand. A real{" "}
            <Code>readOnly</Code> input is a tab stop, supports{" "}
            <Code>Cmd/Ctrl+A</Code> then <Code>Cmd/Ctrl+C</Code>, and scrolls internally
            so a long key can be read end to end. A div with <Code>user-select</Code>
            quietly removes all of that.
          </p>
          <p>
            The copy button sits <strong>inside</strong> the bordered row, flush right,
            sharing its height. Floating it outside gives the row two competing right
            edges and makes the button read as unrelated to the value. And{" "}
            <Code>masked</Code> is the safer default for anything shown after creation:
            secrets on screen get shoulder-surfed and screen-shared, so a value revealed
            on purpose beats one revealed by default.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="Toolbar"
        description="A layout, not a control. Two slots, because a bar only ever answers two questions."
      >
        <Example label="left = context · right = action" stack>
          <Toolbar
            surface="surface"
            aria-label="Run list actions"
            left={
              <>
                <ToolbarGroup>
                  <Button variant="ghost" size="sm">
                    Last 24h
                  </Button>
                  <Button variant="ghost" size="sm">
                    All models
                  </Button>
                </ToolbarGroup>
                <ToolbarSeparator />
                <ToolbarLabel>248 runs · 11 failed</ToolbarLabel>
              </>
            }
            right={
              <>
                <Button variant="ghost" size="sm" startIcon={<Download />}>
                  Export
                </Button>
                <Button variant="primary" size="sm" startIcon={<Plus />}>
                  New run
                </Button>
              </>
            }
          />
        </Example>

        <Example label="surface=sunken, sitting between a header and a table" stack>
          <Toolbar
            surface="sunken"
            size="sm"
            aria-label="Table filters"
            left={<ToolbarLabel>Sorted by spend, descending</ToolbarLabel>}
            right={
              <Button variant="ghost" size="sm">
                Reset
              </Button>
            }
          />
        </Example>

        <SpecTable
          columns={["Prop", "Values", "Default", "Notes"]}
          rows={[
            ["left", "node", "—", "Context: filters, search, counts, view switchers. min-w-0 so it can compress."],
            ["right", "node", "—", "Actions. shrink-0 so it never compresses."],
            ["surface", "plain · surface · sunken · divided", "plain", "surface: 16px radius, bg-surface, 12/8px padding, shadow-sm. sunken: same box on surface-sunken. divided: just a bottom hairline with 12px padding."],
            ["size", "sm 36px · md 40px · lg 48px", "md", "Minimum height only, and it tracks --control-height-* so a toolbar is never shorter than the buttons in it."],
            ["wrap", "boolean", "false", "false gives overflow-x-auto; true gives flex-wrap. See below."],
            ["sticky", "boolean", "false", "top-0 at z 90. Must be paired with `surface` or `sunken`."],
            ["aria-label", "string", "—", "The bar has role=\"toolbar\", so it needs a name: \"Run list actions\"."],
            ["ToolbarSeparator", "1px × 20px inset hairline", "—", "line-strong, 4px horizontal margin, aria-hidden."],
            ["ToolbarGroup", "role=\"group\", 4px gap", "—", "Tighter than the bar's own 8px, so a cluster reads as one unit."],
            ["ToolbarLabel", "12px at ink-tertiary, .tabular", "—", "Inline meta: \"24 results\". Tabular because it almost always contains a changing count."],
          ]}
        />

        <UXNote title="Why slots and not children">
          <p>
            <Code>Toolbar</Code> takes <Code>left</Code> and <Code>right</Code> and{" "}
            <Code>Omit</Code>s <Code>children</Code> from its props type outright. If it
            took children, the layout would be a suggestion: every caller would arrange
            its own <Code>justify-between</Code>, and within a month one screen would have
            the primary button on the left, another would have the result count on the
            right, and a third would have forgotten the <Code>shrink-0</Code> that keeps
            the actions on screen.
          </p>
          <p>
            <strong>Left is context, right is action, on every screen.</strong> That
            consistency is worth more than the flexibility it costs — once the primary
            button is top-right here and bottom-left there, the user has to{" "}
            <em>search</em> for it each time rather than move the pointer where it always
            is. Two named slots make the correct layout the only expressible one, and the
            prop names themselves document the rule to whoever reads the call site next.
          </p>
          <p>
            The same reasoning drives the overflow behaviour. With{" "}
            <Code>wrap=false</Code> the bar is <Code>overflow-x-auto</Code> and the right
            slot is <Code>shrink-0</Code>: when space runs short the context side
            compresses and scrolls, and the actions stay reachable. The reverse — actions
            sliding off the edge — leaves the user with a bar they can see and cannot
            use. Prefer <Code>wrap</Code> when the left slot holds filter pills that all
            need to stay visible.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Separators are for groups that mean different things, not for every
            gap.</strong> Spacing already groups; a rule between two related buttons
            actively says they are unrelated. The test: if you cannot name the two groups
            a separator divides, delete it and widen the gap instead.
          </p>
          <p>
            And keep it short. <Code>ToolbarSeparator</Code> is a 20px inset hairline, not
            a full-height rule — a line running the whole bar height reads as a table
            border and cuts the bar into cells, where an inset one reads as a pause. A
            sticky toolbar with <Code>surface=&quot;plain&quot;</Code> is the other trap:
            transparent means rows scroll straight through your labels.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="FilterPills"
        description="One row of capsules, exactly one active. Controlled, and the only client component in this folder."
      >
        <Example label="solid — free-standing pills on the canvas" stack>
          <FilterPillsDemo />
        </Example>

        <Example label="segmented — one neumorphic well containing the set" stack>
          <FilterPillsDemo variant="segmented" />
        </Example>

        <SpecTable
          columns={["Prop / detail", "Value", "Notes"]}
          rows={[
            ["items", "{ value, label, count?, disabled? }[]", "count renders as a second ink level inside the pill, .tabular."],
            ["value / onValueChange", "string / (v) => void", "Controlled only. There is no uncontrolled mode and no internal state."],
            ["variant", "solid · segmented", "solid: 6px gap, each pill bg-surface + shadow-xs. segmented: a .neu-inset rounded-full well with 4px padding."],
            ["size", "sm 32px · md 36px", "sm at 11px, md at 14px. Both rounded-full, and one notch below a button on purpose."],
            ["Active, solid", "bg-accent, text-accent-text", "Darker and heavier, not merely tinted."],
            ["Active, segmented", ".neu-raised, text-ink", "The one sanctioned neumorphic use: pressed vs. unpressed physicality IS the information."],
            ["Semantics", "role=\"radiogroup\" + role=\"radio\" aria-checked", "Not buttons with aria-pressed."],
            ["Overflow", "overflow-x-auto, overscroll-x-contain", "Twelve model filters scroll in the strip, never widen the page."],
            ["aria-label", "string", "Names the group: \"Filter runs by status\"."],
          ]}
        />

        <UXNote title="Exactly one active, always — and why that is a radiogroup">
          <p>
            This is single-select. There is no zero state: &ldquo;All&rdquo; is the
            neutral option, not an absence. If you need multi-select these are the wrong
            control — a pill row gives the user no way to see that two independent filters
            are stacked, so use checkboxes or removable chips, which show each condition
            as its own object you can dismiss.
          </p>
          <p>
            The ARIA follows from that. Semantically this <em>is</em> a radio group, and
            it is marked up as one; buttons with <Code>aria-pressed</Code> would announce
            four independent toggles instead of one choice with four options, which is a
            different and wrong mental model.
          </p>
          <p>
            The active pill is <strong>darker and heavier, not just tinted</strong>. A
            tint alone at 32–36px is easy to miss and vanishes in greyscale. The count
            beside the label drops to <Code>ink-muted</Code> at rest and to inherited
            colour at 70% opacity when active — same size, weaker ink, so the pill reads
            as a label with context rather than two equal words.
          </p>
        </UXNote>
      </DocSection>
    </>
  );
}
