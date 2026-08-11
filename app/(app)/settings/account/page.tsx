import { Monitor, Smartphone } from "lucide-react";
import { Avatar, Badge, Button, Input, Separator, Switch } from "@/components/primitives";
import { Card, SectionHeader } from "@/components/patterns";
import { WORKSPACE } from "@/lib/mock/sessions";

export const metadata = { title: "Account" };

const SESSIONS = [
  { id: "s1", device: "macOS · Chrome", location: "Istanbul, TR", lastActive: "Active now", current: true, icon: <Monitor /> },
  { id: "s2", device: "iOS · Safari", location: "Istanbul, TR", lastActive: "3 days ago", current: false, icon: <Smartphone /> },
];

/* UX NOTES
   • THE DESTRUCTIVE ZONE IS LAST AND VISUALLY SEPARATED. Delete-account sitting
     next to "change your name" is how accidents happen.
   • ACTIVE SESSIONS ARE LISTED because "am I still logged in somewhere I should
     not be" is a real question, and the current device is marked so revoking
     everything else is not a guess. */
export default function AccountSettingsPage() {
  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Settings"
        title="Account"
        description="Your profile, notification preferences, and signed-in devices."
      />

      <div className="max-w-3xl space-y-6">
        <Card className="anim-rise stagger-2">
          <SectionHeader level={3} as="h2" title="Profile" />
          <div className="mb-5 flex items-center gap-4">
            <Avatar
              name={WORKSPACE.user.name}
              initials={WORKSPACE.user.initials}
              size="lg"
            />
            <Button variant="secondary" size="sm">
              Change avatar
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="acc-name" className="mb-1.5 block text-sm font-medium text-ink">
                Display name
              </label>
              <Input id="acc-name" defaultValue={WORKSPACE.user.name} />
            </div>
            <div>
              <label htmlFor="acc-email" className="mb-1.5 block text-sm font-medium text-ink">
                Email
              </label>
              <Input id="acc-email" type="email" defaultValue="kaankaran@slowrush.com" />
            </div>
          </div>
        </Card>

        <Card className="anim-rise stagger-3">
          <SectionHeader level={3} as="h2" title="Notifications" />
          <div className="space-y-4">
            <Switch
              defaultChecked
              label="Generation finished"
              description="Email me when a long-running video or batch completes."
            />
            <Switch
              defaultChecked
              label="Low balance"
              description="Email me when the workspace balance falls below its threshold."
            />
            <Switch
              label="Weekly usage summary"
              description="A digest of runs and spend across the workspace."
            />
          </div>
        </Card>

        <Card className="anim-rise stagger-4">
          <SectionHeader
            level={3}
            as="h2"
            title="Signed-in devices"
            description="Revoke anything you do not recognise."
          />
          <ul className="divide-y divide-line-inner">
            {SESSIONS.map((session) => (
              <li key={session.id} className="flex items-center gap-3 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-sunken text-ink-secondary [&_svg]:size-4">
                  {session.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-medium text-ink">
                    {session.device}
                    {session.current && (
                      <Badge variant="accent" size="sm">
                        This device
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm text-ink-tertiary">
                    {session.location} · {session.lastActive}
                  </p>
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm">
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>

        {/* Destructive actions, last and fenced off. */}
        <Card
          className="anim-rise stagger-4 border-l-[3px] border-l-danger"
          elevation="xs"
        >
          <SectionHeader
            level={3}
            as="h2"
            title="Delete account"
            description="Permanently removes your account and every session you created. Workspace data owned by other members is unaffected. This cannot be undone."
          />
          <Separator className="mb-4" />
          <Button variant="danger" size="md">
            Delete my account
          </Button>
        </Card>
      </div>
    </main>
  );
}
