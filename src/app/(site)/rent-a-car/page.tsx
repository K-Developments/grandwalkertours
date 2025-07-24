// src/app/(site)/rent-a-car/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Rent a Car',
  description: 'Explore our fleet of vehicles available for rent. Find the perfect car for your journey with Grand Walker Tours.',
}

export default function RentACarPage() {
  return (
    <>
      <section className="relative h-[60vh] w-full bg-black">
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <h1 className="font-headline text-4xl md:text-6xl font-light text-foreground">
                Rent a Car
            </h1>
        </div>
      </section>
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
                  <span className="ml-1 text-sm font-medium text-foreground md:ml-2">Rent a Car</span>
                </div>
              </li>
            </ol>
          </nav>
      </div>
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-light mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            Our vehicle rental services will be available shortly. Please check back later.
          </p>
        </div>
      </section>
    </>
  );
}
