import Link from "next/link";
import { Check } from "lucide-react";
import { Button, Input, Separator } from "@/components/primitives";
import { GlassPanel, SectionHeader } from "@/components/patterns";

export const metadata = { title: "Create account" };

/* UX NOTES
   • WHAT THEY GET IS LISTED BEFORE THE FORM. A signup form with no statement of
     value asks for effort before offering any, and this product's value (free
     credit, no card) is exactly what removes the hesitation.
   • WORKSPACE NAME IS COLLECTED UP FRONT. It is unavoidable — everything in the
     product is scoped to a workspace — and asking now avoids an interstitial
     "set up your workspace" step immediately after account creation.
   • PASSWORD REQUIREMENTS ARE STATED BEFORE SUBMISSION, not revealed by a
     validation error after. */
export default function SignupPage() {
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
        title="Create your workspace"
        description="Start generating in a couple of minutes."
      />

      <ul className="mb-7 space-y-1.5">
        {[
          "$5 of generation credit to start",
          "No card required",
          "Every model in the catalogue, one API",
        ].map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-ink-secondary">
            <Check className="size-3.5 shrink-0 text-success" />
            {item}
          </li>
        ))}
      </ul>

      <Button variant="secondary" size="lg" fullWidth>
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3">
        <Separator />
        <span className="shrink-0 eyebrow text-ink-tertiary">
          or
        </span>
        <Separator />
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="su-workspace" className="mb-1.5 block text-sm font-medium text-ink">
            Workspace name
          </label>
          <Input id="su-workspace" placeholder="Acme" size="lg" />
        </div>
        <div>
          <label htmlFor="su-email" className="mb-1.5 block text-sm font-medium text-ink">
            Work email
          </label>
          <Input id="su-email" type="email" placeholder="you@company.com" size="lg" />
        </div>
        <div>
          <label htmlFor="su-password" className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <Input id="su-password" type="password" size="lg" />
          <p className="mt-1.5 text-sm text-ink-tertiary">
            At least 12 characters, including a number.
          </p>
        </div>
        <Button variant="primary" size="lg" fullWidth>
          Create workspace
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-tertiary">
        By continuing you agree to the Terms and Privacy Policy.
      </p>
      <p className="mt-4 text-center text-sm text-ink-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent-ink hover:underline">
          Sign in
        </Link>
      </p>
    </GlassPanel>
  );
}
