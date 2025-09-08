// src/app/about/(components)/why-choose-us.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { WhyChooseUsItem, AboutSectionTitles } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import MotionWrapper from '@/app/(components)/motion-wrapper';

type WhyChooseUsSectionProps = {
    items: WhyChooseUsItem[];
    titles: AboutSectionTitles | null;
}

const WhyChooseUsSection = ({ items, titles }: WhyChooseUsSectionProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <MotionWrapper className="text-center mb-8">
          <h2 className="font-headline text-3xl md:text-4xl font-light !text-black">{titles?.whyChooseUsTitle || 'Why Choose Us?'}</h2>
        </MotionWrapper>
        <div className="space-y-16 md:space-y-24">
          {items.map((item, index) => (
            <MotionWrapper key={item.id} className="w-full">
              <div className={cn(
                "flex flex-col md:flex-row items-center gap-8 md:gap-16",
                index % 2 !== 0 && "md:flex-row-reverse"
              )}>
                {/* Image */}
                <div className="relative w-full md:w-1/2 h-auto">
                   <div className="relative w-full h-[400px] md:h-[500px] shadow-lg rounded-lg">
                     <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover w-full h-full rounded-md"
                        data-ai-hint={item.imageHint}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={95}
                    />
                    <div className="absolute inset-0 m-4 border-2 border-white/80 rounded-sm"></div>
                   </div>
                </div>
                
                {/* Content */}
                <div className="w-full md:w-1/2">
                  <h3 className="text-black text-3xl font-light mb-4 why-choose">{item.title}</h3>
                  <p className="text-muted-foreground mb-6 whitespace-pre-line">{item.description}</p>
                  {item.link && (
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href={item.link}>
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
