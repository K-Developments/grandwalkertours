// src/app/contact/(components)/hero.tsx
'use client';

import Image from 'next/image';
import type { ContactPageHeroContent } from '@/lib/types';
import { motion } from 'framer-motion';

type ContactHeroProps = {
  content: ContactPageHeroContent | null;
}

const ContactHero = ({ content }: ContactHeroProps) => {
  const heroImage = content?.image || 'https://placehold.co/1920x400.png';
  const imageHint = content?.imageHint || 'contact center call';

  return (
    <section className="relative h-[60vh] w-full bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
        <Image
          src={heroImage}
          alt="Contact us background"
          fill
          className="w-full h-full object-cover opacity-80"
          data-ai-hint={imageHint}
          priority
          sizes="100vw"
          quality={95}
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
          Contact Us
        </motion.h1>
      </div>
    </section>
  );
};

export default ContactHero;
