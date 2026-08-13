import { cva, type VariantProps } from "class-variance-authority";
import { Badge, Pill } from "@/components/primitives";
import { Card, MeterBar, StatusMark } from "@/components/patterns";
import { ProceduralCover } from "./procedural-cover";
import { MODALITY_LABEL } from "@/lib/icons";
import type { ModelEntry } from "@/lib/mock/models";
import { cn } from "@/lib/cn";

/* =============================================================================
   ModelCard — one card, two densities, used by the Showroom and by All Models
   =============================================================================

   WHY ONE COMPONENT FOR BOTH. The Showroom and the catalogue show the same object
   at different sizes. Two components would drift — and the specific way they drift
   is that a fact present on one surface goes missing on the other, so a reader who
   learned the card in the Showroom cannot read it in the grid.

   THE COVER LIVES IN `ProceduralCover`, NOT HERE. It used to be a module-local
   `Cover` in this file, which is how it came to differ from the three other
   hand-written copies of the same idea. See that component for why the kit generates
   covers rather than shipping images, why the hue is deterministic, and why its
   range is deliberately narrow.

   `coverUrl` passes straight through, so dropping in real artwork later is a data
   change and not a code change.

   PRICE COMPARISON IS A PROP, NOT A DECISION MADE HERE. `priceCeiling` renders the
   comparison bar; omitting it renders the price as plain text. The Showroom passes
   it because its rails are grouped by modality, so there is one shared denominator
   and the rail header declares it. The flat catalogue grid does NOT pass it: a video
   price and a text price on one axis are two different questions, and a bar whose
   denominator cannot be stated is the exact failure /docs/patterns/visualization
   forbids.
   ============================================================================= */

const cardVariants = cva("flex flex-col overflow-hidden p-0", {
  variants: {
    density: {
      /* Fixed width so the rail can snap and so cards do not stretch to fill a
         short row. */
      showroom: "h-full w-72 shrink-0",
      grid: "w-full",
    },
  },
  defaultVariants: { density: "grid" },
});

export interface ModelCardProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof cardVariants> {
  model: ModelEntry;
  /**
   * The most expensive model in the comparison group. Pass it ONLY where a single
   * denominator is true and stated — see the header note. Omit for a flat grid.
   */
  priceCeiling?: number;
}

export function ModelCard({
  className,
  model,
  density,
  priceCeiling,
  ...props
}: ModelCardProps) {
  const tall = density === "showroom";
  /* Two capabilities, then "+N". Full-word labels are wide by choice (see
     lib/mock/models.ts) and the overflow is a count rather than a switch to
     abbreviations — a card that silently changes vocabulary when it runs out of
     room teaches the reader two systems. All of them stay in the accessible name. */
  const shown = model.capabilities.slice(0, 2);
  const hidden = model.capabilities.length - shown.length;

  const showBar =
    priceCeiling !== undefined && priceCeiling > 0 && model.pricePerRun > 0;

  return (
    <Card
      interactive
      elevation="sm"
      className={cn(cardVariants({ density }), className)}
      {...props}
    >
      <ProceduralCover
        seed={model.id}
        modality={model.modality}
        height={tall ? "lg" : "sm"}
        dim={model.status === "deprecated"}
        src={model.coverUrl}
      >
        {/* Status rides on the cover, not in the body: it is the one thing that can
            make you skip the card entirely, so it should be readable before the name. */}
        {model.status !== "available" ? (
          <Badge
            variant={model.status === "deprecated" ? "danger" : "warning"}
            size="sm"
            className="absolute top-2.5 left-2.5 bg-chip-over-media"
          >
            {model.status === "deprecated" ? "Deprecated" : "Limited capacity"}
          </Badge>
        ) : null}
        {model.isFast ? (
          <Badge variant="neutral" size="sm" className="absolute top-2.5 right-2.5 bg-chip-over-media">
            Fast
          </Badge>
        ) : null}
      </ProceduralCover>

      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div
          className="mb-2.5 flex flex-wrap gap-1"
          aria-label={`Capabilities: ${model.capabilities.join(", ")}`}
        >
          {shown.map((c) => (
            <Badge key={c} variant="neutral" size="sm">
              {c}
            </Badge>
          ))}
          {hidden > 0 ? (
            <Badge variant="outline" size="sm" aria-hidden>
              +{hidden}
            </Badge>
          ) : null}
        </div>

        <div className="mb-1 flex items-start gap-2">
          <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-ink">
            {model.name}
          </h3>
          {model.status === "available" && !model.isAuto ? (
            <StatusMark status="success" label="Available" />
          ) : null}
        </div>

        <p className="mb-2 text-xs text-ink-tertiary">{model.vendor}</p>

        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-ink-secondary">
          {model.description}
        </p>

        {/* Tags collapse entirely when absent rather than reserving an empty row —
            several fixtures have none on purpose, to keep this path exercised. */}
        {model.tags?.length ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {model.tags.map((t) => (
              <Pill key={t} size="sm" variant="outline" tabIndex={-1}>
                {t}
              </Pill>
            ))}
          </div>
        ) : null}

        <div className="mt-auto border-t border-line-inner pt-3">
          {showBar ? (
            <MeterBar
              className="mb-2.5"
              value={(model.pricePerRun / priceCeiling!) * 100}
              thickness="hairline"
              aria-label={`${model.name} costs $${model.pricePerRun.toFixed(2)} per run, against $${priceCeiling!.toFixed(2)} for the priciest ${MODALITY_LABEL[model.modality].toLowerCase()} model`}
            />
          ) : null}

          <div className="flex items-end justify-between gap-3">
            {/* `shrink-0 whitespace-nowrap` is load-bearing. The price is the one
                thing on this card that must never wrap — "$0.07 / run" breaking
                across two lines put the unit under the figure and shoved the
                context note into it. It fit until the type scale went up, which
                is exactly the kind of break a fixed width hides until it does
                not. The note yields instead: it is the lower-priority half. */}
            <p className="shrink-0 tabular font-mono text-base whitespace-nowrap text-ink">
              {model.pricePerRun > 0 ? (
                <>
                  ${model.pricePerRun.toFixed(2)}
                  <span className="text-sm text-ink-tertiary"> / run</span>
                </>
              ) : (
                <span className="text-sm text-ink-secondary">Included</span>
              )}
            </p>
            {model.contextNote ? (
              <p className="min-w-0 truncate text-right text-2xs text-ink-tertiary">
                {model.contextNote}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

export { cardVariants as modelCardVariants };
