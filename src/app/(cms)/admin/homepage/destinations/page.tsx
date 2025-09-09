// src/app/(cms)/admin/homepage/destinations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getDestinations, addDestination, deleteDestination, updateDestination } from '@/lib/firebase/admin-firestore';
import type { Destination } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

const destinationFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  image: z.string().url('Please enter a valid image URL.'),
  imageHint: z.string().optional(),
  exploreLink: z.string().optional().or(z.literal('')),
});

type DestinationFormValues = z.infer<typeof destinationFormSchema>;

export default function DestinationsAdminPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);

  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      imageHint: '',
      exploreLink: '',
    },
  });

  useEffect(() => {
    const unsubscribe = getDestinations((data) => {
      setDestinations(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editingDestination) {
      form.reset(editingDestination);
    } else {
      form.reset({
        name: '',
        description: '',
        image: '',
        imageHint: '',
        exploreLink: '',
      });
    }
  }, [editingDestination, form]);

  const onSubmit = async (data: DestinationFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingDestination && editingDestination.id) {
        await updateDestination(editingDestination.id, data);
      } else {
        await addDestination(data);
      }
      form.reset();
      setEditingDestination(null);
    } catch (error) {
      console.error('Error saving destination:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDestination(id);
    } catch (error) {
      console.error('Error deleting destination:', error);
    }
  };
  
  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingDestination(null);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">{editingDestination ? 'Edit Destination' : 'Add New Destination'}</CardTitle>
          <CardDescription>{editingDestination ? 'Modify the details for this destination.' : 'Add a new destination to the homepage slider.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image AI Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exploreLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explore Link (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingDestination ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      {editingDestination ? 'Update Destination' : 'Add Destination'}
                    </>
                  )}
                </Button>
                {editingDestination && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">Current Destinations</CardTitle>
          <CardDescription>Manage the existing destinations.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading destinations...</p>
          ) : destinations.length === 0 ? (
            <p>No destinations found. Add one using the form above.</p>
          ) : (
            <div className="space-y-4">
              {destinations.map((destination) => (
                <div key={destination.id} className="flex items-center gap-4 p-2 border rounded-lg">
                  <div className="relative w-24 h-16 rounded-md overflow-hidden">
                     <Image src={destination.image} alt={destination.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={95} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{destination.name}</p>
                    <p className="text-sm text-muted-foreground">{destination.description}</p>
                  </div>
                   <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(destination)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit destination</span>
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
