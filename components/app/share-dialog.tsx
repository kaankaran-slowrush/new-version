"use client";

import * as React from "react";
import { Globe, Lock, TriangleAlert, Users } from "lucide-react";
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Pill,
} from "@/components/primitives";
import { CopyField } from "@/components/patterns";
import type { Visibility } from "@/lib/mock/sessions";
import { cn } from "@/lib/cn";

/* =============================================================================
   ShareDialog
   =============================================================================
   UX NOTES
   --------
   • THREE LEVELS, ESCALATING. Private → Workspace → Public link. Each step widens
     the audience, and the options are ordered that way so the direction of risk
     is legible without reading.

   • PUBLIC GETS AN EXPLICIT WARNING, not a silent toggle. In a B2B tool a session
     contains prompts and generated media that may be client-confidential; making
     that reachable by anyone with a URL deserves a sentence saying so. Expiry is
     offered in the same breath, because "forever" is rarely what someone means.

   • PERMISSION IS A SEPARATE QUESTION FROM AUDIENCE. "Who can see this" and "can
     they keep working in it" are independent, so the permission choice only
     appears once sharing is on — asking it up front would be noise for the
     default private case.

   • THE STATE IS VISIBLE OUTSIDE THIS DIALOG. A badge in the session header shows
     the current visibility at all times. Something with this much consequence
     should never require reopening a modal to check.
   ============================================================================= */

const LEVELS: {
  value: Visibility;
  label: string;
  hint: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "private",
    label: "Private",
    hint: "Only you can open this session",
    icon: <Lock />,
  },
  {
    value: "workspace",
    label: "Workspace",
    hint: "Anyone in Default Workspace can open it",
    icon: <Users />,
  },
  {
    value: "public",
    label: "Public link",
    hint: "Anyone with the link can open it",
    icon: <Globe />,
  },
];

export function ShareDialog({
  trigger,
  visibility,
  onVisibilityChange,
}: {
  trigger: React.ReactNode;
  visibility: Visibility;
  onVisibilityChange: (v: Visibility) => void;
}) {
  const [draft, setDraft] = React.useState<Visibility>(visibility);

  /* Local draft so closing without confirming does not silently widen access —
     an accidental click on "Public" should be recoverable by pressing Escape. */
  React.useEffect(() => setDraft(visibility), [visibility]);

  return (
    <DialogRoot>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent size="md">
        <DialogTitle>Share session</DialogTitle>
        <DialogDescription>
          Choose who can open this session and what they can do with it.
        </DialogDescription>

        <div className="mt-5 space-y-2">
          {LEVELS.map((level) => {
            const active = draft === level.value;
            return (
              <label
                key={level.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors duration-(--duration-fast)",
                  active
                    ? "border-accent/35 bg-accent-soft"
                    : "border-line hover:bg-surface-hover",
                )}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={level.value}
                  checked={active}
                  onChange={() => setDraft(level.value)}
                  className="mt-1 accent-[var(--color-accent)]"
                />
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-lg [&_svg]:size-4",
                    active ? "bg-surface text-accent-ink" : "bg-surface-sunken text-ink-secondary",
                  )}
                >
                  {level.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">{level.label}</span>
                  <span className="block text-sm text-ink-tertiary">{level.hint}</span>
                </span>
              </label>
            );
          })}
        </div>

        {/* Permission only becomes a question once it is shared at all. */}
        {draft !== "private" && (
          <div className="anim-fade-in mt-4 rounded-xl bg-surface-sunken p-3.5">
            <p className="mb-2 eyebrow text-ink-tertiary">
              Permission
            </p>
            <div className="flex gap-2">
              <Pill size="sm" variant="active">View only</Pill>
              <Pill size="sm">Can continue the session</Pill>
            </div>
          </div>
        )}

        {draft === "public" && (
          <div className="anim-fade-in mt-3 rounded-xl bg-surface-sunken p-3.5">
            <p className="mb-2 eyebrow text-ink-tertiary">
              Share link
            </p>
            <CopyField value="model.store/s/cup-shot-8f2a" label="Public session link" />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-ink-tertiary">Expires:</span>
              <Pill size="sm">Never</Pill>
              <Pill size="sm" variant="active">7 days</Pill>
              <Pill size="sm">30 days</Pill>
            </div>
            <p className="mt-3 flex items-start gap-2 text-sm text-warning">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
              Anyone with this link can see the prompts and generated media in this
              session.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="primary" onClick={() => onVisibilityChange(draft)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
