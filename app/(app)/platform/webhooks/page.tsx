import { SectionHeader } from "@/components/patterns";
import { WebhooksView } from "./webhooks-view";
import { API_KEY_NAMES, WEBHOOKS, WEBHOOK_EVENTS } from "@/lib/mock/platform";

export const metadata = { title: "Webhooks" };

export default function WebhooksPage() {
  return (
    <main className="mx-auto max-w-(--page-max-width) px-6 pb-24 lg:px-8">
      <SectionHeader
        level={1}
        className="anim-rise stagger-1"
        eyebrow="Platform"
        title="Webhooks"
        description="Receive real-time notifications when a model starts, completes, or fails."
      />
      <WebhooksView
        webhooks={WEBHOOKS}
        events={WEBHOOK_EVENTS}
        apiKeyNames={API_KEY_NAMES}
      />
    </main>
  );
}
