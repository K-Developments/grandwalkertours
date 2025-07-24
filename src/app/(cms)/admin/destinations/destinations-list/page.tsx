// src/app/(cms)/admin/destinations/destinations-list/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDestinationPageDestinations, addDestinationPageDestination, deleteDestinationPageDestination } from '@/lib/firebase/firestore';
import type { Destination } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DestinationListPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = getDestinationPageDestinations((data) => {
      setDestinations(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddDestination = async () => {
    setIsAdding(true);
    try {
      const newDestinationData: Omit<Destination, 'id'> = {
        name: 'New Destination (Untitled)',
        description: 'A brief description of this amazing new destination.',
        image: 'https://placehold.co/600x400.png',
        imageHint: 'destination placeholder',
        detailedDescription: 'More detailed information about what this destination entails.',
        gallery: [],
        additionalSections: [],
      };
      const newDestinationId = await addDestinationPageDestination(newDestinationData);
      toast({
        title: 'Destination Created',
        description: 'Redirecting you to the editor...',
      });
      router.push(`/admin/destinations/edit/${newDestinationId}`);
    } catch (error) {
      console.error('Error adding destination:', error);
      toast({
        title: 'Error',
        description: 'Could not create new destination. Please try again.',
        variant: 'destructive',
      });
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this destination? This action cannot be undone.')) {
        return;
    }
    try {
      await deleteDestinationPageDestination(id);
      toast({
        title: 'Destination Deleted',
        description: 'The destination has been successfully removed.',
      });
    } catch (error) {
      console.error('Error deleting destination:', error);
       toast({
        title: 'Error',
        description: 'Could not delete destination. Please try again.',
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
              <CardTitle className="font-headline font-light">Destinations List</CardTitle>
              <CardDescription>Manage the destinations displayed on the "Our Destinations" page.</CardDescription>
            </div>
            <Button onClick={handleAddDestination} disabled={isAdding}>
              {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Add New Destination
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading destinations...</p>
          ) : destinations.length === 0 ? (
            <div className="text-center py-8">
              <p>No destinations found. Add one using the button above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {destinations.map((destination) => (
                <div key={destination.id} className="flex items-center gap-4 p-2 border rounded-lg">
                  <div className="relative w-24 h-16 rounded-md overflow-hidden">
                     <Image src={destination.image} alt={destination.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={95} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{destination.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{destination.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/destinations?destinationId=${destination.id}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View Live</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/destinations/edit/${destination.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit destination details</span>
                        </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(destination.id!)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete destination</span>
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
