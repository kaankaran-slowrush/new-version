"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, MoreHorizontal, Share2 } from "lucide-react";
import {
  MODALITY_ICON,
  MODALITY_LABEL,
  VISIBILITY_ICON,
  VISIBILITY_LABEL,
  VISIBILITY_TONE,
} from "@/lib/icons";
import { Icon } from "@/components/primitives/icon";
import {
  Badge,
  Button,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives";
import { Composer } from "./composer";
import { SessionCanvas } from "./session-canvas";
import { MediaRail, TimelineRail } from "./session-rails";
import { ShareDialog } from "./share-dialog";
import { MODALITIES } from "@/lib/icons";
import type { Agent } from "@/lib/mock/agents";
import type { SessionSummary, Turn, Visibility } from "@/lib/mock/sessions";

/* =============================================================================
   SessionWorkspace — the three-zone shell
   =============================================================================
   Left: navigational timeline. Center: the active turn at working size.
   Bottom: the composer. Right: an optional media strip.

   UX NOTES
   --------
   • WHY THIS IS NOT A CHAT LAYOUT. Talking, generating, and then viewing/editing
     the result all happen here, and the result is the point. In a transcript the
     artifact scrolls away the moment you reply to it; here it holds the center and
     history is one click along the rail.

   • THE HEADER IS OPAQUE ON PURPOSE. Everything else floating in this view is
     glass (rails, composer). The header is the fixed orientation anchor — where
     you are, what agent, who can see it, how to get out. The contrast between a
     stable header and floating panels is what makes the layering legible; if
     everything floats, nothing reads as elevated.

   • TWO EXITS, MATCHED TO FREQUENCY. "← Sessions" on the rail (frequent, back to
     the hub) and the wordmark in the header (occasional, all the way home). This
     is a focus mode, so the full topbar is deliberately absent — but a focus mode
     with no way out is a trap.

   • Visibility is a persistent badge, not something you reopen a dialog to check.
   ============================================================================= */

/* =============================================================================
   EmptySession — what the canvas shows before the first turn exists
   =============================================================================
   NOT an EmptyState. The generic pattern is built for a list that could have had
   rows and does not — "no results", "nothing here yet" — and its whole shape is an
   apology. A brand-new session has nothing wrong with it; it is simply at the
   beginning, and the composer directly below is already the call to action. A
   centred illustration with a button would compete with the control the user is
   about to type into.

   So this states the agent's capabilities and gets out of the way. Capability
   transparency is the kit's standing rule for agent surfaces — a limit should be
   read, never discovered by hitting it — and the moment before the first prompt is
   exactly when that is worth saying.
   ============================================================================= */
function EmptySession({ agentName }: { agentName: string }) {
  return (
    <div className="anim-fade-in mx-auto flex w-full max-w-(--canvas-max-width) flex-col items-center py-16 text-center">
      <p className="eyebrow mb-3 text-ink-tertiary">New session</p>
      <h2 className="mb-3 text-xl text-ink">What should {agentName} make?</h2>
      <p className="mb-8 max-w-measure-narrow text-sm leading-relaxed text-ink-secondary">
        Describe it in the box below. Chain modalities in one conversation — shoot
        an image, write its caption, voice it, then animate it.
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {MODALITIES.map((m) => (
          <li key={m}>
            <Badge variant="neutral" size="md">
              <Icon of={MODALITY_ICON[m]} />
              {MODALITY_LABEL[m]}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SessionWorkspace({
  session,
  agent,
  turns,
}: {
  session: SessionSummary;
  agent: Agent;
  turns: Turn[];
}) {
  /* Default to the newest turn — on open you want what just happened, not the
     beginning of the session. */
  /* A session with NO turns is not an edge case to defend against — it is the
     first thing every user sees, every time they start something. Both of these
     asserted a turn existed and threw on it. */
  const [activeId, setActiveId] = React.useState(
    turns[turns.length - 1]?.id ?? "",
  );
  const [visibility, setVisibility] = React.useState<Visibility>(session.visibility);
  const [title, setTitle] = React.useState(session.title);

  const activeTurn = turns.find((t) => t.id === activeId) ?? turns[0];
  const inFlight = turns.find((t) => t.state === "generating");
  const VisibilityGlyph = VISIBILITY_ICON[visibility];

  return (
    /* Fixed app shell: the page itself never scrolls — the canvas and rails own
       their own overflow, so the composer stays put. */
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="z-(--z-sticky) flex shrink-0 items-center gap-3 border-b border-line-inner bg-surface px-5 py-3">
        <Link
          href="/"
          title="Back to dashboard"
          className="flex shrink-0 items-center gap-1.5 rounded-md py-1.5 pr-2 pl-0.5 text-ink-secondary transition-colors duration-(--duration-fast) hover:bg-surface-hover hover:text-ink"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden font-mono text-sm whitespace-nowrap sm:inline">
            model<span className="font-semibold text-accent-ink">.store</span>
          </span>
        </Link>

        <span className="h-8 w-px shrink-0 bg-line" />

        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft font-semibold text-accent-ink">
          {agent.monogram}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {/* Editable in place. Titles are auto-derived from the first prompt,
                which is frictionless but often wrong — so fixing it must be
                trivial, not buried in a rename dialog. */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Session title"
              className="min-w-0 flex-1 truncate rounded-sm bg-transparent px-1 py-0.5 font-mono text-base font-semibold text-ink hover:bg-surface-hover focus:bg-surface-hover"
              style={{ maxWidth: "min(34rem, 42vw)" }}
            />
            <Badge variant={VISIBILITY_TONE[visibility]} size="sm" className="shrink-0">
              <Icon of={VisibilityGlyph} />
              {VISIBILITY_LABEL[visibility]}
            </Badge>
          </div>
          <p className="px-1 text-xs text-ink-tertiary">
            {agent.name} · {agent.tagline}
          </p>
          {/* Capability transparency: what this agent can produce, always visible,
              so a limit is never discovered by hitting a failure. */}
          <div className="mt-1 hidden flex-wrap gap-1 px-0.5 md:flex">
            {agent.modalities.map((m) => (
              <Badge key={m} variant="neutral" size="sm">
                <Icon of={MODALITY_ICON[m]} />
                {MODALITY_LABEL[m]}
              </Badge>
            ))}
          </div>
        </div>

        <ShareDialog
          visibility={visibility}
          onVisibilityChange={setVisibility}
          trigger={
            <Button variant="secondary" size="md" startIcon={<Share2 />}>
              Share
            </Button>
          }
        />

        <DropdownMenuRoot>
          <DropdownMenuTrigger
            aria-label="Session options"
            className="grid size-9 shrink-0 place-items-center rounded-md text-ink-secondary transition-colors duration-(--duration-fast) hover:bg-surface-hover hover:text-ink"
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Rename session</DropdownMenuItem>
            <DropdownMenuItem>Export all artifacts</DropdownMenuItem>
            <DropdownMenuItem>Duplicate session</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete session</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </header>

      <div className="relative min-h-0 flex-1">
        <TimelineRail turns={turns} activeId={activeId} onSelect={setActiveId} />
        <MediaRail turns={turns} activeId={activeId} onSelect={setActiveId} />

        <div className="absolute inset-0 z-(--z-base) flex flex-col">
          <div className="flex min-h-0 flex-1 justify-center overflow-y-auto px-6 pt-8 pb-4">
            <div className="w-full max-w-(--canvas-max-width)">
              {activeTurn ? (
                <SessionCanvas turn={activeTurn} />
              ) : (
                <EmptySession agentName={agent.name} />
              )}
            </div>
          </div>

          <Composer
            generating={
              inFlight
                ? { modality: inFlight.modality, etaLabel: inFlight.etaLabel ?? "" }
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}
