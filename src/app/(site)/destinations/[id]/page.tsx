// src/app/(site)/destinations/[id]/page.tsx
import { getSsgDestinationPageDestinations, getDestinationPageDestinationById } from '@/lib/firebase/firestore';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DestinationDetailView from '@/app/destinations/(components)/destination-detail-view';
import Link from 'next/link';

export const dynamic = 'force-static';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const destination = await getDestinationPageDestinationById(params.id);
 
  if (!destination) {
    return {
      title: 'Destination Not Found',
    }
  }
 
  return {
    title: destination.name,
    description: destination.description,
    openGraph: {
        title: destination.name,
        description: destination.description,
        images: [
            {
                url: destination.image,
                width: 1200,
                height: 630,
                alt: destination.name,
            }
        ]
    }
  }
}

export async function generateStaticParams() {
  const destinations = await getSsgDestinationPageDestinations();
 
  return destinations.map((destination) => ({
    id: destination.id,
  }));
}

export default async function DestinationDetailPage({ params }: { params: { id: string }}) {
  const destination = await getDestinationPageDestinationById(params.id);

  if (!destination) {
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
                   <Link href="/destinations" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                      Our Destinations
                    </Link>
                </div>
              </li>
              <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-muted-foreground">--&gt;</span>
                    <span className="ml-1 text-sm font-medium text-foreground md:ml-2 line-clamp-1">
                      {destination.name}
                    </span>
                  </div>
                </li>
            </ol>
          </nav>
      </div>
      <DestinationDetailView destination={destination} />
    </>
  );
}
