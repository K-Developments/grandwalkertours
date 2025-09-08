// src/app/tours/tours-page-client.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import ToursHero from '@/app/tours/(components)/hero';
import ToursList from '@/app/tours/(components)/tours-list';
import TourDetailView from '@/app/tours/(components)/tour-detail-view';
import type { Tour, TourPageHeroContent, TourPageIntroContent } from '@/lib/types';

type ToursPageClientProps = {
    heroContent: TourPageHeroContent | null;
    introContent: TourPageIntroContent | null;
    tours: Tour[];
    initialTourId?: string;
    initialTourName?: string | null;
    initialTourDetail?: Tour | null;
}

export default function ToursPageClient({
    heroContent,
    introContent,
    tours,
    initialTourId,
    initialTourName,
    initialTourDetail
}: ToursPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tourId, setTourId] = useState(initialTourId);
  const [tourName, setTourName] = useState(initialTourName);
  const [tourDetail, setTourDetail] = useState(initialTourDetail);

  useEffect(() => {
    setTourId(initialTourId);
    setTourName(initialTourName);
    setTourDetail(initialTourDetail);
  }, [initialTourId, initialTourName, initialTourDetail]);

  const handleTourSelect = (id: string, name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tourId', id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleBackToList = () => {
    router.push(pathname, { scroll: false });
  };
  
  return (
    <>
      <ToursHero content={heroContent} />
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

      {tourId && tourDetail ? (
        <TourDetailView tour={tourDetail} onBack={handleBackToList} />
      ) : (
        <ToursList tours={tours} intro={introContent} onTourSelect={handleTourSelect} />
      )}
    </>
  );
}
