import Link from "next/link";
import { Button, Input, Separator } from "@/components/primitives";
import { GlassPanel, SectionHeader } from "@/components/patterns";

export const metadata = { title: "Sign in" };

/* UX NOTES
   • GLASS IS LEGITIMATE HERE. An auth card is persistent chrome over a backdrop we
     control (the ambient wash), which is exactly the case the .glass utility is
     for — and its barrier layer keeps the form labels readable.
   • SSO FIRST. In a B2B tool most people arrive through their identity provider;
     putting email/password above it makes the majority take the long route.
   • NO "FORGOT PASSWORD?" HIDDEN IN SMALL PRINT — it sits beside the field label,
     which is where someone looks the moment the password fails. */
export default function LoginPage() {
  return (
    <GlassPanel className="w-full max-w-100 rounded-3xl p-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-baseline font-mono text-lg tracking-mono"
      >
        model<span className="font-semibold text-accent-ink">.store</span>
      </Link>

      {/* level 2, as h1: the outline wants a page title here — there is one
          form on the screen — but a 34px serif over a 320px card is absurd.
          The tier and the outline level legitimately disagree. */}
      <SectionHeader
        level={2}
        as="h1"
        title="Sign in"
        description="Use your work account to reach your workspace."
      />

      <div className="space-y-2.5">
        <Button variant="secondary" size="lg" fullWidth>
          Continue with Google
        </Button>
        <Button variant="secondary" size="lg" fullWidth>
          Continue with SSO
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <Separator />
        <span className="shrink-0 eyebrow text-ink-tertiary">
          or
        </span>
        <Separator />
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Work email
          </label>
          <Input id="email" type="email" placeholder="you@company.com" size="lg" />
        </div>
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <Link href="#" className="text-sm text-accent-ink hover:underline">
              Forgot?
            </Link>
          </div>
          <Input id="password" type="password" size="lg" />
        </div>
        <Button variant="primary" size="lg" fullWidth>
          Sign in
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-ink-secondary">
        No account yet?{" "}
        <Link href="/signup" className="font-medium text-accent-ink hover:underline">
          Create one
        </Link>
      </p>
    </GlassPanel>
  );
}
