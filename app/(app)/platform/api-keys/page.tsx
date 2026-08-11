"use client";

import * as React from "react";
import Link from "next/link";
import { KeyRound, Plus, ShieldCheck } from "lucide-react";
import {
  Badge,
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
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
  SectionHeader,
  StatusMark,
  FirstRun,
} from "@/components/patterns";

/* =============================================================================
   API keys
   =============================================================================
   UX NOTES
   --------
   • REVEAL-ONCE IS A DESIGN PROBLEM, NOT JUST A SECURITY ONE. A key the user
     cannot re-read is only acceptable if the interface is emphatic about it at the
     moment of creation. Hence: the secret is shown in a dedicated post-create
     state with an explicit warning, not quietly dropped into a table row.

   • THE "ALL KEYS ENCRYPTED" TRUST LINE LIVES HERE. In production it sat under the
     billing balance figure, where it read as a non-sequitur — it is a claim about
     key storage, so it belongs on the page about keys.

   • LAST-USED IS MORE USEFUL THAN CREATED-AT. The question people bring to this
     page is "can I safely delete this one", and the answer is in last use.
   ============================================================================= */

const KEYS = [
  { id: "k1", name: "landing", prefix: "ms_live_7f2a", created: "12 Jun 2026", lastUsed: "2 hours ago", active: true },
  { id: "k2", name: "production", prefix: "ms_live_b41c", created: "3 Mar 2026", lastUsed: "9 minutes ago", active: true },
  { id: "k3", name: "staging", prefix: "ms_test_9de0", created: "3 Mar 2026", lastUsed: "Never", active: false },
];

export default function ApiKeysPage() {
  const [created, setCreated] = React.useState(false);

  /* ONE "Create key" ON SCREEN, EVER. The trigger lives in the page header once
     there are keys to manage, and inside the FirstRun panel when there are none —
     because on a first visit the panel is where the eye is, and a second identical
     button 600px above it in the header is the "two equal ways forward" that the
     FirstRun doctrine exists to forbid. Hoisting the dialog into a local is what
     lets it move without being written twice. */
  const createKeyDialog = (
          <DialogRoot>
            <DialogTrigger
              render={
                <Button variant="primary" size="md" startIcon={<Plus />}>
                  Create key
                </Button>
              }
            />
            <DialogContent size="md">
              {created ? (
                <>
                  <DialogTitle>Key created</DialogTitle>
                  <DialogDescription>
                    Copy it now — this is the only time it will be shown in full.
                  </DialogDescription>
                  <div className="mt-5">
                    <CopyField
                      value="ms_live_7f2a9c41e0b8d3f6a1c4b7e"
                      label="New API key"
                    />
                  </div>
                  <p className="mt-3 text-sm text-warning">
                    If you lose it you will need to create a new key — it cannot be
                    recovered.
                  </p>
                  <DialogFooter>
                    <Button variant="primary" onClick={() => setCreated(false)}>
                      I&apos;ve saved it
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogTitle>Create API key</DialogTitle>
                  <DialogDescription>
                    Name it after where it will be used, so an unused key is easy to
                    identify later.
                  </DialogDescription>
                  <div className="mt-5">
                    <label
                      htmlFor="key-name"
                      className="mb-1.5 block text-sm font-medium text-ink"
                    >
                      Name
                    </label>
                    <Input id="key-name" placeholder="production-api" />
                  </div>
                  <DialogFooter>
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="primary" onClick={() => setCreated(true)}>
                      Create key
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </DialogRoot>
  );

  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Platform"
        title="API keys"
        description="Keys authenticate requests to the generation API. Treat them like passwords."
        action={KEYS.length > 0 ? createKeyDialog : undefined}
      />

      {/* Relocated from the billing page, where it made no sense. */}
      <Card className="anim-rise stagger-2 mb-6 flex items-start gap-3 p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
        <p className="text-sm text-ink-secondary">
          <span className="font-medium text-ink">All keys are encrypted at rest.</span>{" "}
          We store a hash, not the key itself — which is why a key can only be revealed
          once, at creation.
        </p>
      </Card>

      {/* There was no empty branch here at all, which meant a brand-new workspace
          rendered a six-column table header over nothing — the exact "header over a
          void" the EmptyState doctrine forbids, and the state a fresh account sees
          first. */}
      {KEYS.length === 0 ? (
        <FirstRun
          className="anim-rise stagger-3"
          icon={<KeyRound />}
          title="Create your first API key"
          description="Keys authenticate requests to the generation API. Everything the dashboard can do, a key can do — so treat one like a password."
          steps={[
            { title: "Create a key", body: "Name it after the system that will use it." },
            { title: "Copy it once", body: "We store a hash, so it is revealed a single time." },
            { title: "Send a request", body: "The playground prints a ready-to-paste example." },
          ]}
          action={createKeyDialog}
          secondary={
            <Link href="/playground" className="text-sm text-accent-ink hover:underline">
              See an example request
            </Link>
          }
        />
      ) : (
        <Card variant="footerStrip" className="anim-rise stagger-3 overflow-hidden">
        <DataTable>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>Name</DataTableHeadCell>
              <DataTableHeadCell>Key</DataTableHeadCell>
              <DataTableHeadCell>Status</DataTableHeadCell>
              <DataTableHeadCell>Created</DataTableHeadCell>
              <DataTableHeadCell>Last used</DataTableHeadCell>
              <DataTableHeadCell align="right">Actions</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {KEYS.map((key) => (
              <DataTableRow key={key.id} muted={!key.active}>
                <DataTableCell primary>
                  <span className="inline-flex items-center gap-2">
                    <KeyRound className="size-3.5 text-ink-tertiary" />
                    {key.name}
                  </span>
                </DataTableCell>
                <DataTableCell numeric>{key.prefix}···</DataTableCell>
                <DataTableCell>
                  <StatusMark
                    status={key.active ? "success" : "idle"}
                    label={key.active ? "Active" : "Unused"}
                    showLabel
                  />
                </DataTableCell>
                <DataTableCell meta>{key.created}</DataTableCell>
                <DataTableCell meta>
                  {key.lastUsed === "Never" ? (
                    <Badge variant="warning" size="sm">
                      Never used
                    </Badge>
                  ) : (
                    key.lastUsed
                  )}
                </DataTableCell>
                <DataTableCell align="right">
                  <Button variant="ghost-danger" size="sm">
                    Revoke
                  </Button>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
        </Card>
      )}
    </main>
  );
}
