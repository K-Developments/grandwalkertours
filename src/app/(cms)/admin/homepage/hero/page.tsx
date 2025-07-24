// src/app/(cms)/admin/homepage/hero/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { addSlide, deleteSlide, getSlides, updateSlide } from '@/lib/firebase/firestore';
import type { HeroSlide } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, XCircle } from 'lucide-react';
import Image from 'next/image';

const slideFormSchema = z.object({
  image: z.string().url('Please enter a valid image URL.'),
  headline: z.string().min(5, 'Headline must be at least 5 characters long.'),
  imageHint: z.string().optional(),
  videoUrl: z.string().url('Please enter a valid video URL.').optional().or(z.literal('')),
});

type SlideFormValues = z.infer<typeof slideFormSchema>;

export default function HeroSliderAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const form = useForm<SlideFormValues>({
    resolver: zodResolver(slideFormSchema),
    defaultValues: {
      image: '',
      headline: '',
      imageHint: '',
      videoUrl: '',
    },
  });

  useEffect(() => {
    const unsubscribe = getSlides((data) => {
      setSlides(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editingSlide) {
      form.reset(editingSlide);
    } else {
      form.reset({
        image: '',
        headline: '',
        imageHint: '',
        videoUrl: '',
      });
    }
  }, [editingSlide, form]);

  const onSubmit = async (data: SlideFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingSlide && editingSlide.id) {
        await updateSlide(editingSlide.id, data);
      } else {
        await addSlide(data);
      }
      form.reset();
      setEditingSlide(null);
    } catch (error) {
      console.error('Error saving slide:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSlide(id);
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingSlide(null);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</CardTitle>
          <CardDescription>
            {editingSlide ? 'Modify the details for this slide.' : 'Add a new slide to the homepage hero slider.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
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
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (Optional - MP4)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} placeholder="https://example.com/video.mp4" />
                    </FormControl>
                     <FormDescription>
                      For best performance, use a compressed, web-optimized MP4 video (under 5MB is ideal). The video will only play if it's on the very first slide.
                    </FormDescription>
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
                      {editingSlide ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      {editingSlide ? 'Update Slide' : 'Add Slide'}
                    </>
                  )}
                </Button>
                {editingSlide && (
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
          <CardTitle className="font-headline font-light">Current Slides</CardTitle>
          <CardDescription>Manage the existing slides in the hero slider.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading slides...</p>
          ) : slides.length === 0 ? (
            <p>No slides found. Add one using the form above.</p>
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <div key={slide.id} className="flex items-center gap-4 p-2 border rounded-lg">
                  <div className="relative w-24 h-16 rounded-md overflow-hidden">
                     <Image src={slide.image} alt={slide.headline} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={95} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{slide.headline}</p>
                     {slide.videoUrl && <p className="text-xs text-muted-foreground truncate">Video: {slide.videoUrl}</p>}
                  </div>
                  <div className="flex gap-2">
                     <Button variant="outline" size="icon" onClick={() => handleEdit(slide)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit slide</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(slide.id!)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete slide</span>
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
