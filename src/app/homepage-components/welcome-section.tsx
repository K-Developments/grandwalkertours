// src/app/homepage-components/welcome-section.tsx
import Link from 'next/link';
import type { WelcomeSectionContent as WelcomeSectionContentType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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
  if (!headline && !description && !image) {
    return null;
  }
  
  const imageOrderClass = imagePosition === 'right' ? 'md:order-2' : 'md:order-1';
  const contentOrderClass = imagePosition === 'right' ? 'md:order-1' : 'md:order-2';

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 bg-background text-foreground overflow-hidden">
      <div className={`flex items-center justify-center p-8 md:p-16 bg-[#F5F5F5] ${contentOrderClass}`}>
        <div className="max-w-md text-center md:text-left">
          <h2 className="font-headline text-3xl md:text-4xl font-extralight uppercase text-black">
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
      <div className={`w-full h-[70vh] md:h-auto relative ${imageOrderClass}`}>
        {image && (
          <>
            <Image
              src={image}
              alt={headline || 'Welcome section image'}
              fill
              className="object-cover"
              data-ai-hint={imageHint}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-4 border-2 border-white/80 pointer-events-none"></div>
          </>
        )}
      </div>
    </section>
  );
};

type WelcomeSectionProps = {
    content: WelcomeSectionContentType | null;
};

export default function WelcomeSection({ content }: WelcomeSectionProps) {
  if (!content) {
     return (
      <section id="welcome" className="py-16 md:py-24 bg-muted pt-[5rem]">
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
