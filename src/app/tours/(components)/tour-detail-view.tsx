// src/app/tours/(components)/tour-detail-view.tsx
'use client';

import { useState, useEffect } from 'react';
import { getTourPageTourById } from '@/lib/firebase/firestore';
import type { Tour } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import TourGallery from './tour-gallery';
import TourContent from './tour-content';

type TourDetailViewProps = {
  tourId: string;
  onBack: () => void;
};

export default function TourDetailView({ tourId, onBack }: TourDetailViewProps) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      const tourData = await getTourPageTourById(tourId);
      setTour(tourData);
      setLoading(false);
    };
    fetchTour();
  }, [tourId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-light">Tour Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested tour could not be found.</p>
        <button onClick={onBack} className="text-primary hover:underline">
          &larr; Back to all tours
        </button>
      </div>
    );
  }

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
