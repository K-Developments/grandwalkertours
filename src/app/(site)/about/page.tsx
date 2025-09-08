// src/app/about/page.tsx
import MotionWrapper from '../../(components)/motion-wrapper';
import type { Metadata } from 'next';
import AboutHero from '@/app/about/(components)/hero';
import MissionVisionSection from '@/app/about/(components)/mission-vision';
import WhyChooseUsSection from '@/app/about/(components)/why-choose-us';
import TestimonialsSection from '@/app/about/(components)/testimonials';
import Link from 'next/link';
import { getAboutHeroContentSSG, getMissionVisionContentSSG, getAboutSectionTitlesSSG, getSsgWhyChooseUsItems, getSsgTestimonials } from '@/lib/firebase/firestore';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Grand Walker Tours, our mission, our vision, and the team dedicated to creating your dream journeys in Sri Lanka. Discover our passion for travel and commitment to excellence.',
}

export default async function AboutPage() {
  const heroContent = await getAboutHeroContentSSG();
  const missionVisionContent = await getMissionVisionContentSSG();
  const sectionTitles = await getAboutSectionTitlesSSG();
  const whyChooseUsItems = await getSsgWhyChooseUsItems();
  const testimonials = await getSsgTestimonials();

  return (
    <>
      <AboutHero content={heroContent} />
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
        <MissionVisionSection content={missionVisionContent} titles={sectionTitles} />
      </MotionWrapper>
      <WhyChooseUsSection items={whyChooseUsItems || []} titles={sectionTitles} />
      <MotionWrapper>
        <TestimonialsSection testimonials={testimonials || []} titles={sectionTitles} />
      </MotionWrapper>
    </>
  );
}
