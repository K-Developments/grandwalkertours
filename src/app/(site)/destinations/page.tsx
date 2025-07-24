// src/app/destinations/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import DestinationsHero from '@/app/destinations/(components)/hero';
import DestinationsList from '@/app/destinations/(components)/destinations-list';
import DestinationDetailView from '@/app/destinations/(components)/destination-detail-view';
import { getDestinationPageDestinationById } from '@/lib/firebase/firestore';

function DestinationsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const destinationId = searchParams.get('destinationId');

  const [destinationName, setDestinationName] = useState<string | null>(null);

  useEffect(() => {
    if (destinationId) {
      getDestinationPageDestinationById(destinationId).then(destination => {
        if (destination) {
          setDestinationName(destination.name);
        } else {
          setDestinationName('Destination Details');
        }
      });
    } else {
      setDestinationName(null);
    }
  }, [destinationId]);


  const handleDestinationSelect = (id: string, name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('destinationId', id);
    router.push(`${pathname}?${params.toString()}`);
    setDestinationName(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    router.push(pathname);
  };
  
  return (
    <>
      <DestinationsHero />
      <div className="container mx-auto px-4 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">--&gt;</span>
                  {destinationId ? (
                      <button onClick={handleBackToList} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                        Our Destinations
                      </button>
                  ) : (
                      <span className="ml-1 text-sm font-medium text-foreground md:ml-2">Our Destinations</span>
                  )}
                </div>
              </li>
                {destinationId && destinationName && (
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-muted-foreground">--&gt;</span>
                    <span className="ml-1 text-sm font-medium text-foreground md:ml-2 line-clamp-1">
                      {destinationName}
                    </span>
                  </div>
                </li>
              )}
            </ol>
          </nav>
      </div>

      {destinationId ? (
        <DestinationDetailView destinationId={destinationId} onBack={handleBackToList} />
      ) : (
        <DestinationsList onDestinationSelect={handleDestinationSelect} />
      )}
    </>
  );
}

export default function DestinationsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DestinationsPageContent />
        </Suspense>
    )
}
