/* =============================================================================
   Primitives barrel
   =============================================================================
   Generic, product-agnostic building blocks. Nothing here knows what
   model.store is — that lives in components/app/.

   Base UI wrappers export their parts individually (DialogRoot, DialogContent,
   …) rather than as a namespace object, so tree-shaking stays effective and a
   consumer can copy a single part into their own repo without dragging the rest.
   ============================================================================= */

export * from "./accordion";
export * from "./avatar";
export * from "./badge";
export * from "./button";
/* Sourced from the non-client module so SERVER components can apply button
   styling to a Link. See the comment in button-variants.ts. */
export * from "./button-variants";
export * from "./checkbox";
export * from "./dialog";
export * from "./dropdown-menu";
export * from "./field";
export { Icon, type IconProps } from "./icon";
export * from "./input";
export * from "./pill";
export * from "./popover";
export * from "./radio-group";
export * from "./segmented-control";
export * from "./select";
export * from "./separator";
export * from "./skeleton";
export * from "./slider";
export * from "./switch";
export * from "./tabs";
export * from "./textarea";
export * from "./tooltip";
