
// src/app/services/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import ServicesHero from '@/app/services/(components)/hero';
import ServiceIntroSection from '@/app/services/(components)/intro';
import ServicesList from '@/app/services/(components)/services-list';
import { getServicePageHeroContentSSG, getServicePageIntroContentSSG, getSsgServicePageServices } from '@/lib/firebase/firestore';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore the wide range of bespoke services offered by Grand Walker Tours. From personalized tour planning to luxury accommodations, we cater to every aspect of your journey.',
}

export default async function ServicesPage() {
  const heroContent = await getServicePageHeroContentSSG();
  const introContent = await getServicePageIntroContentSSG();
  const services = await getSsgServicePageServices();

  return (
    <>
      <ServicesHero content={heroContent} />
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
                  <span className="ml-1 text-sm font-medium text-foreground md:ml-2">Our Services</span>
                </div>
              </li>
            </ol>
          </nav>
      </div>
      <ServiceIntroSection content={introContent} />
      <ServicesList services={services || []} />
    </>
  );
}
