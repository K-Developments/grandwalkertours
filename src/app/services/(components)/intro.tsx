// src/app/services/(components)/intro.tsx
'use client';

import { useState, useEffect } from 'react';
import { getServicePageIntroContent } from '@/lib/firebase/firestore';
import type { ServicePageIntroContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ServiceIntroSection() {
  const [content, setContent] = useState<ServicePageIntroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getServicePageIntroContent((data) => {
      setContent(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section id="service-intro" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-20 w-full mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (!content) {
    return (
      <section id="service-intro" className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-5xl font-extralight uppercase">Intro Section Not Configured</h2>
          <p>Please configure this section in the admin dashboard.</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="service-intro" 
      className="py-16 md:py-24 bg-background"
    >
       <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-extralight uppercase !text-black">
            {content.title}
          </h2>
          <div className="prose prose-lg mx-auto mt-4 text-muted-foreground">
            <p>{content.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
