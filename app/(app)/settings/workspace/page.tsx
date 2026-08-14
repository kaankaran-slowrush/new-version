import { Crown, Mail, Plus } from "lucide-react";
import { Avatar, Badge, Button, Input, Separator, Switch } from "@/components/primitives";
import { Card, SectionHeader } from "@/components/patterns";
import { WORKSPACE } from "@/lib/mock/sessions";

export const metadata = { title: "Workspace" };

const MEMBERS = [
  { name: "kaankaran", email: "kaankaran@slowrush.com", role: "Owner", initials: "KA" },
  { name: "Deniz Yılmaz", email: "deniz@slowrush.com", role: "Admin", initials: "DY" },
  { name: "Mert Aksoy", email: "mert@slowrush.com", role: "Member", initials: "MA" },
];

const PENDING = [{ email: "ayse@slowrush.com", role: "Member", sent: "2 days ago" }];

/* UX NOTES
   • ROLE IS A SELECT, NOT A MENU BURIED IN A ⋯. Changing someone's permissions is
     a routine admin task; making it a two-step discovery hurts the common case.
   • THE OWNER ROW CANNOT BE EDITED and says so in place, rather than presenting a
     control that silently fails.
   • Pending invites are a separate list from members. Merging them makes "who
     actually has access" unanswerable at a glance. */
export default function WorkspaceSettingsPage() {
  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Settings"
        title="Workspace"
        description="Name, members, and defaults for this workspace."
      />

      {/* The section cards fill the column; the FIELDS inside them are what carry a
          measure — every Input here is already `max-w-sm`. This wrapper used to be
          `max-w-3xl`, which pinned the whole page to 768px inside a 1328px column and
          left 40% of the width empty. Constrain the input, not the panel. */}
      <div className="space-y-6">
        <Card className="anim-rise stagger-2">
          <SectionHeader level={3} as="h2" title="General" />
          <div className="space-y-4">
            <div>
              <label htmlFor="ws-name" className="mb-1.5 block text-sm font-medium text-ink">
                Workspace name
              </label>
              <Input id="ws-name" defaultValue={WORKSPACE.name} className="max-w-sm" />
            </div>
            <Separator />
            <Switch
              defaultChecked
              label="Require approval for spend over $50"
              description="Runs above this amount wait for an owner or admin to approve them."
            />
            <Switch
              label="Share new sessions with the workspace by default"
              description="Off means new sessions start private, which is the safer default for client work."
            />
          </div>
        </Card>

        <Card className="anim-rise stagger-3">
          <SectionHeader
            level={3}
            as="h2"
            title="Members"
            description={`${MEMBERS.length} with access · ${PENDING.length} invited`}
            action={
              <Button variant="secondary" size="md" startIcon={<Plus />}>
                Invite member
              </Button>
            }
          />

          <ul className="divide-y divide-line-inner">
            {MEMBERS.map((member) => {
              const isOwner = member.role === "Owner";
              return (
                <li key={member.email} className="flex items-center gap-3 py-3">
                  <Avatar name={member.name} initials={member.initials} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{member.name}</p>
                    <p className="truncate text-sm text-ink-tertiary">{member.email}</p>
                  </div>
                  {isOwner ? (
                    <Badge variant="warning" size="md">
                      <Crown />
                      Owner
                    </Badge>
                  ) : (
                    <select
                      aria-label={`Role for ${member.name}`}
                      defaultValue={member.role}
                      className="h-(--control-height-sm) rounded-md bg-surface-sunken px-2.5 text-sm text-ink"
                    >
                      <option>Admin</option>
                      <option>Member</option>
                      <option>Viewer</option>
                    </select>
                  )}
                  {!isOwner && (
                    <Button variant="ghost-danger" size="sm">
                      Remove
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>

          {PENDING.length > 0 && (
            <>
              <Separator className="my-4" />
              <p className="mb-2 eyebrow text-ink-tertiary">
                Pending invites
              </p>
              <ul className="space-y-2">
                {PENDING.map((invite) => (
                  <li
                    key={invite.email}
                    className="flex items-center gap-3 rounded-lg bg-surface-sunken px-3 py-2.5"
                  >
                    <Mail className="size-4 shrink-0 text-ink-tertiary" />
                    <span className="min-w-0 flex-1 truncate text-sm text-ink-secondary">
                      {invite.email}
                    </span>
                    <span className="text-sm text-ink-tertiary">
                      sent {invite.sent}
                    </span>
                    <Button variant="ghost" size="sm">
                      Resend
                    </Button>
                    <Button variant="ghost-danger" size="sm">
                      Cancel
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
