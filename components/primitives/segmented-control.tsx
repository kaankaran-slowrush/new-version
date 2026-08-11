"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/* =============================================================================
   SegmentedControl
   =============================================================================
   The second of three permitted neumorphic components.

   UX NOTES
   --------
   • WHY NEUMORPHISM: the recessed well (`.neu-inset`) reads as a channel that
     the active segment sits inside. That is a real affordance — it tells you
     these options are mutually exclusive and belong to one group, which a row
     of flat buttons does not. The active segment is a `.neu-raised` surface
     that has come *up* out of the well.

   • THE TEXT PROBLEM, HANDLED: labels do sit on this control, which normally
     disqualifies neumorphism. It survives because the *active* segment is an
     opaque raised surface (full contrast for its label), and inactive labels
     use `text-ink-secondary` on the sunken fill rather than relying on shadow
     for legibility. The neumorphism describes the container, not the text.

   • WHEN TO USE THIS vs. TABS: a segmented control filters or switches the
     *mode* of one thing that stays on screen. Tabs swap the content region
     entirely. If the panel below changes wholesale, you want Tabs.

   • MAX ~5 SEGMENTS. Past that, labels truncate and it becomes a bad Select.
     Also: never animate the active segment's travel for a control used dozens
     of times a day — mode switching should feel instant, not choreographed.

   • Keyboard: arrow keys move between segments (roving tabindex), matching
     native radio-group behaviour, because that is what this is semantically.
   ============================================================================= */

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Disable one option without disabling the group. */
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** Accessible name for the group. */
  label: string;
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onValueChange,
  label,
  size = "md",
  fullWidth = false,
  className,
}: SegmentedControlProps<T>) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  function focusIndex(i: number) {
    const enabled = options
      .map((o, idx) => ({ o, idx }))
      .filter(({ o }) => !o.disabled);
    if (enabled.length === 0) return;
    const wrapped = ((i % enabled.length) + enabled.length) % enabled.length;
    const target = enabled[wrapped];
    refs.current[target.idx]?.focus();
    onValueChange(target.o.value);
  }

  const activeEnabledIndex = options
    .filter((o) => !o.disabled)
    .findIndex((o) => o.value === value);

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "neu-inset inline-flex gap-1 rounded-full p-1",
        fullWidth && "flex w-full",
        className,
      )}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          focusIndex(activeEnabledIndex + 1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          focusIndex(activeEnabledIndex - 1);
        }
      }}
    >
      {options.map((option, i) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={typeof option.label === "string" ? undefined : option.value}
            disabled={option.disabled}
            /* Roving tabindex: one stop for the whole group, then arrow keys. */
            tabIndex={active ? 0 : -1}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-medium",
              "transition-colors duration-(--duration-fast) ease-(--ease-out-quint)",
              "disabled:cursor-not-allowed disabled:opacity-45",
              /* Same one-notch-below rule as FilterPills, and the same reason for
                 moving up with the ladder. */
              size === "sm" ? "h-8 px-3.5 text-sm [&_svg]:size-3.5" : "h-9 px-4 text-sm [&_svg]:size-4",
              fullWidth && "flex-1",
              active
                ? "neu-raised text-ink"
                : "text-ink-secondary hover:text-ink",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
