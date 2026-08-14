import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ModelCard } from "@/components/app/model-card";
import { BarList, Card, CardBody, CardRail, MeterBar } from "@/components/patterns";
import { MODALITY_LABEL } from "@/lib/icons";
import type { ModelEntry } from "@/lib/mock/models";
import type { Modality } from "@/lib/mock/agents";

/* =============================================================================
   Models — Showroom
   =============================================================================
   The browse surface. `/models/all` is the work surface.

   UX NOTES
   --------
   • BROWSE FIRST, FILTER SECOND. Someone arriving at a catalogue of 28 models
     mostly does not yet know what they want; they want to see what there is. So
     the landing is rails of covers, and the search-and-facet grid is one click
     away rather than the thing you have to get past. The reverse order — filters
     first — assumes a question the visitor has not formed yet.

   • GROUPED BY MODALITY, NOT ONE FLAT LIST. You never shop for "a model"; you want
     an image model or a video model. Grouping matches the actual question, and it
     is also what makes the price bars honest: the only comparison anyone performs
     here is between models that could do the same job.

   • "AUTO" IS EXPLAINED, NOT LISTED AS A MODEL. Auto is a routing policy, and
     presenting it as a peer card implies there is a model called Auto with those
     characteristics. It keeps its own treatment and a sentence saying what it does,
     because "why is Auto cheaper than everything it routes to" is the first
     question a careful reader asks.

   • THE PRICE BAR IS LEGITIMATE HERE AND NOT ON THE CATALOGUE GRID. A rail is one
     modality, so there is exactly one denominator and the rail header prints it.
     The flat grid on /models/all deliberately drops the bar: a video price against
     a text price on one axis is two different questions. See
     /docs/patterns/visualization.

   • SPEND SITS AT THE BOTTOM. It is real and useful — "which of these am I actually
     paying for" — but leading with it turns a showroom into an invoice.
   ============================================================================= */

/* Only the BLURBS live here. Icons and labels come from the registry, because those
   are facts about a modality that every screen must agree on, whereas the blurb is
   editorial copy specific to this page. */
const MODALITY_BLURB: Record<Modality, string> = {
  image: "Text-to-image and image-to-image generation.",
  video:
    "Text-to-video and image-to-video. The most expensive modality — check the duration you request.",
  audio: "Text-to-speech and voice generation.",
  text: "Included in the plan — no per-run charge.",
};

/* Catalogue order is by production cost, deliberately NOT the registry's MODALITIES
   order: someone browsing models is weighing spend, so the expensive modalities
   belong at the top of the page. */
const ORDER: Modality[] = ["image", "video", "audio", "text"];

export function ShowroomView({
  models,
  balance,
}: {
  models: ModelEntry[];
  balance: {
    spentThisMonth: number;
    byModel: { name: string; cost: number }[];
    spendByModality: { label: string; value: number }[];
  };
}) {
  return (
    <>
      <div className="space-y-12">
        {ORDER.map((modality, i) => {
          const group = models.filter((m) => m.modality === modality);
          if (group.length === 0) return null;

          const auto = group.find((m) => m.isAuto);
          const rest = group.filter((m) => !m.isAuto);
          /* Scaled WITHIN the modality, never across the page. Auto is excluded
             because it is a policy, not a priced peer. */
          const priciest = Math.max(...rest.map((m) => m.pricePerRun), 0);

          return (
            <div key={modality} className={`anim-rise stagger-${Math.min(i + 2, 5)}`}>
              <CardRail
                title={`${MODALITY_LABEL[modality]} generation models`}
                description={MODALITY_BLURB[modality]}
                href={`/models/all?capability=${encodeURIComponent(
                  modality === "text" ? "Text to text" : `Text to ${modality}`,
                )}`}
                aria-label={`${MODALITY_LABEL[modality]} generation models`}
                meta={
                  /* The declared denominator for the bars inside the rail. A bar
                     without a stated scale is the most common way a small chart
                     lies, so the scale is printed once, here. */
                  priciest > 0 ? (
                    <p className="eyebrow hidden text-ink-secondary md:block">
                      bars relative to ${priciest.toFixed(2)}/run
                    </p>
                  ) : null
                }
              >
                {/* Auto leads the rail, in its own treatment. Same width as a card
                    so the snap rhythm is unbroken, but visibly not a model.

                    `h-full` is not cosmetic: CardRail wraps every child in an
                    `h-full` flex item precisely so a short card fills the row, and
                    this one never stretched into it. Measured 226px against its
                    peers' 421px — a 195px step in a rail of things presented as
                    equivalent, which reads as a rendering fault rather than as a
                    distinction. */}
                {auto ? (
                  <Card className="flex h-full w-72 shrink-0 flex-col justify-between gap-4 border border-accent/25 bg-accent-soft/50 p-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Sparkles className="size-4 shrink-0 text-accent-ink" />
                        <p className="text-sm font-semibold text-ink">
                          Auto — recommended
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed text-ink-secondary">
                        {auto.contextNote}. Picks the best available option at request
                        time and falls back if one is saturated, which is why it can
                        price below the models it routes to.
                      </p>
                    </div>
                    {auto.pricePerRun > 0 ? (
                      <p className="tabular font-mono text-base text-ink">
                        ${auto.pricePerRun.toFixed(2)}
                        <span className="text-sm text-ink-tertiary"> / run</span>
                      </p>
                    ) : (
                      <p className="text-sm text-ink-secondary">Included</p>
                    )}
                  </Card>
                ) : null}

                {rest.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    density="showroom"
                    priceCeiling={priciest}
                  />
                ))}
              </CardRail>
            </div>
          );
        })}
      </div>

      {/* ---- Closing context: what this workspace actually pays for. Two
             encodings, two different questions — the segments say "which modality
             eats the budget", the list says "which named model". Both declare their
             denominator. ---- */}
      <Card className="anim-rise stagger-5 mt-12">
        <CardBody>
          <div className="grid gap-8 lg:grid-cols-2">
            <MeterBar
              segments={balance.spendByModality.map((m) => ({
                label: m.label,
                value: (m.value / balance.spentThisMonth) * 100,
                valueLabel: `$${m.value.toFixed(2)}`,
              }))}
              thickness="thick"
              label="Spend by modality"
              showValue={`$${balance.spentThisMonth.toFixed(2)} this month`}
            />
            <BarList
              scale="max"
              scaleLabel="relative to your priciest model this month"
              items={balance.byModel.map((m) => ({
                label: m.name,
                value: m.cost,
                valueLabel: `$${m.cost.toFixed(2)}`,
              }))}
            />
          </div>
          <p className="mt-6 text-sm text-ink-secondary">
            Comparing every model side by side?{" "}
            <Link href="/models/all" className="text-accent-ink hover:underline">
              Search and filter the full catalogue
            </Link>
            .
          </p>
        </CardBody>
      </Card>
    </>
  );
}
