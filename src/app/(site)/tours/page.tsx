// src/app/tours/page.tsx
import ToursPageClient from './tours-page-client';
import { getTourPageHeroContent, getTourPageIntroContent, getSsgTourPageTours, getTourPageTourById } from '@/lib/firebase/firestore';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Our Tours',
    description: 'Browse our collection of expertly curated tours. From cultural heritage explorations to thrilling adventures, Grand Walker Tours offers a journey for every traveler.',
};

async function getTourName(id: string) {
    const tour = await getTourPageTourById(id);
    return tour?.name || 'Tour Details';
}

export default async function ToursPage({ searchParams }: { searchParams: { tourId?: string } }) {
    const { tourId } = searchParams;

    const heroContent = await getTourPageHeroContent();
    const introContent = await getTourPageIntroContent();
    const tours = await getSsgTourPageTours();
    const tourName = tourId ? await getTourName(tourId) : null;
    const tourDetail = tourId ? await getTourPageTourById(tourId) : null;
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ToursPageClient
                heroContent={heroContent}
                introContent={introContent}
                tours={tours}
                initialTourId={tourId}
                initialTourName={tourName}
                initialTourDetail={tourDetail}
            />
        </Suspense>
    );
}
