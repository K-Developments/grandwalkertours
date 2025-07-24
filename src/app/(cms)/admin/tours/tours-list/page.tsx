// src/app/(cms)/admin/tours/tours-list/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTourPageTours, addTourPageTour, deleteTourPageTour } from '@/lib/firebase/firestore';
import type { Tour } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TourListPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = getTourPageTours((data) => {
      setTours(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddTour = async () => {
    setIsAdding(true);
    try {
      const newTourData: Omit<Tour, 'id'> = {
        name: 'New Tour (Untitled)',
        description: 'A brief description of this amazing new tour.',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'tour placeholder',
        detailedDescription: 'More detailed information about what this tour entails.',
        gallery: [],
        additionalSections: [],
      };
      const newTourId = await addTourPageTour(newTourData);
      toast({
        title: 'Tour Created',
        description: 'Redirecting you to the editor...',
      });
      router.push(`/admin/tours/edit/${newTourId}`);
    } catch (error) {
      console.error('Error adding tour:', error);
      toast({
        title: 'Error',
        description: 'Could not create new tour. Please try again.',
        variant: 'destructive',
      });
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
        return;
    }
    try {
      await deleteTourPageTour(id);
      toast({
        title: 'Tour Deleted',
        description: 'The tour has been successfully removed.',
      });
    } catch (error) {
      console.error('Error deleting tour:', error);
       toast({
        title: 'Error',
        description: 'Could not delete tour. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline font-light">Tours List</CardTitle>
              <CardDescription>Manage the tours displayed on the "Our Tours" page.</CardDescription>
            </div>
            <Button onClick={handleAddTour} disabled={isAdding}>
              {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Add New Tour
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading tours...</p>
          ) : tours.length === 0 ? (
            <div className="text-center py-8">
              <p>No tours found. Add one using the button above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tours.map((tour) => (
                <div key={tour.id} className="flex items-center gap-4 p-2 border rounded-lg">
                  <div className="relative w-24 h-16 rounded-md overflow-hidden">
                     <Image src={tour.image} alt={tour.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={95} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{tour.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{tour.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/tours/${tour.id}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View Live</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/tours/edit/${tour.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit tour details</span>
                        </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(tour.id!)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete tour</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
