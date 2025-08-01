// src/app/about/page.tsx
import MotionWrapper from '../../(components)/motion-wrapper';
import type { Metadata } from 'next';
import AboutHero from '@/app/about/(components)/hero';
import MissionVisionSection from '@/app/about/(components)/mission-vision';
import WhyChooseUsSection from '@/app/about/(components)/why-choose-us';
import TestimonialsSection from '@/app/about/(components)/testimonials';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Grand Walker Tours, our mission, our vision, and the team dedicated to creating your dream journeys. Discover our passion for travel and commitment to excellence.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
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
                  <span className="ml-1 text-sm font-medium text-foreground md:ml-2">About Us</span>
                </div>
              </li>
            </ol>
          </nav>
      </div>
      <MotionWrapper className="py-8 md:py-12">
        <MissionVisionSection />
      </MotionWrapper>
      <WhyChooseUsSection />
      <MotionWrapper>
        <TestimonialsSection />
      </MotionWrapper>
    </>
  );
}
