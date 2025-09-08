// src/app/homepage-components/services-section.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Service, HomepageSectionTitles } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

type ServicesSectionProps = {
  services: Service[];
  titles: HomepageSectionTitles | null;
}

export default function ServicesSection({ services, titles }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (services.length === 0) {
    return null;
  }
  
  const activeService = services[activeIndex];

  return (
    <section id="services" className="py-16 md:py-24 bg-white text-black">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-headline text-3xl md:text-4xl font-extralight uppercase mb-12">
          {titles?.servicesTitle || 'Plan your journey with our services'}
        </h2>
        
        <div className="relative w-full md:h-[90vh] h-[80vh] text-primary-foreground overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Image
                src={activeService.image}
                alt={activeService.title}
                fill
                className="object-cover"
                sizes="100vw"
                data-ai-hint={activeService.imageHint}
                quality={95}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Navigation */}
          <div className="absolute top-0 left-0 right-0 p-8 md:p-12 z-10 bg-black">
            <div className="container mx-auto px-4">
              <div className="flex justify-center md:justify-start gap-8">
                {services.map((service, index) => (
                  <button 
                    key={service.id}
                    onClick={() => setActiveIndex(index)}
                    className="flex flex-col items-center gap-2 text-center focus:outline-none"
                  >
                    <span className={cn("text-xs md:text-sm uppercase tracking-widest", activeIndex === index ? "text-primary-foreground" : "text-primary-foreground/70")}>{service.title}</span>
                    <motion.div 
                      className="w-full bg-primary-foreground/80"
                      animate={{ height: activeIndex === index ? '3px' : '1px' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 right-0 p-8 md:p-12 z-10">
             <div className="container mx-auto px-4">
               <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="text-right"
                  >
                    <h3 className="font-body uppercase text-3xl md:text-5xl font-light mb-4">{activeService.title}</h3>
                    <Separator className="my-4 bg-primary-foreground w-1/2 ml-auto" />
                    <p className="max-w-md text-base md:text-lg text-primary-foreground/90">{activeService.description}</p>
                  </motion.div>
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
