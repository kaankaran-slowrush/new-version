"use client";

import * as React from "react";

/* =============================================================================
   CursorGlow — a soft light that follows the pointer, but only over empty space
   =============================================================================

   THE WHOLE IDEA IS THE EXCLUSION. A glow that simply follows the cursor
   everywhere is a spotlight, and a spotlight over content is a distraction that
   competes with whatever you are actually reading. This one lives on the ambient
   layer and switches off the moment the pointer crosses onto a card, a control or
   the chrome — so it reads as the *background* reacting to you, never as an
   effect applied to the interface.

   That exclusion is also what keeps it honest with the rest of the system: cards
   here are translucent (`.surface-veil` at 80%), so a glow underneath one would
   bleed faintly through it and put a moving highlight behind body text. Hiding it
   is cheaper and better than trying to mask it.

   HOW "EMPTY SPACE" IS DECIDED. `event.target` is the topmost element under the
   pointer, so one `closest()` against a list of things that own a surface answers
   it. `Card` always carries `.surface-veil` and the chrome always carries
   `.glass`, so those two class hooks cover every painted panel in the kit without
   anything needing to opt in.

   PERFORMANCE
   • `pointermove` is throttled to one rAF, so a fast drag across the screen costs
     one write per frame rather than one per event.
   • The element only ever has `transform` and `opacity` written to it — both
     compositor properties, so nothing repaints and nothing lands on the main
     thread. The position is written directly to the node's style rather than
     through React state, because routing 120 pointer events a second through a
     re-render would be a needless waste even though the output is identical.

   WHEN IT DOES NOT EXIST AT ALL
   • `prefers-reduced-motion` — the listener is never attached. Not dimmed, not
     slowed: a cursor-tracking light is pure motion and has no reduced form worth
     shipping.
   • `(hover: none)` — touch devices have no hovering pointer, so the effect would
     either never fire or fire once and strand a glow on screen after a tap.
   • `prefers-contrast: more` / `prefers-reduced-transparency` — inherited for free
     from `.ambient-layer`, which globals.css sets to `display: none` under both.

   IT ADDS LIGHT, NEVER COLOUR-DARKENING. The core is white. That matters: the
   ambient layer's alphas are capped by a measured contrast budget, and anything
   that darkened the ground would eat into it. A light glow can only raise the
   contrast of the ink sitting near it, so it needs no budget of its own.
   ============================================================================= */

/** Anything that owns a painted surface. Crossing onto one of these turns the
    glow off. `.surface-veil` catches every Card, `.glass` catches all chrome. */
const OCCUPIED =
  "a, button, input, textarea, select, [role='button'], [role='img'], .surface-veil, .glass";

export function CursorGlow() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;

    /* Both are read once, not watched. A user who changes either mid-session gets
       the new behaviour on the next navigation, which is a fair trade for not
       holding two more listeners open for the life of the page. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    let visible = false;

    const paint = () => {
      frame = 0;
      /* -50% so the gradient's centre lands on the pointer rather than its corner. */
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      const target = e.target as Element | null;
      const overContent = Boolean(target?.closest?.(OCCUPIED));

      if (overContent) {
        if (visible) {
          visible = false;
          el.style.opacity = "0";
        }
        return;
      }

      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
        /* Snap to the pointer before fading in, or the glow slides across the
           screen from wherever it was last seen. */
        paint();
      }
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="ambient-layer pointer-events-none absolute top-0 left-0 size-[340px] opacity-0 blur-[24px] transition-opacity duration-(--duration-normal) ease-(--ease-out-quint)"
      style={{
        background:
          "radial-gradient(closest-side, oklch(100% 0 0 / 0.62), oklch(88% 0.12 224 / 0.26) 45%, transparent 72%)",
        willChange: "transform, opacity",
      }}
    />
  );
}
