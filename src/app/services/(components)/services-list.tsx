// src/app/services/(components)/services-list.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/lib/types';
import MotionWrapper from '@/app/(components)/motion-wrapper';
import { Button } from '@/components/ui/button';

type ServicesListProps = {
    services: Service[];
}

const ServicesList = ({ services }: ServicesListProps) => {

  if (services.length === 0) {
    return null; // Or a message indicating no services are available
  }

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {services.map((service) => (
            <MotionWrapper key={service.id}>
              <div className="flex flex-col text-center">
                {/* Image Container */}
                <div className="relative w-full md:h-[80vh] h-[50vh] shadow-lg rounded-lg mb-6">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover w-full h-full rounded-md"
                    data-ai-hint={service.imageHint}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 44vw"
                    quality={95}
                  />
                  {/* Inset Border */}
                  <div className="absolute inset-0 m-4 border-2 border-white/80 rounded-sm pointer-events-none"></div>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center">
                  <h3 className="text-black text-2xl font-light mb-3 uppercase">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 h-full overflow-hidden">{service.description}</p>
                  {service.link && (
                     <Button variant="outline" asChild>
                       <Link href={service.link}>Read More</Link>
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

export default ServicesList;
