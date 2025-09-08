// src/app/(components)/hero-slider.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import type { HeroSlide } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.2, 
      delayChildren: 0.1,
    },
  },
};

const slideFromLeft = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { 
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.6, 0.01, 0.05, 0.95] } 
  },
};

const slideFromRight = {
  hidden: { x: "100%", opacity: 0 },
  visible: { 
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.6, 0.01, 0.05, 0.95] } 
  },
};

const imageVariants = {
    initial: { opacity: 0 },
    animate: { 
        opacity: 1, 
        transition: { duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95] } 
    },
    exit: { 
        opacity: 0,
        transition: { duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95] }
    },
};

type HeroSliderProps = {
  slides: HeroSlide[];
};

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof Autoplay> | null>(null);

  const introVideoUrl = slides.length > 0 && slides[0].videoUrl ? slides[0].videoUrl : null;

  useEffect(() => {
    autoplayRef.current = Autoplay({ delay: 5000, stopOnInteraction: true });
    
    const firstSlideHasVideo = slides.length > 0 && !!slides[0].videoUrl;
    setShowVideo(firstSlideHasVideo);
  }, [slides]);
  
  useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap());
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);
    
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!showVideo && api && autoplayRef.current) {
      try {
        api.reInit({ plugins: [autoplayRef.current] });
      } catch (e) {
        console.warn("Autoplay initialization failed", e);
      }
    }
  }, [showVideo, api]);

  const handleVideoEnd = () => {
    setShowVideo(false);
    if (api && autoplayRef.current) {
      api.reInit({ plugins: [autoplayRef.current] });
    }
  };
  
  const handleVideoError = () => {
    console.warn("Video failed to load, falling back to image slider.");
    setShowVideo(false);
    if (api && autoplayRef.current) {
      api.reInit({ plugins: [autoplayRef.current] });
    }
  };

  if (slides.length === 0) {
    return (
      <section className="relative h-[60vh] md:h-screen w-full flex items-center justify-center bg-muted">
        <div className="text-center text-foreground">
          <h2 className="text-2xl font-bold">No slides available.</h2>
          <p>Please add slides in the admin dashboard.</p>
        </div>
      </section>
    );
  }

  const currentSlide = slides[current];

  return (
    <>
    <section 
      id="home" 
      className="relative h-[50vh] md:h-screen w-full overflow-hidden"
    >
      {showVideo && introVideoUrl ? (
        <video
          src={introVideoUrl}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <Carousel 
              setApi={setApi}
              className="w-full h-full"
              plugins={autoplayRef.current ? [autoplayRef.current] : []}
              opts={{ align: "start", loop: true }}
          >
              <CarouselContent>
                  {slides.map((slide) => (
                    <CarouselItem key={slide.id}></CarouselItem>
                  ))}
              </CarouselContent>
          </Carousel>

          <AnimatePresence>
            {currentSlide && (
                <motion.div
                    key={current}
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={currentSlide.image}
                        alt={currentSlide.headline}
                        fill
                        className="w-full h-full object-cover"
                        priority
                        data-ai-hint={currentSlide.imageHint}
                        sizes="100vw"
                        quality={95}
                    />
                    <div className="absolute inset-0 bg-black/30 z-10" />
                </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="container mx-auto px-4 py-8 flex justify-end">
           <AnimatePresence mode="wait">
              <motion.div 
                key={current}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="w-full md:w-1/2 text-right"
              >
                  <div className="overflow-hidden">
                    <motion.h1 
                        className="font-headline font-light text-white hero-headline-right"
                        variants={slideFromRight}
                    >
                        {currentSlide?.headline}
                    </motion.h1>
                  </div>
              </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </section>

    <div className="bg-[#FAFAFA] py-4 md:hidden">
        <div className="container mx-auto px-4 flex justify-center items-center gap-4">
            {slides.map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                        "h-2.5 w-2.5 rounded-full transition-colors",
                        index === current ? "bg-primary" : "bg-muted-foreground/50"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    </div>
    </>
  );
}
