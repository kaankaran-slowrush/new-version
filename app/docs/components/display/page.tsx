import { Check, Lock } from "lucide-react";
import {
  Avatar,
  Badge,
  Pill,
  Separator,
  Skeleton,
  SkeletonText,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "@/components/primitives";
import {
  Code,
  DocHeader,
  DocSection,
  DontNote,
  Example,
  SpecTable,
  UXNote,
} from "@/components/docs/doc-kit";

export const metadata = { title: "Navigation & display" };

export default function DisplayDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Primitives"
        title="Navigation & display"
        lede="Avatar, Badge, Pill, Separator, Skeleton and Tabs. Small components, but two of them encode distinctions worth arguing about."
      />

      <DocSection
        title="Badge vs Pill — the distinction that matters"
        description="They look similar and behave completely differently. Getting this wrong produces an interface where users cannot tell what is clickable."
      >
        <Example label="Badge — never interactive">
          <Badge variant="neutral">Template</Badge>
          <Badge variant="accent">Workspace</Badge>
          <Badge variant="success">
            <Check />
            Active
          </Badge>
          <Badge variant="warning">
            <Lock />
            Public
          </Badge>
          <Badge variant="danger">Deprecated</Badge>
          <Badge variant="outline">Outline</Badge>
        </Example>

        <Example label="Pill — always interactive">
          <Pill>Default</Pill>
          <Pill variant="active">Active</Pill>
          <Pill variant="outline">Outline</Pill>
          <Pill variant="readout">Est. $0.32</Pill>
          <Pill startIcon={<Check />}>With icon</Pill>
        </Example>

        <UXNote>
          <p>
            <strong>Badge carries state or category. Pill is a control.</strong> A capsule
            shape reads as either &ldquo;tag&rdquo; or &ldquo;button&rdquo; and the only
            thing disambiguating them for a user is whether hovering does something — so
            making a Badge clickable, or styling a filter as a Badge, breaks the one signal
            they have.
          </p>
          <p>
            <Code>Pill variant=&quot;readout&quot;</Code> is the deliberate exception: a
            transparent, non-interactive pill for a value that lives inside a control row
            (the cost estimate in the composer). It is disabled for semantics but does{" "}
            <em>not</em> render faded, because it is information rather than an unavailable
            action.
          </p>
        </UXNote>

        <DontNote>
          <p>
            Semantic badges use the <em>soft</em> tints, not solid fills. A table where
            every row carries a solid coloured badge becomes a traffic light and the scan
            is destroyed. And for status specifically, prefer{" "}
            <Code>StatusMark</Code> — it pairs colour with shape.
          </p>
          <p>
            The <Code>active</Code> Pill state is a real variant, not an inline style. In
            the prototype this kit was extracted from, &ldquo;active&rdquo; existed only as
            a hardcoded inline background on one element — which meant the state could not
            be themed, reused, or restyled. <strong>If a state exists, it belongs in the
            variant map.</strong>
          </p>
        </DontNote>
      </DocSection>

      <DocSection title="Avatar">
        <Example label="Sizes and shapes">
          <Avatar name="Kaan Karan" size="xs" />
          <Avatar name="Kaan Karan" size="sm" />
          <Avatar name="Kaan Karan" size="md" />
          <Avatar name="Kaan Karan" size="lg" />
          <Avatar name="Default Workspace" initials="D" shape="square" tone="solid" />
          <Avatar name="Studio Agent" initials="S" shape="square" />
          <Avatar name="Kaan Karan" tone="ink" />
          <Avatar name="Someone Else" tone="muted" />
        </Example>

        <UXNote title="Circle means person, square means thing">
          <p>
            <Code>shape=&quot;square&quot;</Code> is for non-human subjects — agents,
            models, workspaces. Held consistently, it lets a user tell what kind of entity
            a row is about before reading a word of it. Break it and the signal is gone
            everywhere, not just in the one place you broke it.
          </p>
          <p>
            Initials are the fallback, and in a B2B tool the fallback <em>is</em> the
            common case — most accounts never upload a photo — so it should look
            deliberate rather than like a missing image. The fill is accent-tinted rather
            than hashed per user: hashing names to colours produces a confetti member list
            and accidental contrast failures.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Tabs">
        <Example label="Live — arrow keys move between tabs" stack>
          <TabsRoot defaultValue="one" className="w-full">
            <TabsList className="mb-4">
              <TabsTab value="one">Transactions</TabsTab>
              <TabsTab value="two">Payment methods</TabsTab>
              <TabsTab value="three">Billing address</TabsTab>
            </TabsList>
            <TabsPanel value="one">
              <p className="text-sm text-ink-secondary">
                Panels swap the whole content region. That is what separates Tabs from a
                SegmentedControl.
              </p>
            </TabsPanel>
            <TabsPanel value="two">
              <p className="text-sm text-ink-secondary">Second panel.</p>
            </TabsPanel>
            <TabsPanel value="three">
              <p className="text-sm text-ink-secondary">Third panel.</p>
            </TabsPanel>
          </TabsRoot>
        </Example>

        <UXNote>
          <p>
            Use Tabs when the region below changes wholesale; use{" "}
            <Code>SegmentedControl</Code> when you are switching the <em>mode</em> of
            something that stays on screen. The billing page is the clean example: those
            three views are genuinely different content, so they are Tabs — even though
            the control looks segmented.
          </p>
          <p>
            Getting this right is not cosmetic. Tabs carry{" "}
            <Code>role=&quot;tablist&quot;</Code> and proper panel association, so a screen
            reader announces &ldquo;tab 2 of 3&rdquo; and arrow keys work. A row of buttons
            that merely looks like tabs announces nothing.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Skeleton">
        <Example label="Match the shape of what replaces it" stack>
          <div className="w-full max-w-sm space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton radius="full" className="size-9" />
              <div className="flex-1">
                <Skeleton radius="xs" className="mb-1.5 h-3.5 w-32" />
                <Skeleton radius="xs" className="h-3 w-20" />
              </div>
            </div>
            <Skeleton radius="2xl" className="h-32" />
            <SkeletonText lines={3} />
          </div>
        </Example>
        <UXNote>
          <p>
            A skeleton must match the size and radius of the real element, or the page
            reflows the moment data lands — which is worse than a brief blank, because the
            user has already started reading and moving their cursor.
          </p>
          <p>
            Use them only where the layout is predictable (a known list, a known card). For
            unpredictable content an honest progress state is better than a lie about the
            shape. Each block is <Code>aria-hidden</Code>; announce the loading state once
            on the container with <Code>aria-busy</Code>, not thirty times.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Separator">
        <Example label="Horizontal and soft" stack>
          <div className="w-full max-w-sm space-y-3">
            <Separator />
            <Separator soft />
          </div>
        </Example>
        <DontNote>
          <p>
            Reach for whitespace and a tonal shift <em>before</em> a line. The most
            premium-feeling interfaces are mostly invisible structure; a rule on every
            boundary turns a layout into a spreadsheet. Legitimate uses: separating
            semantically different groups inside one menu, and dividing dense table rows
            where whitespace would cost too much height.
          </p>
        </DontNote>
      </DocSection>
    </>
  );
}
