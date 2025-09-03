'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const isDashboard = (pathname.includes('/dashboard'));
  const isUnauthorized = (pathname.includes('/unauthorized'));

  useEffect(() => {
    setMounted(true);
  }, []);
  

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  const isAuthPage = pathname?.startsWith('/auth') ?? false;

  return (
    <>
      {!isAuthPage && !isUnauthorized && <Navbar />}
      <main className={isAuthPage || isUnauthorized ? "min-h-screen" : "min-h-screen pt-16"}>
        {isAuthPage ? (
          children
        ) : (
          <div className={`container mx-auto ${isDashboard ? "max-w-full" : "max-w-7xl"} px-4 sm:px-6 lg:px-8`}>
            {children}
          </div>
        )}
      </main>
      {!isAuthPage && !isUnauthorized && !isDashboard && <Footer />}
    </>
  );
}
