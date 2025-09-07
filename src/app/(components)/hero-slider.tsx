// src/app/(components)/hero-slider.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { getSlides } from '@/lib/firebase/firestore';
import type { HeroSlide } from '@/lib/types';
import Image from 'next/image';

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

const textSlideUp = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.6, 0.01, 0.05, 0.95] } 
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

export default function HeroSlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof Autoplay> | null>(null);

  const introVideoUrl = slides.length > 0 && slides[0].videoUrl ? slides[0].videoUrl : null;

  useEffect(() => {
    // Initialize autoplay only once
    autoplayRef.current = Autoplay({ delay: 5000, stopOnInteraction: true });
    
    const unsubscribe = getSlides((data) => {
      setSlides(data);
      const firstSlideHasVideo = data.length > 0 && !!data[0].videoUrl;
      setShowVideo(firstSlideHasVideo);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
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

  if (loading) {
    return (
      <section className="relative !h-[50vh] md:h-screen w-full flex items-center justify-center">
        <div className="text-center text-primary">
          <h2 className="text-2xl font-bold">Grand Walker Tours</h2>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-[60vh] md:h-screen w-full flex items-center justify-center">
        <div className="text-center text-black">
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
                    <div className="absolute inset-0  z-10" />
                </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Bottom Content Container */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-transparent">
        <div className="flex justify-center px-4 py-4 md:py-8">
          {/* Content Div - 60% width */}
          <div className="w-full max-w-[60%]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={current}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="grid grid-cols-2 items-center  text-white "
              >
                {/* Left Side - Quote */}
                <div className="overflow-hidden border-r-2 border-white text-white">
                  <motion.div 
                    className="text-right mr-5"
                    variants={slideFromLeft}
                  >
                    <p className="text-sm md:text-base lg:text-lg font-light italic text-white ">
                      "Discover the extraordinary"
                    </p>
                    <p className="text-xs md:text-sm opacity-70 mt-1">
                      - Grand Walker Tours
                    </p>
                  </motion.div>
                </div>

              

                {/* Right Side - Title */}
                <div className="overflow-hidden">
                  <motion.h1 
                    className="font-headline font-light text-xl md:text-3xl lg:text-5xl tracking-tight text-left ml-5"
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

      {/* Scroll Down Indicator */}
      {!showVideo && (
        <a 
          href="#welcome" 
          aria-label="Scroll to next section" 
          className="absolute bottom-4 md:bottom-8 right-8 z-20 opacity-70 hover:opacity-100 transition-opacity"
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