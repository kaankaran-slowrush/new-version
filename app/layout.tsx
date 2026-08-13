import type { Metadata } from "next";
import { AmbientBackground } from "@/components/chrome/ambient-background";
import { SpatialBackdrop } from "@/components/chrome/spatial-backdrop";
import { fontVariables } from "./fonts";
import { cn } from "@/lib/cn";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "model.store",
    template: "%s · model.store",
  },
  description:
    "UI kit and component library for model.store — a platform for provisioning AI models and deploying generative-media agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* `suppressHydrationWarning` covers exactly one attribute: `data-theme`, which
       the script below writes before React ever sees the document. The server
       cannot know it, so without this every dim-theme load logs a mismatch. It is
       scoped to <html> and does not extend to any child. */
    <html lang="en" className={cn(fontVariables)} suppressHydrationWarning>
      <head>
        {/*
          THE THEME HAS TO BE ON THE DOCUMENT BEFORE THE FIRST PAINT, and this is
          the only way to do that in an app that also prerenders. A theme applied
          in `useEffect` runs after paint, so a dim-theme user sees a full-brightness
          white flash on every single navigation — the defining bug of hand-rolled
          theme switchers.

          It is `dangerouslySetInnerHTML` because that is how you get a synchronous,
          blocking inline script in the App Router; `next/script` cannot run before
          paint by construction. There is no user input anywhere near it — the
          string is a literal written at build time — so the "dangerously" here is
          about the API's name rather than about this use of it.

          It reads storage, falls back to light, and writes nothing else. It does
          NOT consult `prefers-color-scheme`: see theme-toggle.tsx for why that is a
          product decision rather than a default.
        */}
        <script
          dangerouslySetInnerHTML={{
            /* The three names are duplicated from THEMES in theme-toggle.tsx, and
               they have to be: this runs before any module is evaluated, which is
               the entire reason it is an inline string. An unrecognised stored value
               falls back to light rather than being trusted — the attribute selects
               a whole palette, so a stale or hand-edited localStorage entry must not
               be able to put the document into a theme that no longer exists. */
            __html: `try{var t=localStorage.getItem("model-store-theme");document.documentElement.dataset.theme=t==="dim"||t==="spatial"?t:"light"}catch(e){document.documentElement.dataset.theme="light"}`,
          }}
        />
      </head>
      {/*
        The ambient layer is a real component now rather than two classes on
        <body>, because it stacks three layers (drifting washes, a rotating conic
        wash, grain) that cannot be expressed as one element's background. See its
        own file for why it is CSS rather than WebGL, and why it is not particles.

        Content sits in a positioned wrapper above it — without the stacking
        context the fixed ambient layer would paint over the page.
      */}
      <body className="min-h-dvh">
        {/* Two backdrops, one stacking slot, mutually exclusive by CSS rather than
            by a conditional render — see SpatialBackdrop for why that is what keeps
            the photograph from being downloaded on the other two themes. */}
        <AmbientBackground />
        <SpatialBackdrop />
        <div className="relative z-(--z-base)">{children}</div>
      </body>
    </html>
  );
}
