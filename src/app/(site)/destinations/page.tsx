// src/app/destinations/page.tsx
import DestinationsPageClient from './destinations-page-client';
import { getDestinationPageHeroContentSSG, getDestinationPageIntroContentSSG, getSsgDestinationPageDestinations, getDestinationPageDestinationById } from '@/lib/firebase/firestore';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Our Destinations',
    description: 'Explore breathtaking destinations with Grand Walker Tours. From the cultural heart of Kandy to the pristine beaches of Galle, find your perfect Sri Lankan adventure.',
};

async function getDestinationData(destinationId?: string) {
    if (!destinationId) {
        return { name: null, detail: null };
    }
    const destination = await getDestinationPageDestinationById(destinationId);
    return {
        name: destination?.name || 'Destination Details',
        detail: destination,
    };
}

export default async function DestinationsPage({ searchParams }: { searchParams: { destinationId?: string } }) {
    const { destinationId } = searchParams;

    // Await all data fetching promises
    const heroContent = await getDestinationPageHeroContentSSG();
    const introContent = await getDestinationPageIntroContentSSG();
    const destinations = await getSsgDestinationPageDestinations() || [];
    const { name: destinationName, detail: destinationDetail } = await getDestinationData(destinationId);
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DestinationsPageClient 
                heroContent={heroContent}
                introContent={introContent}
                destinations={destinations}
                initialDestinationId={destinationId}
                initialDestinationName={destinationName}
                initialDestinationDetail={destinationDetail}
            />
        </Suspense>
    );
}
