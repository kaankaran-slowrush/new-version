import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* =============================================================================
   SectionHeader — the one way this product introduces anything.
   =============================================================================

   A header is a triple: eyebrow → title → support.

   THE RULE WORTH REMEMBERING:
   the serif/sans boundary and the canvas/surface boundary are the same boundary.
   Above it you are naming a PLACE, on the canvas, in the serif. Below it you are
   naming a THING, inside a surface, in the sans.

                  T1 · page          T2 · section       T3 · block
     eyebrow      yes                never              never
     title        serif 34           serif 22           sans 15/600
     support      15px secondary     13px secondary     13px tertiary
     sits on      the canvas         the canvas         inside a surface
     margin       mb-8               mb-5               mb-4

   WHY THIS EXISTS. Before it, "the small line under a heading" had SIXTEEN
   distinct expressions across the repo, section headings shipped at four
   different sizes (text-xl, text-lg, text-md, text-sm font-medium), the same
   structural role was called `subtitle`, `meta`, `description` and `message` in
   five different components, and the de-facto section-header pattern existed
   only as a four-line block copy-pasted four times into the home page. This is
   that block, once.

   ---------------------------------------------------------------------------
   THE TIER IS NOT THE HEADING TAG, and this is the whole reason `as` exists.

   `level` is what the thing LOOKS like. `as` is where it sits in the document
   outline. They agree most of the time and the defaults reflect that — but they
   legitimately disagree, and when they do, both have to be sayable:

     settings/*    the cards ARE the page's sections, so the outline wants h2 —
                   but they read as blocks inside a surface, so the tier is 3.
                   `level={3} as="h2"`.
     auth pages    one lonely form, so the outline wants h1 — but a 34px page
                   title over a 320px card is absurd. `level={2} as="h1"`.

   This is why the face and the weight are written EXPLICITLY on the title rather
   than inherited from the tag. globals.css gives bare tags a sensible default;
   this component overrides it, so `level={3} as="h2"` renders sans and not a
   22px serif. Removing those explicit classes silently re-couples the two.

   ---------------------------------------------------------------------------
   THE EYEBROW IS LEVEL 1 ONLY, and the type system enforces it — passing one at
   level 2 or 3 does not compile. It used to be allowed on sections, and the
   result was the home page opening five consecutive uppercase labels on the way
   down. An eyebrow answers "where am I" BEFORE you read the title; that question
   is already answered by the time you are three sections into a page. Once per
   screen, at the top.

   (`agents/page.tsx` had one BELOW its title, which was the same datum the home
   page rendered as a plain support line — one object, two typographic identities.
   That is the failure this constraint exists to prevent.)

   ---------------------------------------------------------------------------
   TWO SUPPORT ROLES, NOT ONE. `description` is a SENTENCE — prose you have to
   read, capped at a measure. `meta` is a MACHINE STRING — "claude-sonnet-4-6 ·
   eu-west-1", "1024 × 1024 · seed 88214" — which you skim or skip. They look
   different because they are read differently, and ModelCard carries both at
   once. Collapsing them into one prop would be the wrong unification.

   ---------------------------------------------------------------------------
   TWO "SEE ALL" IDIOMS, and the test for which:

     href    the whole section is a DOORWAY and what you see is a truncated
             sample. The title becomes the link and takes a chevron. Rails.
     action  there is a peer destination but the section stands on its own.
             Home's sections.

   BASELINE ALIGNMENT, not centre alignment. The title is 34px and the action row
   is a 32px button: centring them optically floats the button above the title's
   baseline and the two read as unrelated objects. `items-baseline` on the row
   plus `self-baseline` on the action keeps them one line of thought even after
   the text column grows a description or wraps.

   The action slot styles by INHERITANCE — it sets `text-sm text-ink-secondary` on
   the wrapper — so the common cases (a count, a date range, a status line) pass a
   bare node with no classes. A link that wants to look like a link opts up with
   `text-accent-ink`, and opting up reads as intent.
   ============================================================================= */

/** T1/T2/T3 → the names the recipes are keyed by. The prop is numeric because
    the tiers are documented as a numbered ladder; the cva keys are words because
    other components consume them directly and `level: "block"` says what
    `level: "3"` does not. */
const TIER = { 1: "page", 2: "section", 3: "block" } as const;

/** The title's face, size and weight. Exported so the seven other components
    that own a title/description pair share ONE definition of the type without
    having to adopt this markup — see card.tsx, empty-state.tsx, error-state.tsx,
    dialog.tsx, popover.tsx. */
const headerTitleVariants = cva("text-ink", {
  variants: {
    level: {
      /* font-normal is load-bearing, not decorative: the serif ships one weight
         (400) and asking for 600 makes the browser synthesise a smeared bold. */
      page: "font-display text-3xl font-normal",
      section: "font-display text-xl font-normal",
      block: "font-sans text-base font-semibold",
    },
  },
  defaultVariants: { level: "section" },
});

/** The supporting SENTENCE. Steps down in size from T1→T2 and in ink from
    T2→T3 — the ink step is what marks the move from canvas to surface. */
const headerSupportVariants = cva("max-w-measure", {
  variants: {
    level: {
      page: "mt-2 text-base leading-relaxed text-ink-secondary",
      section: "mt-1.5 text-sm leading-relaxed text-ink-secondary",
      block: "mt-1 text-sm text-ink-tertiary",
    },
  },
  defaultVariants: { level: "section" },
});

