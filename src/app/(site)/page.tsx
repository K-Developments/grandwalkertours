// src/app/(site)/page.tsx
import type { Metadata } from 'next';
import MotionWrapper from '../(components)/motion-wrapper';
import HeroSlider from '../(components)/hero-slider';
import WelcomeSection from '../homepage-components/welcome-section';
import DestinationsSection from '../homepage-components/destinations-section';
import ToursSection from '../homepage-components/tours-section';
import ServicesSection from '../homepage-components/services-section';
import { getSlidesForPreload, getWelcomeSectionContentSSG, getSsgDestinations, getHomepageSectionTitlesSSG, getSsgTours, getSsgServices } from '@/lib/firebase/firestore';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Grand Walker Tours',
  description: 'Discover breathtaking destinations and curated tours with Grand Walker Tours. Your journey beyond the ordinary begins here. We offer bespoke travel packages, luxury services, and unforgettable experiences.',
};

export default async function Home() {
  const slides = await getSlidesForPreload();
  const welcomeContent = await getWelcomeSectionContentSSG();
  const destinations = await getSsgDestinations();
  const homepageTitles = await getHomepageSectionTitlesSSG();
  const tours = await getSsgTours();
  const services = await getSsgServices();

  return (
    <>
      <HeroSlider slides={slides} />
      <MotionWrapper className="pt-20">
        <WelcomeSection content={welcomeContent} />
      </MotionWrapper>
      <MotionWrapper>
        <DestinationsSection destinations={destinations} titles={homepageTitles} />
      </MotionWrapper>
      <MotionWrapper>
        <ToursSection tours={tours} titles={homepageTitles} />
      </MotionWrapper>
      <MotionWrapper>
        <ServicesSection services={services} titles={homepageTitles} />
      </MotionWrapper>
    </>
  );
}
