import React from 'react';

interface DesktopLayoutProps {
  currentPage: string;
  isLoggedIn: boolean;
  firstName?: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export function DesktopLayout({ currentPage, isLoggedIn, firstName, onNavigate, children }: DesktopLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden" dir="rtl">
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}