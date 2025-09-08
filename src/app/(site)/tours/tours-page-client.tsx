// src/app/tours/tours-page-client.tsx
'use client';

import Link from 'next/link';
import ToursHero from '@/app/tours/(components)/hero';
import ToursList from '@/app/tours/(components)/tours-list';
import type { Tour, TourPageHeroContent, TourPageIntroContent } from '@/lib/types';

type ToursPageClientProps = {
    heroContent: TourPageHeroContent | null;
    introContent: TourPageIntroContent | null;
    tours: Tour[];
}

export default function ToursPageClient({
    heroContent,
    introContent,
    tours,
}: ToursPageClientProps) {
  
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
                  <span className="ml-1 text-sm font-medium text-foreground md:ml-2">Our Tours</span>
                </div>
              </li>
            </ol>
          </nav>
      </div>
      <ToursList tours={tours} intro={introContent} />
    </>
  );
}
