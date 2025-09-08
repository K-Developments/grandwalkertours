// src/app/about/(components)/mission-vision.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MissionVisionContent, AboutSectionTitles } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type MissionVisionSectionProps = {
    content: MissionVisionContent | null;
    titles: AboutSectionTitles | null;
}

const MissionVisionSection = ({ content, titles }: MissionVisionSectionProps) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision'>('mission');

  if (!content) return null;

  const tabs = {
    mission: {
      image: content.missionImage,
      imageHint: content.missionImageHint,
      title: 'Our Mission',
      text: content.missionText,
    },
    vision: {
      image: content.visionImage,
      imageHint: content.visionImageHint,
      title: 'Our Vision',
      text: content.visionText,
    },
  };
  
  const activeContent = tabs[activeTab];
  
  const lineVariants = {
      initial: { height: 0 },
      animate: { height: '40px', transition: { duration: 0.5, ease: 'easeOut' } },
  };


  return (
    <section className="bg-background">
       <div className="text-center mb-8 py-2">
          <h2 className="font-headline text-3xl md:text-4xl font-extralight uppercase text-black">
            {titles?.missionVisionTitle || 'Success Story Behind The Grand Walker Tours'}
            </h2>
        </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch">
          
          {/* Mission Column */}
          <div className="relative h-[400px] lg:h-[600px]">
            <Image 
              src={content.missionImage || 'https://placehold.co/400x600.png'}
              alt="Our Mission"
              fill
              className="object-cover"
              data-ai-hint={content.missionImageHint || 'compass direction'}
              sizes="(max-width: 1024px) 100vw, 33vw"
              quality={95}
            />
            <div className="absolute inset-0 bg-black/20" />
            <button 
                onClick={() => setActiveTab('mission')} 
                className="absolute top-0 left-1/2 -translate-x-1/2 z-10 focus:outline-none p-4"
            >
              <div className="flex flex-col items-center">
                <motion.div 
                    className="w-px bg-white/80"
                    initial="initial"
                    animate={activeTab === 'mission' ? 'animate' : 'initial'}
                    variants={lineVariants}
                 />
                <h3 className={cn(
                  "font-headline text-xl font-light uppercase tracking-wider mt-2 transition-colors",
                  activeTab === 'mission' ? 'text-white' : 'text-white/70'
                )}>
                  Mission
                </h3>
              </div>
            </button>
          </div>
          
          {/* Center Content Column */}
          <div className="text-center lg:text-left h-full flex flex-col justify-center bg-black text-white p-8 md:p-12">
             <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <h2 className="font-headline text-3xl md:text-4xl font-light mb-4">
                      {activeContent.title}
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {activeContent.text}
                    </p>
                </motion.div>
             </AnimatePresence>
          </div>

          {/* Vision Column */}
          <div className="relative h-[400px] lg:h-[600px]">
             <Image 
              src={content.visionImage || 'https://placehold.co/400x600.png'}
              alt="Our Vision"
              fill
              className="object-cover"
              data-ai-hint={content.visionImageHint || 'telescope stars'}
              sizes="(max-width: 1024px) 100vw, 33vw"
              quality={95}
            />
            <div className="absolute inset-0 bg-black/20" />
            <button 
                onClick={() => setActiveTab('vision')} 
                 className="absolute top-0 left-1/2 -translate-x-1/2 z-10 focus:outline-none p-4"
            >
              <div className="flex flex-col items-center">
                <motion.div 
                    className="w-px bg-white/80"
                    initial="initial"
                    animate={activeTab === 'vision' ? 'animate' : 'initial'}
                    variants={lineVariants}
                 />
                <h3 className={cn(
                  "font-headline text-xl font-light uppercase tracking-wider mt-2 transition-colors",
                  activeTab === 'vision' ? 'text-white' : 'text-white/70'
                )}>
                  Vision
                </h3>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
