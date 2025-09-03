import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - CodeArena',
  description: 'Login or create your CodeArena account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout ">
      {children}
    </div>
  );
}
