// src/app/(cms)/admin/legal/privacy-policy/page.tsx
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
import { getPrivacyPolicyContent, updatePrivacyPolicyContent } from '@/lib/firebase/firestore';
import type { PrivacyPolicyContent } from '@/lib/types';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/ui/rich-text-editor';

const contentFormSchema = z.object({
  heroImage: z.string().url('Please enter a valid image URL.').optional(),
  heroImageHint: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

export default function PrivacyPolicyAdminPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      heroImage: '',
      heroImageHint: '',
      content: '',
    },
  });

  const heroImageUrl = form.watch('heroImage');

  useEffect(() => {
    const unsubscribe = getPrivacyPolicyContent((data) => {
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
      await updatePrivacyPolicyContent(data);
      toast({
        title: 'Content Updated',
        description: 'The Privacy Policy page has been successfully updated.',
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
        <CardTitle className="font-headline font-light">Privacy Policy Page</CardTitle>
        <CardDescription>
          Update the content for the privacy policy page, including the hero image and the main text.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="heroImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {heroImageUrl && (
              <div className="relative w-full h-48 rounded-md overflow-hidden border">
                <Image src={heroImageUrl} alt="Hero Preview" fill className="object-cover" sizes="100vw" quality={95} />
              </div>
            )}
             <FormField
              control={form.control}
              name="heroImageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image AI Hint</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Content</FormLabel>
                    <FormControl>
                       <RichTextEditor value={field.value} onChange={field.onChange} />
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
