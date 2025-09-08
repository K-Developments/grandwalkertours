// src/app/destinations/destinations-page-client.tsx
'use client';

import Link from 'next/link';
import DestinationsHero from '@/app/destinations/(components)/hero';
import DestinationsList from '@/app/destinations/(components)/destinations-list';
import type { Destination, DestinationPageHeroContent, DestinationPageIntroContent } from '@/lib/types';

type DestinationsPageClientProps = {
    heroContent: DestinationPageHeroContent | null;
    introContent: DestinationPageIntroContent | null;
    destinations: Destination[];
}

export default function DestinationsPageClient({
    heroContent,
    introContent,
    destinations,
}: DestinationsPageClientProps) {
  
  return (
    <>
      <DestinationsHero content={heroContent} />
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
                  <span className="ml-1 text-sm font-medium text-foreground md:ml-2">Our Destinations</span>
                </div>
              </li>
            </ol>
          </nav>
      </div>

      <DestinationsList destinations={destinations} intro={introContent} />
    </>
  );
}
