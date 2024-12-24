'use client';

import { AppProvider } from '../contexts/AppContext';
import { MainLayout } from './MainLayout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AppProvider>
      <MainLayout>{children}</MainLayout>
    </AppProvider>
  );
}
