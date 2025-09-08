// src/app/tours/(components)/tour-detail-view.tsx
'use client';

import type { Tour } from '@/lib/types';
import TourGallery from './tour-gallery';
import TourContent from './tour-content';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type TourDetailViewProps = {
  tour: Tour;
};

export default function TourDetailView({ tour }: TourDetailViewProps) {
  return (
    <div>
      <h1 className="font-headline text-4xl md:text-6xl font-light text-center my-8 md:my-12">
        {tour.name}
      </h1>
      <TourGallery images={tour.gallery} />
      <TourContent tour={tour} />
       <div className="text-center my-12">
        <Button variant="outline" asChild>
            <Link href="/tours">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all tours
            </Link>
        </Button>
      </div>
    </div>
  );
}
