/* The /docs sidebar structure.
   Note the deliberate inconsistency with the product: the app has NO sidebar
   (topbar only), but a documentation site is a reference you scan and jump
   around in, which is exactly what a persistent index is for. Different job,
   different navigation. */

export interface DocNavGroup {
  title: string;
  items: { label: string; href: string; note?: string }[];
}

export const DOCS_NAV: DocNavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Porting guide", href: "/docs/porting" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { label: "Color", href: "/docs/foundations/color" },
      { label: "Typography", href: "/docs/foundations/typography" },
      { label: "Spacing & radius", href: "/docs/foundations/spacing" },
      { label: "Elevation & glass", href: "/docs/foundations/elevation" },
      /* Directly after Elevation, not at the end of the group. Spatial is the one
         theme that inverts Elevation's central rule, so it has to be read next to
         it — filed under Motion it would look like an unrelated effect. */
      { label: "Spatial", href: "/docs/foundations/spatial" },
      { label: "Motion", href: "/docs/foundations/motion" },
      { label: "Accessibility", href: "/docs/foundations/accessibility" },
    ],
  },
  {
    title: "Primitives",
    items: [
      { label: "Button", href: "/docs/components/button" },
      { label: "Input & Textarea", href: "/docs/components/input" },
      { label: "Selection controls", href: "/docs/components/selection" },
      { label: "Overlays", href: "/docs/components/overlays" },
      { label: "Navigation & display", href: "/docs/components/display" },
    ],
  },
  {
    title: "Patterns",
    items: [
      { label: "Page & section headers", href: "/docs/patterns/headers" },
      { label: "Card & surfaces", href: "/docs/patterns/card" },
      { label: "Data display", href: "/docs/patterns/data" },
      { label: "Status & progress", href: "/docs/patterns/status" },
      { label: "Micro-visualisation", href: "/docs/patterns/visualization" },
      { label: "Empty & error states", href: "/docs/patterns/states" },
    ],
  },
  {
    title: "Product UX",
    items: [
      { label: "Agent UX doctrine", href: "/docs/ux/agents" },
      { label: "Progressive disclosure", href: "/docs/ux/disclosure" },
      { label: "Chrome & layout", href: "/docs/ux/chrome" },
    ],
  },
];
