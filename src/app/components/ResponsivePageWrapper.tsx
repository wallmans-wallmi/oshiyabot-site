import React from 'react';
import { DesktopLayout } from './DesktopLayout';

interface ResponsivePageWrapperProps {
  isDesktop: boolean;
  children: React.ReactNode;
}

export function ResponsivePageWrapper({ 
  isDesktop,
  children 
}: ResponsivePageWrapperProps) {
  // On desktop, always wrap in DesktopLayout
  if (isDesktop) {
    return (
        <DesktopLayout>
          {children}
        </DesktopLayout>
    );
  }
  
  // On mobile, render children as-is (modals)
  return <>{children}</>;
}
