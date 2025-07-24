// src/app/(cms)/admin/about/hero/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getAboutHeroContent, updateAboutHeroContent } from '@/lib/firebase/firestore';
import type { AboutHeroContent } from '@/lib/types';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contentFormSchema = z.object({
  image: z.string().url('Please enter a valid image URL.').optional(),
  imageHint: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

export default function AboutHeroAdminPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      image: '',
      imageHint: '',
    },
  });

  const imageUrl = form.watch('image');

  useEffect(() => {
    const unsubscribe = getAboutHeroContent((data) => {
      if (data) {
        form.reset(data);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [form]);

  const onSubmit = async (data: ContentFormValues) => {
    setIsSubmitting(true);
    try {
      await updateAboutHeroContent(data);
      toast({
        title: 'Content Updated',
        description: 'The about us page hero section has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: 'Error',
        description: 'Failed to update content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline font-light">About Page Hero Section</CardTitle>
        <CardDescription>
          Update the background image for the hero section on the "About Us" page.
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
                  <FormLabel>Background Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {imageUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Image Preview:</p>
                <div className="relative w-full h-48 rounded-md overflow-hidden border">
                  <Image src={imageUrl} alt="Image Preview" fill className="object-cover" sizes="100vw" quality={95} />
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="imageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image AI Hint (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
