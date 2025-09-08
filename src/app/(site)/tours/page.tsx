// src/app/tours/page.tsx
import ToursPageClient from './tours-page-client';
import { getTourPageHeroContentSSG, getTourPageIntroContentSSG, getSsgTourPageTours } from '@/lib/firebase/firestore';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Our Tours',
    description: 'Browse our collection of expertly curated Sri Lanka tours. From cultural heritage explorations to thrilling adventures, Grand Walker Tours offers a journey for every traveler.',
};

export default async function ToursPage() {
    const heroContent = await getTourPageHeroContentSSG();
    const introContent = await getTourPageIntroContentSSG();
    const tours = await getSsgTourPageTours() || [];
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ToursPageClient
                heroContent={heroContent}
                introContent={introContent}
                tours={tours}
            />
        </Suspense>
    );
}
