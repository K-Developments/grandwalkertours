// src/app/tours/(components)/tour-gallery.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import type { GalleryImage } from '@/lib/types';

type TourGalleryProps = {
  images?: GalleryImage[];
};

export default function TourGallery({ images }: TourGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 mb-12 md:mb-24">
      <Carousel 
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="relative h-[60vh] w-full">
                <Image
                  src={image.url}
                  alt={image.hint || 'Tour gallery image'}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  data-ai-hint={image.hint}
                  sizes="100vw"
                  quality={95}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}
