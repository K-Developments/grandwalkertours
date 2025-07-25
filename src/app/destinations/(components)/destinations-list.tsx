// src/app/destinations/(components)/destinations-list.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getDestinationPageDestinations, getDestinationPageIntroContent } from '@/lib/firebase/firestore';
import type { Destination, DestinationPageIntroContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import MotionWrapper from '@/app/(components)/motion-wrapper';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type DestinationsListProps = {
  onDestinationSelect: (id: string, name: string) => void;
};

const DestinationsList = ({ onDestinationSelect }: DestinationsListProps) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [intro, setIntro] = useState<DestinationPageIntroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
        const unsubscribeDestinations = getDestinationPageDestinations((data) => {
            setDestinations(data);
            // We set loading false after both fetches are initiated.
        });

        const unsubscribeIntro = getDestinationPageIntroContent((data) => {
            setIntro(data);
        });
        
        // This is a simple way to remove the loading state. 
        // A more robust solution might use Promise.all if the fetch functions returned promises.
        setLoading(false);

        return () => {
            unsubscribeDestinations();
            unsubscribeIntro();
        };
    }
    fetchContent();
  }, []);
  
  const filteredDestinations = destinations.filter(destination => 
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.description.toLowerCase().includes(searchQuery.toLowerCase())
  );


  if (loading) {
    return (
      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-full">
              <Skeleton className="h-[550px] w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
         {intro?.title && (
          <MotionWrapper className="text-center mb-8">
            <h2 className="font-headline text-3xl md:text-4xl font-extralight uppercase !text-black">
              {intro.title}
            </h2>
          </MotionWrapper>
        )}

        <div className="max-w-md mx-auto mb-12 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
            />
        </div>


        {destinations.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-light">No Destinations Available</h2>
            <p className="text-muted-foreground">Please check back later for our amazing destinations.</p>
          </div>
        ) : filteredDestinations.length === 0 ? (
             <div className="text-center py-12">
                <h3 className="text-xl font-light">No Destinations Found</h3>
                <p className="text-muted-foreground">Your search for "{searchQuery}" did not return any results.</p>
            </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {filteredDestinations.map((destination) => (
              <MotionWrapper key={destination.id} className="w-full lg:w-[45%]">
                <div className="relative group overflow-hidden md:h-[70vh] h-[45vh]">
                   <Image 
                      src={destination.image} 
                      alt={destination.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      data-ai-hint={destination.imageHint} 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={95}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
                    <div className="absolute inset-4 border-2 border-white/80 pointer-events-none" />

                    {/* Top Content */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-full px-4 text-center">
                        <div className="flex flex-col items-center">
                             <div className="w-px bg-white/80 h-[40px]"/>
                             <h3 className="mt-2 text-center text-xl font-light uppercase tracking-wider text-white">
                                {destination.name}
                            </h3>
                       </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-8 text-white px-8 w-full text-center flex items-center justify-center flex-col">
                      <p className="text-sm text-white/90 mb-4 line-clamp-3">{destination.description}</p>
                      {destination.id && (
                        <Button
                          variant="ghost"
                          onClick={() => onDestinationSelect(destination.id!, destination.name)}
                          className="border border-white text-white hover:text-white hover:bg-primary hover:border-[inherit]"
                        >
                            Read More
                        </Button>
                      )}
                    </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DestinationsList;
