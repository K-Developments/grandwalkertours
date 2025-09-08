// src/app/services/(components)/intro.tsx
import type { ServicePageIntroContent } from '@/lib/types';
import MotionWrapper from '@/app/(components)/motion-wrapper';

type ServiceIntroSectionProps = {
    content: ServicePageIntroContent | null;
}

export default function ServiceIntroSection({ content }: ServiceIntroSectionProps) {
  if (!content) {
    return (
      <section id="service-intro" className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl md:text-5xl font-extralight uppercase">Intro Section Not Configured</h2>
          <p>Please configure this section in the admin dashboard.</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="service-intro" 
      className="py-16 md:py-24 bg-background"
    >
       <div className="container mx-auto px-4">
        <MotionWrapper className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-extralight uppercase !text-black">
            {content.title}
          </h2>
          <div className="prose prose-lg mx-auto mt-4 text-muted-foreground">
            <p>{content.description}</p>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
};
