import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   FirstRun — the first time you land on a route that has nothing in it yet.
   =============================================================================

   THIS IS NOT AN EMPTY STATE, and conflating the two is the mistake it exists to
   fix. Three different conditions all render "there is nothing here", and they
   want three different answers:

     1. NEVER HAD ANY          → FirstRun. The user has nothing because they have
                                 not started. This is onboarding: the one moment
                                 the product has their whole attention and nothing
                                 competing for it. Teach, then offer one way in.
     2. FILTER EXCLUDED ALL    → EmptyState with a RECOVERY action. There is data;
                                 the query is the problem. "No models match
                                 'xyz'" + Clear filters. Teaching here is insulting
                                 — they already know what the page is.
     3. HAD SOME, NOW ZERO     → EmptyState. They deleted the last webhook; they
                                 know what a webhook is. Offer the action, skip the
                                 lesson.

   Getting 1 and 2 backwards is the common failure: a search that returns nothing
   showing a tutorial, or a brand-new account being told "no results found".

   ---------------------------------------------------------------------------
   PREFER SHOWING THE FILLED PAGE OVER EXPLAINING IT.

   The home page already settled this and its comment says it plainly: the
   blank-page problem is the actual obstacle on a generative product, and the fix
   is a filled page rather than instructions about how to fill one. On a first
   visit it renders four starter prompts where the artifact rail would be — no
   onboarding copy at all, because a prompt you can click beats a paragraph about
   prompting.

   So reach for this component only when there is genuinely nothing to show:
     • /platform/run-history — no runs, and a fake run would be a lie
     • /platform/api-keys — a sample key is not clickable
     • /platform/webhooks — same
   And do NOT reach for it where the page already carries the thing that fills it.
   /agents has two agent cards above the session list and /workflows has a
   template grid below it; there, a short EmptyState pointing UP at what is
   already on screen beats a second block competing with it.

   ---------------------------------------------------------------------------
   THE STEPS ARE NUMBERED BECAUSE THEY ARE ORDERED. That is the only thing that
   licenses numbering — you cannot copy a key before you create one. Numbering an
   unordered list of features is decoration pretending to be information, and it
   is the tell of a template. If your three items could be read in any order, they
   are not steps and this prop is the wrong home for them.

   TWO OR THREE STEPS, never four. A fourth is the signal that the flow itself is
   too long, and the fix belongs in the flow rather than in the explanation of it.

   ONE PRIMARY ACTION. The whole argument for this component is that nothing else
   is on screen, which is squandered by offering two equal ways forward. The
   secondary slot is for documentation — a way OUT, not a second way in.
   ============================================================================= */

const rootVariants = cva(
  [
    "panel-edge relative overflow-hidden rounded-2xl bg-surface shadow-sm",
    /* The glyph well and the step rail both read against a fill, so the block
       needs to be a surface rather than sitting bare on the canvas. */
  ],
  {
    variants: {
      size: {
        /* Inside a section that has other content — a card-sized invitation. */
        md: "p-6",
        /* The route has nothing else on it. Earns the room. */
        lg: "p-8 lg:p-10",
      },
    },
    defaultVariants: { size: "lg" },
  },
);

export interface FirstRunStep {
  /** Imperative and short: "Create a key", not "Key creation". */
  title: React.ReactNode;
  /** One clause. What actually happens, or the one thing they need to know. */
  body?: React.ReactNode;
}

export interface FirstRunProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children" | "title">,
    VariantProps<typeof rootVariants> {
  /** A lucide glyph. Match the route's nav icon so the page identifies itself. */
  icon?: React.ReactNode;
  /**
   * A promise, not an absence. "Create your first API key" — never "No API keys".
   * The negative framing is what makes a first run feel like a dead end.
   */
  title: React.ReactNode;
  /** ONE sentence saying what this page is for. */
  description?: React.ReactNode;
  /** Two or three ORDERED steps. See the header note before adding a fourth. */
  steps?: FirstRunStep[];
  /** Exactly one primary action. */
  action?: React.ReactNode;
  /** A way out — docs, a guide. Never a second way in. */
  secondary?: React.ReactNode;
}

export const FirstRun = React.forwardRef<HTMLDivElement, FirstRunProps>(
  function FirstRun(
    { className, size, icon, title, description, steps, action, secondary, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(rootVariants({ size }), className)}
        {...props}
      >
        <div className="max-w-measure">
          {icon ? (
            <span
              aria-hidden
              className="mb-4 grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-ink shadow-xs [&_svg]:size-5"
            >
              {icon}
            </span>
          ) : null}

          {/* h2, because a first run replaces a section of the page rather than
              titling the page — the route's own h1 is still above it. */}
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
              {description}
            </p>
          ) : null}
        </div>

        {steps && steps.length > 0 ? (
          /* An <ol>, not a styled div stack: the order is the content, so it has
             to survive being read by something that is not a browser. */
          <ol className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  aria-hidden
                  className="tabular mt-px shrink-0 font-mono text-xs text-ink-tertiary"
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">
                    {step.title}
                  </span>
                  {step.body ? (
                    <span className="mt-0.5 block text-sm leading-relaxed text-ink-tertiary">
                      {step.body}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        {action || secondary ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {action}
            {secondary}
          </div>
        ) : null}
      </div>
    );
  },
);
