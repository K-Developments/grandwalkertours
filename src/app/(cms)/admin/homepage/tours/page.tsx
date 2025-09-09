// src/app/(cms)/admin/homepage/tours/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getTours, addTour, deleteTour, updateTour } from '@/lib/firebase/admin-firestore';
import type { Tour } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { nanoid } from 'nanoid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { availableIcons, IconDisplay } from '@/components/icon-display';


const activitySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Activity name is required.'),
  icon: z.string().min(1, 'An icon is required.'),
});

const tourFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  image: z.string().url('Please enter a valid image URL.'),
  imageHint: z.string().optional(),
  link: z.string().optional(),
  activities: z.array(activitySchema).optional(),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

export default function ToursAdminPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      imageHint: '',
      link: '',
      activities: [],
    },
  });

  const { fields: activityFields, append: appendActivity, remove: removeActivity } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  useEffect(() => {
    const unsubscribe = getTours((data) => {
      setTours(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (editingTour) {
      form.reset({
        ...editingTour,
        activities: editingTour.activities || []
      });
    } else {
      form.reset({
        name: '',
        description: '',
        image: '',
        imageHint: '',
        link: '',
        activities: [],
      });
    }
  }, [editingTour, form]);


  const onSubmit = async (data: TourFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingTour && editingTour.id) {
        await updateTour(editingTour.id, data);
      } else {
        await addTour(data);
      }
      form.reset();
      setEditingTour(null);
    } catch (error) {
      console.error('Error saving tour:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTour(id);
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };
  
  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingTour(null);
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">{editingTour ? 'Edit Tour' : 'Add New Tour'}</CardTitle>
          <CardDescription>{editingTour ? 'Modify the details for this tour.' : 'Add a new tour to be displayed on the homepage.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Main Tour Fields */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Name</FormLabel>
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
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Link (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activities Section */}
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-medium">Activities</h3>
                {activityFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end p-2 border rounded-md">
                    <FormField
                      control={form.control}
                      name={`activities.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`activities.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an icon">
                                  {field.value && <IconDisplay iconName={field.value} />}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.keys(availableIcons).map(iconName => (
                                <SelectItem key={iconName} value={iconName}>
                                  <IconDisplay iconName={iconName} />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeActivity(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendActivity({ id: nanoid(), name: '', icon: '' })}
                >
                   <PlusCircle className="mr-2 h-4 w-4" /> Add Activity
                </Button>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingTour ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      {editingTour ? 'Update Tour' : 'Add Tour'}
                    </>
                  )}
                </Button>
                 {editingTour && (
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
          <CardTitle className="font-headline font-light">Current Tours</CardTitle>
          <CardDescription>Manage the existing tours.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading tours...</p>
          ) : tours.length === 0 ? (
            <p>No tours found. Add one using the form above.</p>
          ) : (
            <div className="space-y-4">
              {tours.map((tour) => (
                <div key={tour.id} className="flex items-center gap-4 p-2 border rounded-lg">
                  <div className="relative w-24 h-16 rounded-md overflow-hidden">
                     <Image src={tour.image} alt={tour.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={95} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{tour.name}</p>
                    <p className="text-sm text-muted-foreground">{tour.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(tour)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit tour</span>
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
