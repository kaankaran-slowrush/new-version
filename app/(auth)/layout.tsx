/* Auth shell: no topbar (there is nothing to navigate to yet) and no page
   padding, so the card can centre in the viewport. The ambient background from
   the root layout still shows through — a login screen is the first impression
   of the product's visual language, so it should not look like a different app. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center px-6 py-12">{children}</div>
  );
}
