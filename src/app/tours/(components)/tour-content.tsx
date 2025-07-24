// src/app/tours/(components)/tour-content.tsx
'use client';

import type { Tour } from '@/lib/types';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import MotionWrapper from '@/app/(components)/motion-wrapper';

type TourContentProps = {
  tour: Tour;
};

export default function TourContent({ tour }: TourContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Detailed Description */}
      {tour.detailedDescription && (
        <section className="max-w-4xl mx-auto mb-16 md:mb-24">
           <div
            className="prose lg:prose-xl max-w-none text-muted-foreground break-words"
            dangerouslySetInnerHTML={{ __html: tour.detailedDescription }}
          />
        </section>
      )}

      {/* Additional Sections */}
      {tour.additionalSections && tour.additionalSections.length > 0 && (
        <div className="space-y-16 md:space-y-24">
          {tour.additionalSections.map((section, index) => (
            <MotionWrapper key={section.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16">
                 <div className="relative w-full h-[350px] md:h-[500px]">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover w-full h-full rounded-lg shadow-md"
                      data-ai-hint={section.imageHint}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={95}
                    />
                 </div>
                 <div className="text-foreground p-8 md:p-0 z-10 text-center md:text-left">
                    <h3 className="font-headline text-3xl font-light mb-4">{section.title}</h3>
                    <Separator className="my-4" />
                    <p className="text-muted-foreground whitespace-pre-line">{section.description}</p>
                 </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      )}
    </div>
  );
}
