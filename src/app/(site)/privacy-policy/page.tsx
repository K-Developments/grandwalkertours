// src/app/(site)/privacy-policy/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getPrivacyPolicyContent } from '@/lib/firebase/firestore';
import type { PrivacyPolicyContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { motion } from 'framer-motion';

const LegalPageHero = ({ title, image, imageHint }: { title: string, image?: string, imageHint?: string }) => {
  const heroImage = image || 'https://placehold.co/1920x300.png';
  const hint = imageHint || 'legal scales justice';

  return (
    <section className="relative h-[40vh] w-full bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
        <Image
          src={heroImage}
          alt={`${title} page hero image`}
          fill
          className="w-full h-full object-cover opacity-70"
          data-ai-hint={hint}
          priority
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute inset-0 container mx-auto px-4 h-full flex flex-col justify-end pb-8 md:pb-12">
        <motion.h1 
            className="font-headline text-4xl md:text-6xl font-light text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>
      </div>
    </section>
  )
};

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<PrivacyPolicyContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getPrivacyPolicyContent((data) => {
      setContent(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <Skeleton className="h-[40vh] w-full" />
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LegalPageHero title="Privacy Policy" image={content?.heroImage} imageHint={content?.heroImageHint} />
      <div className="bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="prose lg:prose-lg max-w-4xl mx-auto">
            {content?.content ? (
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            ) : (
              <div>
                <h2 className="font-headline font-light">Privacy Policy Not Available</h2>
                <p>
                  The privacy policy has not been configured yet. Please check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
