"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/primitives";
import { cn } from "@/lib/cn";
import { SectionHeader } from "./section-header";

/* =============================================================================
   CardRail — a horizontally scrolling row of cards that bleeds to the viewport
   =============================================================================

   WHY IT EXISTS. Three surfaces already needed this and each hand-rolled it: the
   homepage hero proof strip, the homepage fleet strip, and now the Showroom. The
   copies had already diverged — the homepage version is missing
   `overscroll-x-contain`, so scrolling past the end of the rail scrolls the page
   behind it, which on a trackpad feels like the rail is broken.

   THE BLEED. Cards run to the edge of the viewport rather than stopping at the
   content column, because a rail that ends flush with the text tells you it has
   nothing more in it. The negative margin MUST match the page's horizontal
   padding — every `(app)` page uses `px-6 lg:px-8`, hence `-mx-6 px-6 lg:-mx-8
   lg:px-8`. If a consumer changes its page padding, this needs the same change or
   the rail will look misaligned by a few pixels, which is worse than not bleeding
   at all.

   SNAPPING. `snap-x snap-mandatory` here, `snap-start` on each child (applied by
   this component, so callers cannot forget). A rail that comes to rest with a card
   sliced in half is the single thing that makes a carousel feel cheap, and it is
   also a genuine usability problem: a half-visible card reads as "the end", so
   people stop scrolling.

   THE BUTTONS. Present because the reference has them, and because a trackpad-less
   mouse user has no horizontal scroll gesture at all. Hidden below `sm`, where the
   touch gesture is the affordance and a pair of buttons is just clutter. They
   disable at each end rather than wrapping — wrapping a list with a known length
   loses the reader's place.

   REDUCED MOTION. `scrollBy` takes its own `behavior`, and a JS argument ignores
   the `scroll-behavior: auto !important` that globals.css sets under
   `prefers-reduced-motion`. So the preference is read at click time and passed
   through explicitly. Read at click time, not cached, so it tracks a preference
   that changes mid-session without needing a listener.
   ============================================================================= */

export interface CardRailProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "title"> {
  /**
   * Omit for a bare rail — the scroll/snap/bleed mechanics with no chrome, for a
   * rail that sits inside a section which already has its own heading. The hero
   * proof strip is that case: a second heading there would compete with the h1.
   */
  title?: React.ReactNode;
  /** Renders the title as a link with a trailing chevron — the "see all" affordance. */
  href?: string;
  /**
   * The supporting sentence under the title. A rail is a section, so this is the
   * section tier's support line — 13px, `ink-secondary`, capped at a measure.
   */
  description?: React.ReactNode;
  /** Right-hand slot in the header row, left of the scroll buttons. */
  meta?: React.ReactNode;
  /**
   * Hide the prev/next pair. Only sensible on a titleless rail — with no header row
   * there is nowhere for buttons to live. Note this removes the ONLY affordance a
   * mouse user without horizontal scroll has, so use it where the rail is
   * supplementary rather than a primary path.
   */
  showControls?: boolean;
  /** Accessible name for the scrollable region. REQUIRED when there is no title,
      or the rail is an unlabelled group of links. */
  "aria-label"?: string;
  children: React.ReactNode;
}

export const CardRail = React.forwardRef<HTMLElement, CardRailProps>(
  function CardRail(
    {
      className,
      title,
      href,
      description,
      meta,
      showControls = true,
      "aria-label": ariaLabel,
      children,
      ...props
    },
    ref,
  ) {
    const scroller = React.useRef<HTMLDivElement>(null);
    const [atStart, setAtStart] = React.useState(true);
    const [atEnd, setAtEnd] = React.useState(false);

    const measure = React.useCallback(() => {
      const el = scroller.current;
      if (!el) return;
      /* 2px of slack: sub-pixel layout means scrollLeft rarely lands exactly on
         scrollWidth - clientWidth, and a button that never enables at the end is
         a worse bug than one that enables a pixel early. */
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    }, []);

    React.useEffect(() => {
      const el = scroller.current;
      if (!el) return;
      measure();
      /* Both are needed: scroll for the user moving it, resize for the rail
         becoming fully visible at a wider viewport (at which point there is
         nothing left to scroll and both buttons must go quiet). */
      el.addEventListener("scroll", measure, { passive: true });
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => {
        el.removeEventListener("scroll", measure);
        ro.disconnect();
      };
    }, [measure]);

    const page = (direction: -1 | 1) => {
      const el = scroller.current;
      if (!el) return;
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      /* 80% of a viewport, not 100%: leaving a sliver of the previous card on
         screen is what tells the reader the list is continuous rather than paged. */
      el.scrollBy({
        left: direction * el.clientWidth * 0.8,
        behavior: reduced ? "auto" : "smooth",
      });
    };

    const label =
      ariaLabel ?? (typeof title === "string" ? title : undefined);

    const hasHeader = Boolean(title || meta || showControls);

    return (
      <section ref={ref} className={cn("min-w-0", className)} {...props}>
        {hasHeader ? (
          /* A rail is a section, so it takes the section tier of the header
             pattern rather than restating it. Composing rather than copying is
             also what fixed a real ordering bug: the showroom used to hang its
             group description in a <p> AFTER the closing tag, so the description
             of a group rendered below the group. */
          <SectionHeader
            title={title ?? ""}
            href={href}
            description={description}
            truncate
            action={
              <>
                {meta}
                {/* Hidden below sm: touch scrolling is the affordance there. */}
                <div
                  className={cn(
                    "hidden items-center gap-1",
                    showControls && "sm:flex",
                  )}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    aria-label="Scroll left"
                    disabled={atStart}
                    onClick={() => page(-1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    aria-label="Scroll right"
                    disabled={atEnd}
                    onClick={() => page(1)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </>
            }
          />
        ) : null}

        <div
          ref={scroller}
          /* tabIndex + role: a scrollable region that keyboard users cannot reach
             is inaccessible content. This makes the rail focusable so arrow keys
             scroll it, which is the native behaviour once it can hold focus. */
          role="group"
          aria-label={label}
          tabIndex={0}
          className={cn(
            "-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-6 pb-2 lg:-mx-8 lg:px-8",
            /* The bleed pulls the focus ring off-screen at the edges, so it is
               inset rather than outset here. */
            "focus-visible:outline-offset-[-2px]",
          )}
        >
          {React.Children.map(children, (child, i) =>
            React.isValidElement(child) ? (
              /* `shrink-0` is not optional and its absence was a real bug: THIS div
                 is the flex item, so without it flex squeezed every tile and the
                 `w-64` on the card inside was powerless — its parent was the thing
                 being compressed. Tiles came out at wildly different widths and the
                 badges overlaying their covers collided.

                 `h-full` so a short card fills the row rather than leaving its
                 neighbour hanging below it.

                 snap-start is applied HERE rather than asked of the caller. A rail
                 whose snapping depends on every consumer remembering a class is a
                 rail that stops snapping the first time someone adds a card. */
              <div key={i} className="h-full shrink-0 snap-start">
                {child}
              </div>
            ) : (
              child
            ),
          )}
        </div>
      </section>
    );
  },
);
