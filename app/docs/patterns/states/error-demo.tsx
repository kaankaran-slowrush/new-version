"use client";

/* =============================================================================
   Client specimens for /docs/patterns/states
   =============================================================================
   ErrorState makes `onRetry` AND `onSecondary` required props, and a server
   component cannot pass a function across the boundary. That is not an
   inconvenience to work around — it is the API refusing to let a dead-end error
   be expressed. So the specimens live in a client file, which is exactly what a
   real caller would be.
   ============================================================================= */

import { WifiOff } from "lucide-react";
import { ErrorState } from "@/components/patterns";

const noop = () => {};

export function ErrorStateDemo() {
  return (
    <ErrorState
      title="Generation failed"
      message="The model timed out after 30s. Video jobs at 1080p regularly exceed this ceiling — a shorter clip or the 720p preset will usually complete."
      detail="req_8f21c04a9b · 504 gateway_timeout · kling-v2-master · eu-west-1"
      onRetry={noop}
      onSecondary={noop}
    />
  );
}

export function ErrorStateSizesDemo() {
  return (
    <div className="grid w-full gap-3">
      <ErrorState
        size="sm"
        title="Webhook delivery failed"
        message="Three attempts, all refused by your endpoint."
        onRetry={noop}
        retryLabel="Redeliver"
        onSecondary={noop}
        secondaryLabel="Edit endpoint"
      />
      <ErrorState
        size="md"
        surface="tint"
        icon={<WifiOff className="size-4" strokeWidth={2.25} />}
        title="You are offline"
        message="The run is queued locally and will be sent when the connection returns."
        onRetry={noop}
        retryLabel="Retry now"
        onSecondary={noop}
        secondaryLabel="Work offline"
      />
    </div>
  );
}

export function ErrorStateInCardDemo() {
  return (
    <ErrorState
      size="sm"
      surface="plain"
      title="Could not load usage"
      message="The metrics service returned no data for this window."
      detail="req_2ab7f199"
      onRetry={noop}
      onSecondary={noop}
      secondaryLabel="Change window"
    />
  );
}
