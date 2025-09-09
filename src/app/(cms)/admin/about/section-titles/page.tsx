// src/app/(cms)/admin/about/section-titles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getAboutSectionTitles, updateAboutSectionTitles } from '@/lib/firebase/admin-firestore';
import type { AboutSectionTitles } from '@/lib/types';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contentFormSchema = z.object({
  missionVisionTitle: z.string().min(1, 'Title is required.'),
  whyChooseUsTitle: z.string().min(1, 'Title is required.'),
  testimonialsTitle: z.string().min(1, 'Title is required.'),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

export default function AboutSectionTitlesAdminPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      missionVisionTitle: '',
      whyChooseUsTitle: '',
      testimonialsTitle: '',
    },
  });

  useEffect(() => {
    const unsubscribe = getAboutSectionTitles((data) => {
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
      await updateAboutSectionTitles(data);
      toast({
        title: 'Content Updated',
        description: 'The about page section titles have been successfully updated.',
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
        <CardTitle className="font-headline font-light">About Page Section Titles</CardTitle>
        <CardDescription>
          Update the titles for the various sections on the "About Us" page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="missionVisionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mission & Vision Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="whyChooseUsTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why Choose Us Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="testimonialsTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testimonials Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
