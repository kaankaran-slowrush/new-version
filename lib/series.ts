/* =============================================================================
   Series helpers
   =============================================================================

   Pure functions for the three micro-visualisation components. No React, no JSX.

   WHAT IS DELIBERATELY *NOT* HERE: the geometry.

   Each component's normalise-to-viewBox maths is six lines welded to its own box
   model, and factoring it out is the first step down a road that ends in a chart
   library nobody chose: a shared `scale()` invites a `Scale` object, which invites
   an `axis` config, which invites a `data` + `encoding` prop pair. Geometry stays
   local and duplicated on purpose.

   What genuinely IS shared is (a) the summary statistics call sites need in order
   to declare a denominator, and (b) accessible-name generation — which is the one
   piece of this that is easy to do badly and expensive to notice.
   ============================================================================= */

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface SeriesExtent {
  min: number;
  max: number;
  total: number;
  first: number;
  last: number;
  count: number;
  /** How many points are non-zero. The gap count is `count - nonZeroCount`. */
  nonZeroCount: number;
}

export function seriesExtent(values: readonly number[]): SeriesExtent {
  const clean = values.filter((v) => Number.isFinite(v));
  if (clean.length === 0) {
    return { min: 0, max: 0, total: 0, first: 0, last: 0, count: 0, nonZeroCount: 0 };
  }
  return {
    min: Math.min(...clean),
    max: Math.max(...clean),
    total: clean.reduce((a, b) => a + b, 0),
    first: clean[0]!,
    last: clean[clean.length - 1]!,
    count: clean.length,
    nonZeroCount: clean.filter((v) => v !== 0).length,
  };
}

/* -----------------------------------------------------------------------------
   describeSeries — the accessible name

   THE RULE THIS ENFORCES: an accessible name for a graphic is a SUMMARY SENTENCE,
   never an enumeration. A 30-point series read out as thirty numbers is unusable
   with a screen reader — it is technically complete and practically hostile. What
   a sighted user takes from a sparkline in one glance is: the range, where it
   ended, and which way it went. That is what this returns.

   It also names the two degenerate cases explicitly rather than describing them as
   if they were trends, because "flat at zero" and "not enough data" are the two
   things a sparkline most easily lies about.
   -------------------------------------------------------------------------- */
export function describeSeries(
  name: string,
  values: readonly number[],
  opts: { unit?: string; window?: string; format?: (n: number) => string } = {},
): string {
  const { unit = "", window, format } = opts;
  const fmt = format ?? ((n: number) => String(n));
  const u = unit ? ` ${unit}` : "";
  const win = window ? `, ${window}` : "";
  const e = seriesExtent(values);

  if (e.count === 0) return `${name}${win}: no data.`;
  if (e.count < 2) return `${name}${win}: not enough history to show a trend.`;
  if (e.max === 0) return `${name}: no activity${window ? ` ${window}` : ""}.`;

  const direction =
    e.last > e.first ? "Up" : e.last < e.first ? "Down" : "Level with";
  const trend =
    e.last === e.first
      ? `Level with the start of the window at ${fmt(e.first)}${u}.`
      : `${direction} from ${fmt(e.first)}${u} at the start of the window.`;
  const gaps =
    e.nonZeroCount < e.count
      ? ` ${e.count - e.nonZeroCount} of ${e.count} points are zero.`
      : "";

  return (
    `${name}${win}: ${e.count} points from ${fmt(e.min)}${u} to ${fmt(e.max)}${u}, ` +
    `ending at ${fmt(e.last)}${u}. ${trend}${gaps}`
  );
}
