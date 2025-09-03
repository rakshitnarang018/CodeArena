import React from 'react';
import { Trophy } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">

      {/* Main Content */}
      <main>
        {children}
      </main>

     
    </div>
  );
}