// src/app/destinations/(components)/destination-detail-view.tsx
'use client';

import Image from 'next/image';
import type { Destination } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import MotionWrapper from '@/app/(components)/motion-wrapper';
import { motion } from 'framer-motion';

type DestinationDetailViewProps = {
  destination: Destination;
  onBack: () => void;
};

const DestinationDetailView = ({ destination, onBack }: DestinationDetailViewProps) => {
  return (
    <div className="bg-background">
      {/* Hero Image & Title */}
      <section className="relative h-[70vh] w-full bg-black">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover opacity-70"
          data-ai-hint={destination.imageHint}
          priority
          sizes="100vw"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1 
            className="font-headline text-5xl md:text-8xl font-light text-white text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {destination.name}
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Detailed Description */}
        {destination.detailedDescription && (
          <section className="max-w-4xl mx-auto mb-16 md:mb-24">
             <div
              className="prose lg:prose-xl max-w-none text-muted-foreground break-words"
              dangerouslySetInnerHTML={{ __html: destination.detailedDescription }}
            />
          </section>
        )}

        {/* Gallery */}
        {destination.gallery && destination.gallery.length > 0 && (
          <section className="mb-16 md:mb-24">
             <h2 className="text-center font-headline text-3xl md:text-4xl font-light mb-8">Gallery</h2>
             <Carousel opts={{ align: 'start', loop: true }} className="w-full">
              <CarouselContent>
                {destination.gallery.map((image) => (
                  <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <div className="relative aspect-square w-full">
                        <Image
                          src={image.url}
                          alt={image.hint || 'Destination gallery image'}
                          fill
                          className="object-cover rounded-lg shadow-lg"
                          data-ai-hint={image.hint}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          quality={95}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-14" />
              <CarouselNext className="mr-14" />
            </Carousel>
          </section>
        )}
        
        {/* Additional Sections */}
        {destination.additionalSections && destination.additionalSections.length > 0 && (
            <div className="space-y-16 md:space-y-24">
            {destination.additionalSections.map((section) => (
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
                        <p className="text-muted-foreground whitespace-pre-line">{section.description}</p>
                    </div>
                </div>
                </MotionWrapper>
            ))}
            </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-16 md:mt-24">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Destinations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailView;
