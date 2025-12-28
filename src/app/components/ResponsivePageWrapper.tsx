import React from 'react';
import { DesktopLayout } from './DesktopLayout';

interface ResponsivePageWrapperProps {
  currentPage: string;
  isLoggedIn: boolean;
  firstName?: string;
  onNavigate: (page: string) => void;
  isDesktop: boolean;
  children: React.ReactNode;
}

export function ResponsivePageWrapper({ 
  currentPage, 
  isLoggedIn, 
  firstName, 
  onNavigate, 
  isDesktop,
  children 
}: ResponsivePageWrapperProps) {
  // On desktop, always wrap in DesktopLayout
  if (isDesktop) {
    return (
      <DesktopLayout
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
        firstName={firstName}
        onNavigate={onNavigate}
      >
        {children}
      </DesktopLayout>
    );
  }
  
  // On mobile, render children as-is (modals)
  return <>{children}</>;
}
