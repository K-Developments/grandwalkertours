// src/app/(site)/tours/[id]/page.tsx
import { getSsgTourPageTours, getTourPageTourById } from '@/lib/firebase/firestore';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TourDetailView from '@/app/tours/(components)/tour-detail-view';
import Link from 'next/link';

export const dynamic = 'force-static';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tour = await getTourPageTourById(params.id);
 
  if (!tour) {
    return {
      title: 'Tour Not Found',
    }
  }
 
  return {
    title: tour.name,
    description: tour.description,
    openGraph: {
        title: tour.name,
        description: tour.description,
        images: [
            {
                url: tour.image,
                width: 1200,
                height: 630,
                alt: tour.name,
            }
        ]
    }
  }
}

export async function generateStaticParams() {
  const tours = await getSsgTourPageTours();
 
  return tours.map((tour) => ({
    id: tour.id,
  }));
}

export default async function TourDetailPage({ params }: { params: { id: string }}) {
  const tour = await getTourPageTourById(params.id);

  if (!tour) {
    notFound();
  }

  return (
    <>
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
                   <Link href="/tours" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                      Our Tours
                    </Link>
                </div>
              </li>
              <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-muted-foreground">--&gt;</span>
                    <span className="ml-1 text-sm font-medium text-foreground md:ml-2 line-clamp-1">
                      {tour.name}
                    </span>
                  </div>
                </li>
            </ol>
          </nav>
      </div>
      <TourDetailView tour={tour} />
    </>
  );
}
