"use client";

import * as React from "react";
import { MoreHorizontal, Plus, Webhook as WebhookIcon } from "lucide-react";
import {
  Badge,
  Button,
  Checkbox,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@/components/primitives";
import {
  Card,
  CopyField,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
  EmptyState,
  MeterBar,
  StatusMark,
  FirstRun,
} from "@/components/patterns";
import type { Webhook, WebhookEvent } from "@/lib/mock/platform";

/* =============================================================================
   Webhooks
   =============================================================================
   Ported from the production screen, with three changes and one addition.

   1 · THREE STAT CARDS → ONE SUMMARY LINE.
       Production showed "Total Webhooks 1 / Active 1 / Success Rate 100%" as three
       large tiles above a one-row table. Two of those are the same fact, and the
       chrome outweighed the content. A single line carries it; aggregate tiles
       earn their space only once there is something to aggregate.

   2 · COPY FIXED: "Create Webhooks" → "Create webhook". You make one at a time.

   3 · EVENT PILLS ARE NEUTRAL, not blue. An event name is a category, not a
       status — and blue is not in this palette at all.

   4 · SIGNING SECRET ADDED. Production has no secret anywhere, which means a
       receiver cannot verify that a payload actually came from model.store. The
       reveal-once + rotate flow is a designed surface here, not an afterthought.

   Kept because it was genuinely good: the whole table shape, the row ⋯ menu, and
   above all the event checkboxes WITH DESCRIPTIONS — real capability transparency
   rather than a bare list of enum names.
   ============================================================================= */

const EVENT_LABEL: Record<WebhookEvent, string> = {
  "model.started": "Started",
  "model.completed": "Completed",
  "model.failed": "Failed",
};

function CreateWebhookDialog({
  events,
  apiKeyNames,
}: {
  events: { value: WebhookEvent; label: string; description: string }[];
  apiKeyNames: string[];
}) {
  const [selected, setSelected] = React.useState<WebhookEvent[]>(["model.completed"]);

  return (
    <DialogRoot>
      <DialogTrigger
        render={
          <Button variant="primary" size="md" startIcon={<Plus />}>
            Create webhook
          </Button>
        }
      />
      <DialogContent size="md">
        <DialogTitle>Create webhook</DialogTitle>
        <DialogDescription>
          Set up an endpoint to receive event notifications.
        </DialogDescription>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="wh-name" className="mb-1.5 block text-sm font-medium text-ink">
              Name
            </label>
            <Input id="wh-name" placeholder="prod-notifier" />
          </div>

          <div>
            <label htmlFor="wh-url" className="mb-1.5 block text-sm font-medium text-ink">
              Endpoint URL
            </label>
            <Input id="wh-url" placeholder="https://api.example.com/hooks/model-store" />
            <p className="mt-1.5 text-sm text-ink-tertiary">
              Must be HTTPS. We retry failed deliveries three times with backoff.
            </p>
          </div>

          <div>
            <label htmlFor="wh-key" className="mb-1.5 block text-sm font-medium text-ink">
              API key
            </label>
            <select
              id="wh-key"
              className="h-(--control-height-lg) w-full rounded-lg bg-surface-sunken px-3 text-sm text-ink"
            >
              {apiKeyNames.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">Events</legend>
            {/* Descriptions kept from production — this is the part that tells the
                user what they are subscribing to instead of making them guess. */}
            <div className="space-y-1">
              {events.map((event) => (
                /* Checkbox is a bare control by design (see its own docs), so the
                   label/description pair is composed here. Wrapping in <label>
                   makes the whole row a hit target, not just the 18px box. */
                <label
                  key={event.value}
                  className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors duration-(--duration-fast) hover:bg-surface-hover"
                >
                  <Checkbox
                    className="mt-0.5"
                    checked={selected.includes(event.value)}
                    onCheckedChange={(checked) =>
                      setSelected((prev) =>
                        checked
                          ? [...prev, event.value]
                          : prev.filter((v) => v !== event.value),
                      )
                    }
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink">
                      {event.label}
                    </span>
                    <span className="block text-sm text-ink-tertiary">
                      {event.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {selected.length === 0 && (
              <p className="mt-2 text-sm text-warning">
                Pick at least one event, or this endpoint will never be called.
              </p>
            )}
          </fieldset>
        </div>

        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary" disabled={selected.length === 0}>
            Create webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export function WebhooksView({
  webhooks,
  events,
  apiKeyNames,
}: {
  webhooks: Webhook[];
  events: { value: WebhookEvent; label: string; description: string }[];
  apiKeyNames: string[];
}) {
  const active = webhooks.filter((w) => w.active).length;
  const avgSuccess =
    webhooks.length > 0
      ? Math.round(webhooks.reduce((s, w) => s + w.successRate, 0) / webhooks.length)
      : 0;

  return (
    <>
      {/* THE WHOLE SUMMARY ROW GOES on a first visit, not just its button. With no
          endpoints it reads "0 endpoints · 0 active · 0% average delivery" — three
          numbers that describe nothing, and a 0% delivery rate that looks like a
          fault rather than an absence. The create action moves into the FirstRun
          panel below with it, so exactly one is ever on screen. */}
      {webhooks.length > 0 ? (
      <div className="anim-rise stagger-2 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* The three stat tiles, collapsed to one honest line. */}
        <p className="text-sm text-ink-secondary">
          <span className="tabular font-semibold text-ink">{webhooks.length}</span>{" "}
          endpoint{webhooks.length === 1 ? "" : "s"} ·{" "}
          <span className="tabular font-semibold text-ink">{active}</span> active ·{" "}
          <span className="tabular font-semibold text-ink">{avgSuccess}%</span> average
          delivery
        </p>
        <CreateWebhookDialog events={events} apiKeyNames={apiKeyNames} />
      </div>
      ) : null}

      {/* The signing secret production is missing. Without it a receiver cannot
          tell a real payload from a forged one. */}
      <Card className="anim-rise stagger-2 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-ink">Signing secret</h2>
            <p className="mt-1 max-w-measure text-sm text-ink-tertiary">
              Every delivery is signed with this secret in the{" "}
              <code className="rounded-xs bg-surface-sunken px-1 font-mono text-code">
                X-Model-Store-Signature
              </code>{" "}
              header. Verify it before trusting a payload. Shown once — rotate if you
              lose it.
            </p>
          </div>
          <Button variant="secondary" size="sm">
            Rotate
          </Button>
        </div>
        <div className="mt-4 max-w-lg">
          <CopyField value="whsec_••••••••••••••••••••••••7f2a" label="Signing secret" />
        </div>
      </Card>

      {webhooks.length === 0 ? (
        <FirstRun
          icon={<WebhookIcon />}
          title="Send run events to your own systems"
          description="model.store POSTs to your endpoint whenever a run starts, completes, or fails — so you never have to poll for a result."
          steps={[
            { title: "Add an endpoint", body: "An HTTPS URL you control." },
            { title: "Pick the events", body: "Start, completion, failure, or all three." },
            { title: "Verify the signature", body: "Every delivery is signed with the secret above." },
          ]}
          /* The same self-contained dialog the toolbar uses, moved rather than
             copied — see below for why only one is ever mounted. */
          action={
            <CreateWebhookDialog events={events} apiKeyNames={apiKeyNames} />
          }
        />
      ) : (
        <Card variant="footerStrip" className="anim-rise stagger-3 overflow-hidden">
          <DataTable>
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell>Name</DataTableHeadCell>
                <DataTableHeadCell>Endpoint</DataTableHeadCell>
                <DataTableHeadCell>API key</DataTableHeadCell>
                <DataTableHeadCell>Events</DataTableHeadCell>
                <DataTableHeadCell>Status</DataTableHeadCell>
                <DataTableHeadCell>Delivery</DataTableHeadCell>
                <DataTableHeadCell>Last triggered</DataTableHeadCell>
                <DataTableHeadCell align="right">Actions</DataTableHeadCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {webhooks.map((hook) => (
                <DataTableRow key={hook.id} muted={!hook.active}>
                  <DataTableCell primary>{hook.name}</DataTableCell>
                  <DataTableCell numeric>
                    <span className="block max-w-56 truncate">{hook.url}</span>
                  </DataTableCell>
                  <DataTableCell meta>{hook.apiKeyName}</DataTableCell>
                  <DataTableCell>
                    <span className="flex flex-wrap gap-1">
                      {hook.events.map((e) => (
                        <Badge key={e} variant="neutral" size="sm">
                          {EVENT_LABEL[e]}
                        </Badge>
                      ))}
                    </span>
                  </DataTableCell>
                  <DataTableCell>
                    <StatusMark
                      status={hook.active ? "success" : "idle"}
                      label={hook.active ? "Active" : "Paused"}
                      showLabel
                    />
                  </DataTableCell>
                  <DataTableCell>
                    {/* Figure plus meter: a degrading endpoint is visible without
                        having to read and compare numbers down the column. */}
                    <span className="flex items-center gap-2">
                      <span className="tabular w-9 font-mono text-xs">
                        {hook.successRate}%
                      </span>
                      <MeterBar
                        value={hook.successRate}
                        tone={
                          hook.successRate >= 95
                            ? "success"
                            : hook.successRate >= 80
                              ? "warning"
                              : "danger"
                        }
                        className="w-14"
                        aria-label={`${hook.name} delivery success rate`}
                      />
                    </span>
                  </DataTableCell>
                  <DataTableCell meta>{hook.lastTriggered ?? "Never"}</DataTableCell>
                  <DataTableCell align="right">
                    <DropdownMenuRoot>
                      <DropdownMenuTrigger
                        aria-label={`Actions for ${hook.name}`}
                        className="grid size-7 place-items-center rounded-sm text-ink-tertiary transition-colors duration-(--duration-fast) hover:bg-surface-hover hover:text-ink"
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Send test event</DropdownMenuItem>
                        <DropdownMenuItem>View delivery log</DropdownMenuItem>
                        <DropdownMenuItem>Edit endpoint</DropdownMenuItem>
                        <DropdownMenuItem>
                          {hook.active ? "Pause" : "Resume"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuRoot>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        </Card>
      )}
    </>
  );
}
