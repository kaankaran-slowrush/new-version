"use client";

import * as React from "react";

/* =============================================================================
   useScrolled — "has content started passing under the fixed chrome yet?"
   =============================================================================

   The kit ships zero business logic, and this is not an exception to that: it is
   presentational state, in exactly the same class as "is this menu open" or
   "which tab is selected". It answers a question about the VIEW, not the domain.

   WHY A SCROLL LISTENER AND NOT THE ALTERNATIVES

   • `animation-timeline: scroll()` would make this pure CSS with no JS at all,
     and it is the right answer in about two years. Today it is Chromium-only —
     unacceptable for a kit whose whole purpose is being lifted into someone
     else's production app.
   • An `IntersectionObserver` on a sentinel is the other standard approach and is
     marginally cheaper, but it requires the consuming layout to render a sentinel
     element in the right place. That is a coupling a component should not impose
     on its parent. This hook is self-contained.

   THE TWO THINGS THAT MAKE IT CHEAP

   • `{ passive: true }` — the listener can never block scrolling, because the
     browser knows in advance it will not call preventDefault.
   • rAF coalescing — at most one read per frame no matter how fast the scroll
     events fire. And because React bails out of a re-render when setState is
     called with the identical value, a long scroll produces exactly TWO renders:
     one crossing the threshold going down, one coming back up.
   ============================================================================= */

export function useScrolled(threshold = 16): boolean {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      /* Already scheduled for this frame — drop the event. */
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    /* Read once on mount. This is what handles a reload that restores a
       mid-page scroll position: without it the chrome would render at rest over
       content until the user happened to scroll. Server render is always `false`
       (there is no scroll position on the server), so the correction lands on the
       first client effect — a one-frame difference, and only ever in the
       direction of "chrome appears", never "chrome vanishes". */
    read();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
