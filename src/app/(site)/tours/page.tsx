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

async function getTourData(tourId?: string) {
    if (!tourId) {
        return { name: null, detail: null };
    }
    const tour = await getTourPageTourById(tourId);
    return {
        name: tour?.name || 'Tour Details',
        detail: tour,
    };
}


export default async function ToursPage({ searchParams }: { searchParams: { tourId?: string } }) {
    const { tourId } = searchParams;

    const heroContent = await getTourPageHeroContent();
    const introContent = await getTourPageIntroContent();
    const tours = await getSsgTourPageTours() || [];
    const { name: tourName, detail: tourDetail } = await getTourData(tourId);
    
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
