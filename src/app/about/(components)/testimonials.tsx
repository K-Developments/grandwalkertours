// src/app/about/(components)/testimonials.tsx
'use client';

import type { Testimonial, AboutSectionTitles } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

type TestimonialsSectionProps = {
    testimonials: Testimonial[];
    titles: AboutSectionTitles | null;
}

const TestimonialsSection = ({ testimonials, titles }: TestimonialsSectionProps) => {

  if (testimonials.length === 0) {
    return null; // Don't render the section if there are no testimonials
  }

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/**keep this text-black */}
          <h2 className="font-headline text-black text-3xl md:text-4xl font-light">{titles?.testimonialsTitle || 'What Our Clients Say'}</h2>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-3xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <div className="p-1">
                  <div className="flex flex-col items-center text-center gap-6">
                    <Quote className="w-12 h-12 text-primary" />
                    <p className="text-xl text-muted-foreground italic max-w-2xl">"{testimonial.quote}"</p>
                    <div className="flex flex-col items-center gap-3 mt-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint}/>
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
