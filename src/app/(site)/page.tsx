// src/app/(site)/page.tsx
import type { Metadata } from 'next';
import MotionWrapper from '../(components)/motion-wrapper';
import HeroSlider from '../(components)/hero-slider';
import WelcomeSection from '../homepage-components/welcome-section';
import DestinationsSection from '../homepage-components/destinations-section';
import ToursSection from '../homepage-components/tours-section';
import ServicesSection from '../homepage-components/services-section';

export const metadata: Metadata = {
  title: 'Grand Walker Tours',
  description: 'Discover breathtaking destinations and curated tours with Grand Walker Tours. Your journey beyond the ordinary begins here. We offer bespoke travel packages, luxury services, and unforgettable experiences.',
};

export default function Home() {
  return (
    <>
      <HeroSlider />
      <MotionWrapper>
        <WelcomeSection />
      </MotionWrapper>
      <MotionWrapper>
        <DestinationsSection />
      </MotionWrapper>
      <MotionWrapper>
        <ToursSection />
      </MotionWrapper>
      <MotionWrapper>
        <ServicesSection />
      </MotionWrapper>
    </>
  );
}
