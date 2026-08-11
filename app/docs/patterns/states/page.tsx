import Link from "next/link";
import { CircleStop, ImageIcon, KeyRound, Webhook } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
} from "@/components/patterns";
import { buttonVariants } from "@/components/primitives";
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
  ErrorStateDemo,
  ErrorStateInCardDemo,
  ErrorStateSizesDemo,
} from "./error-demo";

export const metadata = { title: "Empty & error states" };

export default function StatesDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Patterns"
        title="Empty & error states"
        lede="The states nobody designs and everybody sees. A first run is entirely empty states, and a failure is the moment a user decides whether this product is reliable — which makes these the highest-leverage screens in the kit and the ones most often left as a bare div."
      />

      <DocSection
        title="&ldquo;Nothing here&rdquo; is four different states"
        description="They share a screen shape and nothing else. Picking the wrong one is the most common mistake on this page."
      >
        <SpecTable
          columns={["Condition", "Component", "What the reader needs", "Example"]}
          rows={[
            [
              "Never had any",
              "FirstRun",
              "To be taught what this page is for, then given ONE way in. This is onboarding, and it is the only moment the product has their whole attention.",
              "/platform/api-keys on a new account",
            ],
            [
              "Filter excluded all",
              "EmptyState + recovery",
              "A way back. They already know what the page is — teaching here is insulting, and the action must undo the filter, not create a record.",
              "/models/all with a query that matches nothing",
            ],
            [
              "Had some, now zero",
              "EmptyState",
              "The action, without the lesson. They deleted the last webhook; they know what a webhook is.",
              "every endpoint removed",
            ],
            [
              "Not run yet",
              "EmptyState, no icon",
              "A promise about where the output will land. The page is not empty because they have nothing — it is empty because they have not pressed the button.",
              "/playground before Run",
            ],
          ]}
        />
        <DontNote>
          <p>
            The two that get swapped are the first two, in both directions. A search
            returning nothing and showing a three-step tutorial reads as broken. A
            brand-new account being told &ldquo;no results found&rdquo; reads as a
            product that has already given up on them.
          </p>
          <p>
            The test is one question: <strong>is the emptiness the user&apos;s doing?</strong>{" "}
            If they caused it — a filter, a search, a deletion — give them the way back. If
            they merely have not started, teach them how.
          </p>
        </DontNote>
        <UXNote title="Prefer showing a filled page over explaining an empty one">
          <p>
            <Code>FirstRun</Code> is the fallback, not the goal. The home page&apos;s first
            visit renders four clickable starter prompts where the artifact rail would be
            and carries no onboarding copy at all, because a prompt you can press beats a
            paragraph about prompting. <Code>/agents</Code> goes further and omits its
            session list entirely on a first visit — the two agent cards above it already
            are the way in, so a second panel would just push them down the page.
          </p>
          <p>
            Reach for <Code>FirstRun</Code> only where there is genuinely nothing to show:
            a fake API key is not clickable, and a fake run would be a lie.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="An empty list under a header reads as broken"
        description="This is the failure mode both components exist to prevent."
      >
        <Example label="Wrong — a header over a void" stack>
          <Card className="w-full">
            <CardHeader>
              <CardTitle meta="Last 24 hours">Recent runs</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="h-16" />
            </CardBody>
          </Card>
        </Example>

        <p className="mb-6 text-ink-secondary">
          Nothing distinguishes that from a failed fetch, a filter that matched nothing, or
          a component that threw during render. The user&apos;s first instinct is to reload
          the page — and when the reload produces the same thing, their second instinct is
          to stop trusting the panel next to it.
        </p>

        <Example label="Right — the absence is stated" stack>
          <Card className="w-full">
            <CardHeader>
              <CardTitle meta="Last 24 hours">Recent runs</CardTitle>
            </CardHeader>
            <CardBody>
              <EmptyState
                size="sm"
                title="No runs yet"
                description="Runs you start from an agent or the API will appear here with their cost and duration."
              />
            </CardBody>
          </Card>
        </Example>

        <UXNote title="Two acceptable treatments, and never a third">
          <p>
            <strong>1 · Omit the section entirely.</strong> Best when the section is not
            the point of the page. A dashboard should not be a museum of things you have
            not done yet — ten empty cards is a far worse first run than four full ones,
            because the user has to read all ten to discover that none of them contains
            anything. Sections that appear as they fill also give a new account a sense of
            progress it would otherwise have to imagine.
          </p>
          <p>
            <strong>2 · Render an EmptyState.</strong> Correct when the absence is itself
            information (&ldquo;you have no API keys&rdquo; is a fact worth knowing), or
            when the empty state is the natural place to offer the action that fills it.
            The rule of thumb: if there is a button that would end the emptiness, this is
            where it belongs.
          </p>
          <p>
            What is never acceptable is the third option — a header, a border, and nothing
            in between.
          </p>
        </UXNote>
      </DocSection>

      <DocSection
        title="EmptyState"
        description="Glyph, one-line promise, and at most one action."
      >
        <Example label="md — with an action" stack>
          <EmptyState
            icon={<ImageIcon strokeWidth={1.75} />}
            title="Your generated images will appear here"
            description="Every render is kept with its prompt, seed and cost, so you can reproduce or fork it later."
            actionLabel="Open the composer"
            footnote="⌘K then “generate” gets you there from anywhere"
          />
        </Example>

        <Example label="framed — a drop target or a placeholder slot" stack>
          <EmptyState
            framed
            icon={<Webhook strokeWidth={1.75} />}
            title="No endpoints configured"
            description="Add an endpoint and every run in this project will post its result to it."
            action={
              <Link href="/docs" className={buttonVariants({ variant: "primary", size: "md" })}>
                Add an endpoint
              </Link>
            }
          />
        </Example>

        <Example label="sm inside a card · lg for a whole route" stack>
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>API keys</CardTitle>
              </CardHeader>
              <CardBody>
                <EmptyState
                  size="sm"
                  icon={<KeyRound strokeWidth={1.75} />}
                  title="No keys yet"
                  description="Your first key will be shown once, at creation."
                  actionLabel="Create a key"
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <EmptyState
                  size="sm"
                  showIcon={false}
                  title="Nothing matched “kling”"
                  description="Clearing the model filter will bring back 248 runs."
                />
              </CardBody>
            </Card>
          </div>
        </Example>

        <SpecTable
          columns={["Prop", "Values", "Default", "Notes"]}
          rows={[
            ["title", "node", "required", "sm 14px · md 16px · lg 20px, 600, at ink. Renders an h3 by default."],
            ["description", "node", "—", "ONE sentence, 14px at ink-secondary."],
            ["icon", "node (a lucide element)", "Inbox", "Sits in a rounded-xl sunken container with a shadow-xs ring, at ink-muted."],
            ["showIcon", "boolean", "true", "false for very tight placements — a card body, a rail."],
            ["actionLabel / onAction", "node / handler", "—", "Renders a primary Button. Omit both for a mute state."],
            ["action", "node", "—", "Escape hatch for a fully custom action row: a Link styled with buttonVariants, two buttons, a menu. Takes precedence over actionLabel."],
            ["footnote", "node", "—", "11px at ink-muted under the action. A docs hint, a keyboard shortcut."],
            ["size", "sm · md · lg", "md", "sm: max-w-xs, 32/8px padding, 32px glyph. md: max-w-sm, 24/48px, 40px glyph. lg: max-w-md, 24/80px, 48px glyph."],
            ["framed", "boolean", "false", "Dashed line-strong border at 16px radius on a 60% sunken fill. Concentric: one rung below a Card."],
            ["Layout", "centred column, mx-auto, max-width capped", "—", "The width cap is what keeps the one sentence from becoming a 90-character line."],
          ]}
        />

        <UXNote title="Say what WILL be here, not what is missing">
          <p>
            &ldquo;Your generated images will appear here&rdquo; beats &ldquo;No images
            found.&rdquo; The first is a promise that tells the user what this region of
            the interface is for and implies the next step; the second is a dead end that
            reads like a search result page, and on a first run it reads like a fault.
          </p>
          <p>
            Keep it to <strong>one sentence</strong>. Two paragraphs in an empty state is
            a confession that the feature needs explaining — that belongs in docs, or in
            the feature. And keep it to <strong>one action</strong>: the empty state is the
            only context in this kit where a filled <Code>primary</Code> button is correct
            inside a card body, precisely because there is nothing else on screen for it to
            compete with. Put two primaries there and you have re-created the problem the
            emptiness was solving.
          </p>
          <p>
            Three ink levels again: title at <Code>ink</Code>, body at{" "}
            <Code>ink-secondary</Code>, footnote at <Code>ink-muted</Code>. Flatten the
            title and body into one grey and the block loses the only reading order it has.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>No giant illustration.</strong> The glyph is a small container with a
            hairline, at <Code>ink-muted</Code>. Its job is to mark the spot the content
            will appear in without pretending to be content. A large friendly drawing of a
            person holding a box does the opposite — it becomes the most visually
            interesting thing on the page, and the page is empty.
          </p>
          <p>
            <strong>And do not use an empty state to apologise.</strong> &ldquo;Oops,
            nothing here yet!&rdquo; makes an ordinary condition sound like a fault. An
            account with no data is not a problem; it is a Tuesday.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="ErrorState"
        description="Something failed, and here is the way out. Both ways out are required by the type."
      >
        <Example label="The default panel — surface, md" stack>
          <ErrorStateDemo />
        </Example>

        <Example label="sm and the opt-in tint, with a specific glyph" stack>
          <ErrorStateSizesDemo />
        </Example>

        <Example label="surface=plain — inside a card that already provides the surface" stack>
          <Card className="w-full">
            <CardHeader>
              <CardTitle meta="Last 24 hours">Model usage</CardTitle>
            </CardHeader>
            <CardBody>
              <ErrorStateInCardDemo />
            </CardBody>
          </Card>
        </Example>

        <SpecTable
          columns={["Prop", "Values", "Default", "Notes"]}
          rows={[
            ["title", "node", "required", "Short and specific: \"Generation failed\", not \"Error\". 14px/600 at ink."],
            ["message", "node", "required", "One or two sentences of honest explanation. 13px at ink-secondary."],
            ["detail", "node", "—", "Machine detail: request id, status code, region. Mono 11px at ink-tertiary, in its own overflow-x-auto line."],
            ["onRetry", "MouseEventHandler", "REQUIRED", "Primary recovery. Renders a primary Button with a RefreshCw start icon."],
            ["retryLabel", "node", "\"Try again\"", "Override when \"retry\" is the wrong verb — \"Redeliver\", \"Reconnect\"."],
            ["onSecondary", "MouseEventHandler", "REQUIRED", "Second way out. Renders a ghost Button."],
            ["secondaryLabel", "node", "\"Edit and resend\"", "Name the actual escape: \"Change window\", \"Pick another model\", \"Go back\"."],
            ["icon", "node", "TriangleAlert", "Swap for a more specific glyph — WifiOff for offline, Gauge for a rate limit."],
            ["size", "sm · md · lg", "md", "sm: 8px radius, 12/16px padding, 13px text. md: 16px radius, 20px padding, 24px left. lg: 18px radius, 24px padding, 28px left."],
            ["surface", "surface · plain · tint", "surface", "surface: bg-surface + shadow-sm. plain: transparent, for use inside a card. tint: --color-danger-soft at 8%."],
            ["Rail", "4px, before:, inset-y-0 left-0, bg-danger", "—", "A ::before pseudo-element rather than border-l, so it reads as a deliberate accent and not a box edge implying borders on all four sides."],
            ["Semantics", "role=\"alert\"", "—", "Announced when it appears, without stealing focus."],
          ]}
        />

        <UXNote title="Why both callbacks are required props">
          <p>
            <strong>Design the recovery path before the happy path.</strong> The happy path
            is the case where the interface barely matters — everything worked, and the
            user is looking at their result. The failure is where they are stuck, mildly
            tense, and forming a judgement about whether this product is reliable. If you
            cannot name the two ways out of a state, that state is not designed yet, no
            matter how good the success case looks.
          </p>
          <p>
            <strong>Retry alone is not a recovery path.</strong> It is the right primary,
            because failures are often transient and retrying is free. But when the request
            itself is the problem — a prompt the model refuses, a resolution above the
            timeout, a webhook URL that does not exist — retrying an identical bad request
            forever is not recovery, it is a loop. A user with one &ldquo;Try again&rdquo;
            button and a broken input has no move left, and their only remaining option is
            to leave.
          </p>
          <p>
            So <Code>onRetry</Code> and <Code>onSecondary</Code> are both required, and{" "}
            <strong>the API cannot express a dead end.</strong> That is the point of making
            it a type error rather than a guideline: guidelines are skipped at 5pm on a
            Friday, and a required prop is not. The secondary defaults to &ldquo;Edit and
            resend&rdquo; — override the label, but never look for a way to remove the
            button. If you genuinely cannot think of a second action, the honest one is
            &ldquo;Go back&rdquo;.
          </p>
        </UXNote>

        <UXNote title="Honest and specific, with the machine part separated out">
          <p>
            &ldquo;Something went wrong&rdquo; tells the user nothing and quietly admits
            that nobody instrumented this path. &ldquo;The model timed out after
            30s&rdquo; tells them whether to retry, wait, or change the request — which is
            the only decision they are actually trying to make.
          </p>
          <p>
            The machine-readable half goes in <Code>detail</Code>, in mono at{" "}
            <Code>ink-tertiary</Code>. It is there so it can be screenshotted into a
            support thread without dominating the message, and it gets its own{" "}
            <Code>overflow-x-auto</Code> line so a long request id or stack frame cannot
            widen the panel or push the page sideways.
          </p>
          <p>
            The triangle is the same silhouette <Code>StatusMark</Code> uses for{" "}
            <Code>error</Code>, so &ldquo;failed&rdquo; looks the same whether it is 12px
            in a table row or a full panel here. Shape, not just colour — it survives
            greyscale and colour-vision deficiency both.
          </p>
        </UXNote>

        <DontNote>
          <p>
            <strong>Never a full red wash.</strong> Danger appears as a 4px left-edge rail
            and the icon, on an otherwise normal surface. A red-filled panel does three
            bad things at once: it drops text contrast, it makes every error feel
            catastrophic so a real catastrophe has nowhere left to escalate to, and it
            turns a recoverable hiccup into an alarm — which trains the user to dismiss
            alarms. The rail is unmistakable at a glance and still comfortable to read for
            as long as it takes to understand it. The <Code>tint</Code> variant is{" "}
            <Code>--color-danger-soft</Code> at 8% — a whisper, and it is opt-in, for the
            case where the error must be findable in a long page.
          </p>
          <p>
            <strong>And do not put an ErrorState behind a toast.</strong> A failure the
            user has to act on must persist in the place the thing failed. A toast that
            has already faded is a failure with no recovery path, which is the exact
            problem this component&apos;s required props exist to prevent.
          </p>
        </DontNote>
      </DocSection>

      <DocSection
        title="A user-initiated stop is not an error"
        description="The most commonly mis-styled state in any product with long-running jobs."
      >
        <Example label="Right — neutral, because nothing went wrong" stack>
          <EmptyState
            framed
            size="sm"
            icon={<CircleStop strokeWidth={1.75} />}
            title="Stopped at 31%"
            description="You stopped this generation. Partial output is kept and you were only billed for the frames rendered."
            action={
              <Link href="/docs" className={buttonVariants({ variant: "secondary", size: "sm" })}>
                Resume from here
              </Link>
            }
            footnote="Stopped 2m ago · 12 of 40 frames"
          />
        </Example>

        <UXNote title="Whose fault it was decides which component you reach for">
          <p>
            When a user presses stop, the system did exactly what it was told. Rendering
            that with a danger rail, a triangle and a &ldquo;Try again&rdquo; button
            reframes their own decision as a fault, and it puts a red mark in a run history
            that is otherwise a reliability signal — which makes the history useless,
            because it now mixes &ldquo;we broke&rdquo; with &ldquo;you changed your
            mind&rdquo;.
          </p>
          <p>
            So a cancellation gets neutral chrome: <Code>ink-muted</Code> glyph, no
            semantic colour, and an action phrased as continuation rather than repair
            (&ldquo;Resume&rdquo;, &ldquo;Start again&rdquo; — not &ldquo;Retry&rdquo;). It
            should also say what was kept and what it cost, because the question in the
            user&apos;s head after stopping something is &ldquo;did I just waste
            that?&rdquo;. <Code>EmptyState</Code> with{" "}
            <Code>framed</Code> and a stop glyph carries this well; the deciding question
            is not &ldquo;did the job finish?&rdquo; but{" "}
            <strong>&ldquo;does the user need to fix something?&rdquo;</strong>
          </p>
          <p>
            The same test sorts the neighbouring cases. A filter matching nothing is not an
            error either — the query worked, the answer is zero — so it gets an{" "}
            <Code>EmptyState</Code> that names the filter to clear. A permission denial{" "}
            <em>is</em> an <Code>ErrorState</Code>, because the user is blocked and needs a
            route out, but its two actions are &ldquo;Request access&rdquo; and &ldquo;Go
            back&rdquo;, not &ldquo;Try again&rdquo;.
          </p>
        </UXNote>

        <SpecTable
          columns={["Situation", "Component", "Danger colour?", "The two actions"]}
          rows={[
            ["Nothing here yet (first run)", "EmptyState", "No", "One action, or none"],
            ["Filter or search matched nothing", "EmptyState", "No", "Clear the filter"],
            ["User stopped the job", "EmptyState, framed, stop glyph", "No", "Resume · Start again"],
            ["Request failed, probably transient", "ErrorState", "Rail + icon", "Try again · Edit and resend"],
            ["Request failed because the input is wrong", "ErrorState", "Rail + icon", "Try again · Edit the input (the secondary is the real fix)"],
            ["Blocked by permissions or quota", "ErrorState", "Rail + icon", "Request access · Go back"],
            ["Offline", "ErrorState, WifiOff glyph", "Rail + icon", "Retry now · Work offline"],
          ]}
        />

        <DontNote>
          <p>
            <strong>Do not reach for a bespoke &ldquo;cancelled&rdquo; component.</strong>{" "}
            Two components cover every case above, and the whole reason the table can be
            this short is that the decision is about tone and copy rather than markup.
            Adding a third state container is how a system starts having four ways to say
            &ldquo;nothing here&rdquo;, each slightly different, none of them learnable.
          </p>
        </DontNote>
      </DocSection>
    </>
  );
}