/** Machine METADATA. One recipe, no variants — it only ever appears at block
    level, because a page title has no serial number. */
const headerMetaVariants = cva("mt-0.5 text-xs text-ink-tertiary");

const rootVariants = cva(
  "flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-3",
  {
    variants: {
      level: {
        page: "mb-8",
        section: "mb-5",
        block: "mb-4",
      },
      align: {
        start: "",
        /* Column, so the action stacks under the text rather than beside it.
           Two sites: the 404 and the empty session workspace. */
        center: "flex-col items-center text-center",
      },
      divider: { true: "border-b border-line-inner pb-5", false: "" },
    },
    defaultVariants: { level: "section", align: "start", divider: false },
  },
);

type Common = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title: React.ReactNode;
  /** Where this sits in the document OUTLINE. Defaults to the tier's natural
      tag. Set it when the outline and the visual tier legitimately disagree —
      that disagreement is expected, not a smell. */
  as?: "h1" | "h2" | "h3" | "h4";
  /** The supporting sentence. Prose, capped at a measure. */
  description?: React.ReactNode;
  /** Trailing slot, baseline-aligned to the title. */
  action?: React.ReactNode;
  /** Turns the title into a link with a trailing chevron — the "see all"
      affordance for a section that is a doorway. */
  href?: string;
  /** Inline beside the title: a StatusMark, a count, an id. */
  adornment?: React.ReactNode;
  /** One hairline under the whole block. Skip it when the next thing is a card —
      a card edge plus a rule above it is two separators doing one job. */
  divider?: boolean;
  align?: "start" | "center";
  /** Clamps the title to one line. For rails, where the title shares its row
      with scroll controls and a long name would push them off. */
  truncate?: boolean;
};

/* The discriminated union is the enforcement mechanism: `eyebrow` exists only on
   the level-1 arm and `meta` only on the level-3 arm, so the constraints in the
   header comment are compile errors rather than review comments. */
export type SectionHeaderProps =
  | (Common & {
      level: 1;
      /** Location label. Level 1 only, once per screen. */
      eyebrow?: React.ReactNode;
      /** Which surface the eyebrow sits on — it needs more ink on the canvas,
          where the ambient layer eats anything lighter than `ink-secondary`. */
      on?: "canvas" | "surface";
      meta?: never;
    })
  | (Common & { level?: 2; eyebrow?: never; meta?: never; on?: never })
  | (Common & {
      level: 3;
      eyebrow?: never;
      /** Machine metadata — "4 keys · 1 expiring". Block level only. */
      meta?: React.ReactNode;
      on?: never;
    });

export const SectionHeader = React.forwardRef<
  HTMLDivElement,
  SectionHeaderProps
>(function SectionHeader(props, ref) {
  const {
    className,
    level = 2,
    title,
    as,
    description,
    action,
    href,
    adornment,
    divider = false,
    align = "start",
    truncate,
    eyebrow,
    meta,
    on = "canvas",
    ...rest
  } = props as Common & {
    level?: 1 | 2 | 3;
    eyebrow?: React.ReactNode;
    meta?: React.ReactNode;
    on?: "canvas" | "surface";
  };

  const tier = TIER[level];
  const Tag = as ?? (["h1", "h2", "h3"] as const)[level - 1];
  const titleClass = cn(headerTitleVariants({ level: tier }), truncate && "truncate");

  return (
    <div
      ref={ref}
      className={cn(rootVariants({ level: tier, align, divider }), className)}
      {...rest}
    >
      <div className={cn("min-w-0", align === "start" && "flex-1")}>
        {eyebrow ? (
          <p
            className={cn(
              "eyebrow mb-1.5",
              on === "surface" ? "text-ink-tertiary" : "text-ink-secondary",
            )}
          >
            {eyebrow}
          </p>
        ) : null}

        <div
          className={cn(
            "flex flex-wrap items-baseline gap-x-3 gap-y-1",
            align === "center" && "justify-center",
          )}
        >
          {href ? (
            <Link
              href={href}
              className="group/title flex min-w-0 items-center gap-1.5 text-ink hover:text-accent-ink"
            >
              <Tag className={titleClass}>{title}</Tag>
              <ChevronRight
                aria-hidden
                className="size-4 shrink-0 opacity-50 transition-transform duration-(--duration-fast) group-hover/title:translate-x-0.5 group-hover/title:opacity-100"
              />
            </Link>
          ) : (
            <Tag className={cn(titleClass, "min-w-0")}>{title}</Tag>
          )}

          {adornment ? (
            <span className="flex items-center gap-2 text-xs text-ink-tertiary">
              {adornment}
            </span>
          ) : null}
        </div>

        {meta ? <p className={headerMetaVariants()}>{meta}</p> : null}

        {description ? (
          <p
            className={cn(
              headerSupportVariants({ level: tier }),
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        /* `self-baseline` keeps the action on the title's baseline even once the
           text column grows a description or wraps to two lines. `items-center`
           INSIDE it is what lets a 32px button sit on a 34px title's baseline
           without floating. Both are load-bearing; neither is redundant. */
        <div className="flex shrink-0 items-center gap-2 self-baseline text-sm text-ink-secondary">
          {action}
        </div>
      ) : null}
    </div>
  );
});

export { headerTitleVariants, headerSupportVariants, headerMetaVariants };
