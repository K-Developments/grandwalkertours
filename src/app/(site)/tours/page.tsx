// src/app/tours/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import ToursHero from '@/app/tours/(components)/hero';
import ToursList from '@/app/tours/(components)/tours-list';
import TourDetailView from '@/app/tours/(components)/tour-detail-view';
import { getTourPageTourById } from '@/lib/firebase/firestore';

function ToursPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tourId = searchParams.get('tourId');

  const [tourName, setTourName] = useState<string | null>(null);

  useEffect(() => {
    if (tourId) {
      getTourPageTourById(tourId).then(tour => {
        if (tour) {
          setTourName(tour.name);
        } else {
          setTourName('Tour Details');
        }
      });
    } else {
      setTourName(null);
    }
  }, [tourId]);


  const handleTourSelect = (id: string, name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tourId', id);
    router.push(`${pathname}?${params.toString()}`);
    setTourName(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    router.push(pathname);
  };
  
  return (
    <>
      <ToursHero />
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
                  {tourId ? (
                      <button onClick={handleBackToList} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                        Our Tours
                      </button>
                  ) : (
                      <span className="ml-1 text-sm font-medium text-foreground md:ml-2">Our Tours</span>
                  )}
                </div>
              </li>
                {tourId && tourName && (
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-muted-foreground">--&gt;</span>
                    <span className="ml-1 text-sm font-medium text-foreground md:ml-2 line-clamp-1">
                      {tourName}
                    </span>
                  </div>
                </li>
              )}
            </ol>
          </nav>
      </div>

      {tourId ? (
        <TourDetailView tourId={tourId} onBack={handleBackToList} />
      ) : (
        <ToursList onTourSelect={handleTourSelect} />
      )}
    </>
  );
}


export default function ToursPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ToursPageContent />
        </Suspense>
    )
}
