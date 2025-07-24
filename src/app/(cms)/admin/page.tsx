// src/app/(cms)/admin/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/logo');
  }, [router]);

  return null; // Return null or a loading spinner while redirecting
}
