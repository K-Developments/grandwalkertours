// src/app/(components)/hero-slider.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import type { HeroSlide } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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
    // Initialize autoplay only once
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
        // Reset the autoplay plugin
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
        <div className="text-center text-muted-foreground">
          <h2 className="text-2xl font-bold">No slides available.</h2>
          <p>Please add slides in the admin dashboard.</p>
        </div>
      </section>
    );
  }

  const currentSlide = slides[current];

  return (
    <section 
      id="home" 
      className="relative h-[80vh] md:h-screen w-full overflow-hidden"
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

          {/* Background Images & Content */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Bottom Content Container */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="container mx-auto px-4 py-8 md:py-12 flex justify-end">
          <div className="w-full md:max-w-[50%] lg:max-w-[40%] text-right">
            <AnimatePresence mode="wait">
              <motion.div 
                key={current}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className=" text-white "
              >
                <div className="overflow-hidden">
                  <motion.h1 
                    className="font-headline font-light text-white hero-headline-right tracking-tight"
                    variants={slideFromRight}
                  >
                    {currentSlide?.headline}
                  </motion.h1>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
       {/* Mobile Pagination */}
      <div className="absolute bottom-0 left-0 right-0 md:hidden bg-[#FAFAFA] p-4">
        <div className="flex justify-center items-center gap-3">
            {slides.map((_, index) => (
                <Button
                    key={index}
                    size="icon"
                    variant="ghost"
                    className={cn(
                        "h-2 w-2 rounded-full p-0",
                        current === index ? "bg-primary" : "bg-primary/20"
                    )}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
       </div>

      {/* Scroll Down Indicator */}
      {!showVideo && (
        <a 
          href="#welcome" 
          aria-label="Scroll to next section" 
          className="absolute bottom-24 md:bottom-8 right-8 z-20 opacity-70 hover:opacity-100 transition-opacity hidden md:block"
        >
          <div className="w-8 h-16 text-white">
            <svg width="100%" height="100%" viewBox="0 0 24 64">
              <motion.path
                d="M 12 0 V 60 L 18 54 M 12 60 L 6 54"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
              />
            </svg>
          </div>
        </a>
      )}
    </section>
  );
}
