"use client";

import * as React from "react";
import { Play, Type } from "lucide-react";
import { MODALITIES, MODALITY_ICON, MODALITY_LABEL } from "@/lib/icons";
import { Icon } from "@/components/primitives/icon";
import {
  Button,
  SegmentedControl,
  Slider,
  Switch,
  Textarea,
} from "@/components/primitives";
import {
  Card,
  CodeBlock,
  EmptyState,
  SectionHeader,
  StatTile,
} from "@/components/patterns";
import type { Modality } from "@/lib/mock/agents";
import type { ModelEntry } from "@/lib/mock/models";
import { BALANCE } from "@/lib/mock/models";

/* =============================================================================
   Playground
   =============================================================================
   A PROPOSAL, not a port — production has a playground but we have not seen it,
   so this states its reasoning loudly enough to be argued with.

   UX NOTES
   --------
   • TWO COLUMNS, NOT A MODAL. Parameters stay visible next to the output, because
     the entire job here is "change one thing, look again". Hiding params behind a
     settings dialog would make the core loop a three-click round trip.

   • PARAMETERS ARE THE POINT, so unlike the session composer (which hides them
     behind progressive disclosure) they are exposed by default. Same components,
     opposite disclosure — because the task is different: the composer is for
     producing, the playground is for tuning.

   • THE API SNIPPET UPDATES WITH THE CONTROLS. This is the bridge from "I tuned
     it here" to "I shipped it" — without it, a user has to reverse-engineer their
     own settings into a request body.

   • COST IS SHOWN PER RUN AND AGAINST REMAINING BALANCE, same rule as everywhere
     else: never let someone commit spend they cannot see.
   ============================================================================= */

/* Registry-derived. This list used to run image→video→audio→text while the
   composer ran text→image→video→audio — the same four-way choice presented in two
   different orders on two screens. MODALITIES is now the single reading order.
   (The DEFAULT selection is still "image" below; that is a separate decision about
   what people usually come here to do, not about how the options are ordered.) */
const MODES = MODALITIES.map((value) => ({
  value,
  label: MODALITY_LABEL[value],
  icon: <Icon of={MODALITY_ICON[value]} />,
}));

export function PlaygroundView({ models }: { models: ModelEntry[] }) {
  const [mode, setMode] = React.useState<Modality>("image");
  const [modelId, setModelId] = React.useState("gpt-image-1");
  const [prompt, setPrompt] = React.useState("");
  const [steps, setSteps] = React.useState(30);
  const [seedLocked, setSeedLocked] = React.useState(false);

  const available = models.filter((m) => m.modality === mode && !m.isAuto);
  const model =
    available.find((m) => m.id === modelId) ?? available[0] ?? models[0]!;
  const cost = model.pricePerRun;
  const canRun = prompt.trim().length > 0 && cost <= BALANCE.remaining;

  React.useEffect(() => {
    const first = models.find((m) => m.modality === mode && !m.isAuto);
    if (first) setModelId(first.id);
  }, [mode, models]);

  const snippet = `curl https://api.model.store/v1/generate \\
  -H "Authorization: Bearer $MODEL_STORE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model.id}",
    "prompt": ${JSON.stringify(prompt || "a ceramic cup on a marble counter")},
    "steps": ${steps}${seedLocked ? ',\n    "seed": 42' : ""}
  }'`;

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      {/* ---- Controls. Always visible: this is the working surface. ---- */}
      <div className="anim-rise stagger-2 space-y-4">
        <Card className="p-4">
          <SegmentedControl
            label="Modality"
            fullWidth
            size="sm"
            value={mode}
            onValueChange={(v) => setMode(v as Modality)}
            options={MODES}
          />
        </Card>

        <Card className="p-4">
          <label
            htmlFor="pg-model"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Model
          </label>
          <select
            id="pg-model"
            value={model.id}
            onChange={(e) => setModelId(e.target.value)}
            className="h-(--control-height-lg) w-full rounded-lg bg-surface-sunken px-3 text-sm text-ink"
          >
            {available.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.vendor}
              </option>
            ))}
          </select>

          <div className="mt-5 space-y-5">
            <Slider
              label="Steps"
              value={steps}
              onValueChange={(v) => setSteps(Array.isArray(v) ? v[0]! : v)}
              min={10}
              max={60}
              step={1}
            />
            <Switch
              checked={seedLocked}
              onCheckedChange={setSeedLocked}
              label="Lock seed"
              description="Reuse the same seed so changes you make are the only variable."
            />
          </div>
        </Card>

        <Card className="p-4">
          <StatTile
            label="Cost per run"
            value={cost > 0 ? `$${cost.toFixed(2)}` : "Included"}
            caption={`$${BALANCE.remaining.toFixed(2)} balance remaining`}
            meter={
              cost > 0
                ? {
                    value: Math.min(100, (cost / Math.max(BALANCE.remaining, cost)) * 100),
                    tone: cost > BALANCE.remaining ? "warning" : "accent",
                    "aria-label": "Cost against remaining balance",
                  }
                : undefined
            }
          />
          {cost > BALANCE.remaining && (
            <p className="mt-3 text-sm text-warning">
              This run costs more than your remaining balance.
            </p>
          )}
        </Card>
      </div>

      {/* ---- Prompt, output, and the snippet that carries it into code ---- */}
      <div className="anim-rise stagger-3 space-y-4">
        <Card className="p-4">
          <label htmlFor="pg-prompt" className="mb-1.5 block text-sm font-medium text-ink">
            Prompt
          </label>
          <Textarea
            id="pg-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A minimalist product shot of a ceramic coffee cup on a marble counter…"
            className="min-h-28"
          />
          <div className="mt-3 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              startIcon={<Play />}
              disabled={!canRun}
              aria-label={
                cost > BALANCE.remaining
                  ? "Cannot run — insufficient balance"
                  : prompt.trim()
                    ? "Run"
                    : "Enter a prompt to run"
              }
            >
              Run
            </Button>
          </div>
        </Card>

        <Card className="p-0" variant="footerStrip">
          <div className="grid min-h-64 place-items-center p-6">
            <EmptyState
              showIcon={false}
              title="Nothing generated yet"
              description="Run the model and the output will appear here, at full size."
            />
          </div>
        </Card>

        <div>
          <SectionHeader
            level={3}
            as="h2"
            title="Equivalent API call"
            description="Updates as you change the controls, so what you tuned here is what you ship."
          />
          <CodeBlock filename="generate.sh" code={snippet} />
        </div>
      </div>
    </div>
  );
}
