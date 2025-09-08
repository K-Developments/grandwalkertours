// src/app/destinations/page.tsx
import DestinationsPageClient from './destinations-page-client';
import { getDestinationPageHeroContent, getDestinationPageIntroContent, getSsgDestinationPageDestinations, getDestinationPageDestinationById } from '@/lib/firebase/firestore';
import { Suspense } from 'react';

export const dynamic = 'force-static';

async function getDestinationName(id: string) {
    const destination = await getDestinationPageDestinationById(id);
    return destination?.name || 'Destination Details';
}

export default async function DestinationsPage({ searchParams }: { searchParams: { destinationId?: string } }) {
    const { destinationId } = searchParams;

    const heroContent = await getDestinationPageHeroContent();
    const introContent = await getDestinationPageIntroContent();
    const destinations = await getSsgDestinationPageDestinations();
    const destinationName = destinationId ? await getDestinationName(destinationId) : null;
    const destinationDetail = destinationId ? await getDestinationPageDestinationById(destinationId) : null;
    
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
