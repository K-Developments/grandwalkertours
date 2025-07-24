// src/app/destinations/(components)/destination-detail-view.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getDestinationPageDestinationById } from '@/lib/firebase/firestore';
import type { Destination, GalleryImage } from '@/lib/types';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import MotionWrapper from '@/app/(components)/motion-wrapper';
import { motion } from 'framer-motion';

type DestinationDetailViewProps = {
  destinationId: string;
  onBack: () => void;
};

const DestinationDetailView = ({ destinationId, onBack }: DestinationDetailViewProps) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      const destinationData = await getDestinationPageDestinationById(destinationId);
      setDestination(destinationData);
      setLoading(false);
    };
    fetchDestination();
  }, [destinationId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-light">Destination Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested destination could not be found.</p>
        <button onClick={onBack} className="text-primary hover:underline">
          <ArrowLeft className="inline-block mr-2 h-4 w-4" />
          Back to all destinations
        </button>
      </div>
    );
  }

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
            {destination.additionalSections.map((section, index) => (
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
