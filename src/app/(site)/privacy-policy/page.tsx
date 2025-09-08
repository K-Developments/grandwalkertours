// src/app/(site)/privacy-policy/page.tsx
import { getPrivacyPolicyContent } from '@/lib/firebase/firestore';
import type { PrivacyPolicyContent } from '@/lib/types';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Read the privacy policy of Grand Walker Tours to understand how we collect, use, and protect your personal information. Your privacy is our priority.',
};

const LegalPageHero = ({ title, image, imageHint }: { title: string, image?: string, imageHint?: string }) => {
  const heroImage = image || 'https://placehold.co/1920x300.png';
  const hint = imageHint || 'legal scales justice';

  return (
    <section className="relative h-[40vh] w-full bg-black">
        <Image
          src={heroImage}
          alt={`${title} page hero image`}
          fill
          className="w-full h-full object-cover opacity-70"
          data-ai-hint={hint}
          priority
          sizes="100vw"
        />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute inset-0 container mx-auto px-4 h-full flex flex-col justify-end pb-8 md:pb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-light text-white">
          {title}
        </h1>
      </div>
    </section>
  )
};

export default async function PrivacyPolicyPage() {
  const content = await getPrivacyPolicyContent();

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
