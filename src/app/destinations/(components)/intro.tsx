// src/app/destinations/(components)/intro.tsx
'use client';

import { useState, useEffect } from 'react';
import { getDestinationPageIntroContent } from '@/lib/firebase/firestore';
import type { DestinationPageIntroContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import MotionWrapper from '@/app/(components)/motion-wrapper';

export default function DestinationIntroSection() {
  const [content, setContent] = useState<DestinationPageIntroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getDestinationPageIntroContent((data) => {
      setContent(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
        </div>
      </section>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <section 
      id="destination-intro" 
      className="py-16 md:py-24 bg-background"
    >
       <div className="container mx-auto px-4">
        <MotionWrapper className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-extralight uppercase !text-black">
            {content.title}
          </h2>
        </MotionWrapper>
      </div>
    </section>
  );
};
