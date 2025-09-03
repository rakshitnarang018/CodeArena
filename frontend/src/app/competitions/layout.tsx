// /app/competitions/layout.tsx
import React from 'react';

interface CompetitionsLayoutProps {
  children: React.ReactNode;
}

const CompetitionsLayout = ({ children }: CompetitionsLayoutProps) => {
  return (
    <div
      style={{
        paddingTop: '64px', // Adjust this to match your global header height
        paddingLeft: '24px',
        paddingRight: '24px',
        minHeight: '100vh',
        backgroundColor: '#1e1e2f', // Optional: to match your page's purple/dark theme
        color: '#fff',
      }}
    >
      {children}
    </div>
  );
};

export default CompetitionsLayout;
