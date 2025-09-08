// src/app/destinations/page.tsx
import DestinationsPageClient from './destinations-page-client';
import { getDestinationPageHeroContentSSG, getDestinationPageIntroContentSSG, getSsgDestinationPageDestinations } from '@/lib/firebase/firestore';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Our Destinations',
    description: 'Explore breathtaking destinations with Grand Walker Tours. From the cultural heart of Kandy to the pristine beaches of Galle, find your perfect Sri Lankan adventure.',
};

export default async function DestinationsPage() {
    const heroContent = await getDestinationPageHeroContentSSG();
    const introContent = await getDestinationPageIntroContentSSG();
    const destinations = await getSsgDestinationPageDestinations() || [];
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DestinationsPageClient 
                heroContent={heroContent}
                introContent={introContent}
                destinations={destinations}
            />
        </Suspense>
    );
}
