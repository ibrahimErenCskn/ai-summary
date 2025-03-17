'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Client component içinde dynamic import kullanıyoruz
const AppLayout = dynamic(() => import('./AppLayout'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">
    <div className="text-xl">Yükleniyor...</div>
  </div>
});

export default function ClientLayout() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">
      <div className="text-xl">Yükleniyor...</div>
    </div>}>
      <AppLayout />
    </Suspense>
  );
} 