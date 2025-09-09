// src/app/(cms)/admin/homepage/welcome/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getWelcomeSectionContent, updateWelcomeSectionContent } from '@/lib/firebase/admin-firestore';
import type { WelcomeSectionContent } from '@/lib/types';
import { Loader2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const contentFormSchema = z.object({
  headline: z.string().min(5, 'Headline is required.'),
  description: z.string().min(10, 'Description is required.'),
  image: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
  imageHint: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  
  // Fields for the second section
  headline2: z.string().optional(),
  description2: z.string().optional(),
  image2: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
  imageHint2: z.string().optional(),
  buttonText2: z.string().optional(),
  buttonLink2: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

export default function WelcomeContentAdminPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      headline: '',
      description: '',
      image: '',
      imageHint: '',
      buttonText: 'Explore More',
      buttonLink: '#',
      headline2: '',
      description2: '',
      image2: '',
      imageHint2: '',
      buttonText2: 'Learn More',
      buttonLink2: '#',
    },
  });

  const imageUrl = form.watch('image');
  const imageUrl2 = form.watch('image2');

  useEffect(() => {
    const unsubscribe = getWelcomeSectionContent((data) => {
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
      await updateWelcomeSectionContent(data);
      toast({
        title: 'Content Updated',
        description: 'The homepage welcome section has been successfully updated.',
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
  
  const handleRemoveImage = (fieldName: 'image' | 'image2') => {
    form.setValue(fieldName, '');
    form.setValue(fieldName === 'image' ? 'imageHint' : 'imageHint2', '');
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
        <CardTitle className="font-headline font-light">Welcome Section Content</CardTitle>
        <CardDescription>
          Update the content for the welcome section on the homepage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* First Section */}
            <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">First Part (Content Left, Image Right)</h3>
                 <div className="space-y-6 mt-4">
                    <FormField control={form.control} name="headline" render={({ field }) => (
                        <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="resize-y min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="image" render={({ field }) => (
                        <FormItem><FormLabel>Background Image URL</FormLabel><div className="flex items-center gap-2"><FormControl><Input {...field} value={field.value || ''} /></FormControl>{field.value && (<Button type="button" variant="outline" size="icon" onClick={() => handleRemoveImage('image')}><X className="h-4 w-4" /></Button>)}</div><FormMessage /></FormItem>
                    )} />
                    {imageUrl && (<div className="mt-4"><p className="text-sm font-medium mb-2">Image Preview:</p><div className="relative w-full h-48 rounded-md overflow-hidden border"><Image src={imageUrl} alt="Image Preview" fill className="object-cover" sizes="50vw" quality={95} /></div></div>)}
                    <FormField control={form.control} name="imageHint" render={({ field }) => (
                        <FormItem><FormLabel>Image AI Hint (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ''}/></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="buttonText" render={({ field }) => (
                        <FormItem><FormLabel>Button Text (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="buttonLink" render={({ field }) => (
                        <FormItem><FormLabel>Button Link (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>

            <Separator />

            {/* Second Section */}
             <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Second Part (Image Left, Content Right) - Optional</h3>
                 <div className="space-y-6 mt-4">
                    <FormField control={form.control} name="headline2" render={({ field }) => (
                        <FormItem><FormLabel>Headline 2</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="description2" render={({ field }) => (
                        <FormItem><FormLabel>Description 2</FormLabel><FormControl><Textarea className="resize-y min-h-[100px]" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="image2" render={({ field }) => (
                        <FormItem><FormLabel>Background Image URL 2</FormLabel><div className="flex items-center gap-2"><FormControl><Input {...field} value={field.value || ''} /></FormControl>{field.value && (<Button type="button" variant="outline" size="icon" onClick={() => handleRemoveImage('image2')}><X className="h-4 w-4" /></Button>)}</div><FormMessage /></FormItem>
                    )} />
                    {imageUrl2 && (<div className="mt-4"><p className="text-sm font-medium mb-2">Image Preview 2:</p><div className="relative w-full h-48 rounded-md overflow-hidden border"><Image src={imageUrl2} alt="Image Preview" fill className="object-cover" sizes="50vw" quality={95} /></div></div>)}
                    <FormField control={form.control} name="imageHint2" render={({ field }) => (
                        <FormItem><FormLabel>Image AI Hint 2 (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ''}/></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="buttonText2" render={({ field }) => (
                        <FormItem><FormLabel>Button Text 2 (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="buttonLink2" render={({ field }) => (
                        <FormItem><FormLabel>Button Link 2 (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>


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
