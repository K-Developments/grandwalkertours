// src/app/(site)/cookie-policy/page.tsx
import type { Metadata } from 'next';
import { getCookiePolicyContent } from '@/lib/firebase/firestore';
import Image from 'next/image';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Learn how Grand Walker Tours uses cookies to understand website traffic and improve your browsing experience. We respect your privacy and do not collect personal data.',
};

const LegalPageHero = ({ title, image, imageHint }: { title: string, image?: string, imageHint?: string }) => {
  const heroImage = image || 'https://placehold.co/1920x300.png';
  const hint = imageHint || 'legal document gavel';

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

export default async function CookiePolicyPage() {
  const content = await getCookiePolicyContent();
  
  return (
    <>
      <LegalPageHero title="Cookie Policy" image={content?.heroImage} imageHint={content?.heroImageHint} />
       <div className="bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="prose lg:prose-lg max-w-4xl mx-auto">
             {content?.content ? (
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            ) : (
              <div>
                <h2 className="font-headline font-light">Cookie Policy Not Available</h2>
                <p>
                  The cookie policy has not been configured yet. Please check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
