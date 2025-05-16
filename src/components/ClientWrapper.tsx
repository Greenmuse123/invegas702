'use client';

import React from 'react';
import { Navigation } from './layout/Navigation';
import { RootProviders } from './Providers';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <RootProviders>
      <Navigation />
      {children}
    </RootProviders>
  );
} 