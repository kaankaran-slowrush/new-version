import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
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

export const metadata = { title: "Overlays" };

export default function OverlaysDocs() {
  return (
    <>
      <DocHeader
        eyebrow="Primitives"
        title="Overlays"
        lede="Dialog, DropdownMenu, Popover, Tooltip. All built on Base UI, so focus management, keyboard handling and collision detection come for free — the styling and the judgment are what this kit adds."
      />

      <DocSection
        title="Overlays are opaque. Always."
        description="This is the one rule that separates them from the rest of the surface system."
      >
        <UXNote>
          <p>
            The topbar, the session rails and the composer are glass. Overlays are{" "}
            <strong>not</strong> — they are solid <Code>bg-surface</Code> with{" "}
            <Code>shadow-md</Code>.
          </p>
          <p>
            The reason is that glass only works when you control the backdrop. A dropdown
            appears over whatever happens to be underneath: a dense table, an image, a
            wall of text. Blurring that does not make it readable, it makes it noisy — and
            a menu is a list of small text labels, the content least able to survive a
            busy background. Glass is for surfaces that are <em>always there</em>; opaque
            is for surfaces that appear over unpredictable content.
          </p>
        </UXNote>
      </DocSection>

      <DocSection title="Dialog">
        <Example label="Live — Escape closes, focus returns to the trigger">
          <DialogRoot>
            <DialogTrigger render={<Button variant="secondary">Open dialog</Button>} />
            <DialogContent size="md">
              <DialogTitle>Rotate signing secret</DialogTitle>
              <DialogDescription>
                The current secret stops working immediately. Update your receivers before
                rotating, or deliveries will fail verification.
              </DialogDescription>
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button variant="danger">Rotate secret</Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Example>

        <SpecTable
          columns={["Detail", "Value"]}
          rows={[
            ["Radius", "rounded-3xl (20px) — the largest in the scale"],
            ["Backdrop", "ink at ~35% with a 2px blur"],
            ["Sizes", "sm / md / lg"],
            ["Entry", "Centred, scaling from 0.95 — modals are the one overlay that does NOT scale from its trigger"],
            ["Focus", "Trapped while open, returned to the trigger on close (Base UI)"],
          ]}
        />

        <UXNote title="Writing a dialog">
          <p>
            The title states the action, not the topic — &ldquo;Rotate signing
            secret&rdquo;, not &ldquo;Secret&rdquo;. The description says what will
            actually happen, in the order it happens, including the consequence. And the
            confirm button repeats the verb: a dialog whose buttons say{" "}
            <em>OK / Cancel</em> forces the user to re-read the whole thing to work out
            what OK agrees to.
          </p>
        </UXNote>
        <DontNote>
          <p>
            Do not use a dialog to change one value. A modal is an interruption, and
            interrupting someone to edit a single number (the billing threshold was
            originally behind one) costs more attention than the edit is worth. Prefer
            inline editing or a popover.
          </p>
        </DontNote>
      </DocSection>

      <DocSection title="DropdownMenu">
        <Example label="Standard menu">
          <DropdownMenuRoot>
            <DropdownMenuTrigger
              render={<Button variant="secondary">Session options</Button>}
            />
            <DropdownMenuContent>
              <DropdownMenuLabel>Session</DropdownMenuLabel>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Export all artifacts</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Delete session</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuRoot>
        </Example>

        <Example label="Mega variant — icon, title, one line of description">
          <DropdownMenuRoot>
            <DropdownMenuTrigger render={<Button variant="ghost">Platform ▾</Button>} />
            <DropdownMenuContent variant="mega">
              <DropdownMenuItem>Run history</DropdownMenuItem>
              <DropdownMenuItem>API keys</DropdownMenuItem>
              <DropdownMenuItem>Webhooks</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuRoot>
        </Example>

        <UXNote title="Descriptions earn their space in navigation, not in actions">
          <p>
            The <Code>mega</Code> variant exists for the topbar, where an item is a{" "}
            <em>destination</em> and a one-liner genuinely helps someone decide whether
            &ldquo;Webhooks&rdquo; is where they want to go. In an action menu the same
            treatment is padding: &ldquo;Delete — deletes this session&rdquo; teaches
            nobody anything.
          </p>
          <p>
            If a description needs two lines, the destination needs a better name.
          </p>
        </UXNote>

        <SpecTable
          columns={["Detail", "Value"]}
          rows={[
            ["Menu radius / item radius", "rounded-2xl (18px) / rounded-sm (8px) — concentric with the 0.6rem padding"],
            ["Item", "13px, text-ink-secondary, hover bg-surface-hover + text-ink"],
            ["Destructive item", "hover bg-danger-soft + text-danger"],
            ["Alignment", "align defaults to 'start' so the menu's left edge lines up with the trigger's"],
            ["Origin", "Scales from the trigger side via Base UI's data-side attributes"],
            ["Mega icon tile", "38px, bg-accent-soft, text-accent-ink"],
          ]}
        />
      </DocSection>

      <DocSection title="Popover">
        <Example label="Live">
          <PopoverRoot>
            <PopoverTrigger render={<Button variant="ghost">Why is this disabled?</Button>} />
            <PopoverContent className="max-w-72">
              <p className="text-sm text-ink-secondary">
                This generation costs more than your remaining balance. Add funds, or pick
                a cheaper model.
              </p>
            </PopoverContent>
          </PopoverRoot>
        </Example>
        <SpecTable
          columns={["Popover", "Tooltip"]}
          rows={[
            ["Click to open", "Hover/focus to open"],
            ["Can contain interactive elements", "Text only — never a link or button"],
            ["Can be long", "One short phrase"],
            ["Keyboard: Enter/Space, Escape to close", "Appears on focus, no dismissal needed"],
          ]}
        />
        <DontNote>
          <p>
            Never put an action inside a tooltip. It vanishes when the pointer leaves, so
            reaching for the thing inside it dismisses it — and keyboard and touch users
            cannot reach it at all. If it needs a control, it is a Popover.
          </p>
          <p>
            And never hide essential information in either. Both are progressive
            disclosure for <em>helpful</em> detail; anything required to complete the task
            belongs on the page.
          </p>
        </DontNote>
      </DocSection>

      <DocSection title="Timing">
        <SpecTable
          columns={["Overlay", "Duration", "Why"]}
          rows={[
            ["Tooltip", "~125–200ms", "Should feel like it was already there."],
            ["Menu / Popover", "~160ms (--duration-fast)", "Frequent, so speed beats elegance."],
            ["Dialog / Drawer", "~220–320ms", "Occasional and a bigger context shift, so it can afford to be seen."],
          ]}
        />
        <p className="text-ink-secondary">
          Everything entering uses <Code>--ease-out-quint</Code>. Exits are faster and
          subtler than entrances: leaving should not make the user wait to get back to
          work. And nothing animates from <Code>scale(0)</Code> — start at{" "}
          <Code>0.95</Code>, because nothing appears from nothing.
        </p>
      </DocSection>
    </>
  );
}
