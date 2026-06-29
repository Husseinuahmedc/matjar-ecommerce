/**
 * Auth route group layout.
 * Shared layout for login and register pages.
 * Centers the auth form on the page.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {children}
    </div>
  );
}
