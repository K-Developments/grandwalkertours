// src/app/tours/(components)/tour-detail-view.tsx
'use client';

import type { Tour } from '@/lib/types';
import TourGallery from './tour-gallery';
import TourContent from './tour-content';

type TourDetailViewProps = {
  tour: Tour;
  onBack: () => void;
};

export default function TourDetailView({ tour, onBack }: TourDetailViewProps) {
  return (
    <div>
      <h1 className="font-headline text-4xl md:text-6xl font-light text-center my-8 md:my-12">
        {tour.name}
      </h1>
      <TourGallery images={tour.gallery} />
      <TourContent tour={tour} />
       <div className="text-center my-12">
        <button onClick={onBack} className="text-primary hover:underline font-semibold">
          &larr; Back to all tours
        </button>
      </div>
    </div>
  );
}
