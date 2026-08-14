import type { Metadata } from "next";
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
    /* NO `suppressHydrationWarning`, NO BLOCKING SCRIPT, AND NO `data-theme`.
       All three existed to solve the same problem — a theme chosen at runtime is
       not known to the server, so it has to be stamped onto <html> before first
       paint or every load flashes the wrong palette. There is one design language
       now, so the server already knows what the page looks like and the whole
       mechanism is gone rather than simplified.

       If a second language is ever added, the script comes back and this comment
       is the record of what it was for: `useEffect` runs after paint, so a theme
       applied there produces a full-brightness flash on every navigation, which is
       the defining bug of hand-rolled theme switchers. */
    <html lang="en" className={cn(fontVariables)}>
      {/*
        The backdrop is a real component rather than a class on <body> because it
        stacks two layers — the photograph and the black cap that pins its peak
        luminance — and because keeping the cap adjacent to the image is what stops
        anyone separating them. See its own file.

        Content sits in a positioned wrapper above it: without the stacking context
        the fixed backdrop would paint over the page.
      */}
      <body className="min-h-dvh">
        <SpatialBackdrop />
        <div className="relative z-(--z-base)">{children}</div>
      </body>
    </html>
  );
}
