// src/app/homepage-components/welcome-section.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getWelcomeSectionContent } from '@/lib/firebase/firestore';
import type { WelcomeSectionContent as WelcomeSectionContentType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const isValidUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    // A simple check is sufficient here to avoid crashes from malformed strings.
    return url.startsWith('http://') || url.startsWith('https://');
  } catch (_) {
    return false;
  }
};

const WelcomePart = ({
  headline,
  description,
  image,
  imageHint,
  buttonText,
  buttonLink,
  imagePosition = 'right',
}: {
  headline?: string;
  description?: string;
  image?: string;
  imageHint?: string;
  buttonText?: string;
  buttonLink?: string;
  imagePosition?: 'left' | 'right';
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  if (!headline && !description && !image) {
    return null;
  }
  
  const showImage = isValidUrl(image);
  const imageOrderClass = imagePosition === 'right' ? 'md:order-2' : 'md:order-1';
  const contentOrderClass = imagePosition === 'right' ? 'md:order-1' : 'md:order-2';

  return (
     <section 
      ref={sectionRef}
      className="flex flex-col md:flex-row bg-background text-foreground overflow-hidden"
    >
        {/* Content Column */}
        <div className={`w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 ${contentOrderClass}`}>
            <div className="max-w-md text-center md:text-left">
                 <h2 className="font-headline text-[2.5rem]  md:text-5xl font-extralight uppercase text-black" style={{ lineHeight: '3rem'}}>
                    {headline}
                </h2>
                <p className="mt-4 text-base md:text-lg text-muted-foreground">
                    {description}
                </p>
                {buttonText && buttonLink && (
                    <Button variant="default" className="mt-8" size="lg" asChild>
                    <Link href={buttonLink}>{buttonText}</Link>
                    </Button>
                )}
            </div>
        </div>

        {/* Image Column with Parallax */}
        <div className={`w-full md:w-1/2 h-[70vh] relative order-1 ${imageOrderClass}`}>
            {showImage && image && (
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div style={{ y }} className="relative h-full w-full">
                        <Image
                            src={image}
                            alt={headline || 'Welcome section image'}
                            fill
                            className="object-cover scale-125" // Scale up image to allow for parallax movement
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={100}
                            data-ai-hint={imageHint}
                        />
                    </motion.div>
                    <div className="absolute inset-4 border-2 border-white/80 pointer-events-none"></div>
                </div>
            )}
        </div>
    </section>
  )

}


export default function WelcomeSection() {
  const [content, setContent] = useState<WelcomeSectionContentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getWelcomeSectionContent((data) => {
      setContent(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section id="welcome" className="flex flex-col md:flex-row min-h-[60vh]">
          <div className="w-full md:w-1/2 flex items-center justify-center p-8">
             <div className="w-full max-w-md space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-32" />
             </div>
          </div>
           <div className="w-full md:w-1/2">
             <Skeleton className="h-full w-full min-h-[40vh]" />
          </div>
      </section>
    );
  }

  if (!content) {
     return (
      <section id="welcome" className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-5xl font-extralight uppercase">Welcome Section Not Configured</h2>
          <p>Please configure the welcome section in the admin dashboard.</p>
        </div>
      </section>
    );
  }
  
  return (
    <div id="welcome">
      <WelcomePart 
        headline={content.headline}
        description={content.description}
        image={content.image}
        imageHint={content.imageHint}
        buttonText={content.buttonText}
        buttonLink={content.buttonLink}
        imagePosition="right"
      />
      <WelcomePart
        headline={content.headline2}
        description={content.description2}
        image={content.image2}
        imageHint={content.imageHint2}
        buttonText={content.buttonText2}
        buttonLink={content.buttonLink2}
        imagePosition="left"
      />
    </div>
  );
};
