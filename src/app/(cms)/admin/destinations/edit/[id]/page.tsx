// src/app/(cms)/admin/destinations/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { getDestinationPageDestinationById, updateDestinationPageDestination } from '@/lib/firebase/admin-firestore';
import type { Destination } from '@/lib/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Save, Trash2, PlusCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import RichTextEditor from '@/components/ui/rich-text-editor';


const galleryImageSchema = z.object({
  id: z.string(),
  url: z.string().url('Must be a valid URL.'),
  hint: z.string().optional(),
});

const additionalSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'Title is required.'),
  description: z.string().min(10, 'Description is required.'),
  image: z.string().url('Must be a valid URL.'),
  imageHint: z.string().optional(),
});

const destinationFormSchema = z.object({
  name: z.string().min(3, 'Destination name is required.'),
  description: z.string().min(10, 'Short description is required.'),
  image: z.string().url('Main image URL is required.'),
  imageHint: z.string().optional(),
  detailedDescription: z.string().min(20, 'Detailed description is required.'),
  gallery: z.array(galleryImageSchema).optional(),
  additionalSections: z.array(additionalSectionSchema).optional(),
});

type DestinationFormValues = z.infer<typeof destinationFormSchema>;

export default function EditDestinationPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      imageHint: '',
      detailedDescription: '',
      gallery: [],
      additionalSections: [],
    },
  });
  
  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control: form.control,
    name: "gallery",
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: "additionalSections",
  });


  useEffect(() => {
    if (!id) return;
    const fetchDestination = async () => {
      try {
        const destinationData = await getDestinationPageDestinationById(id);
        if (destinationData) {
          form.reset({
            ...destinationData,
            gallery: destinationData.gallery || [],
            additionalSections: destinationData.additionalSections || [],
          });
        } else {
           toast({ title: 'Error', description: 'Destination not found.', variant: 'destructive' });
           router.push('/admin/destinations/destinations-list');
        }
      } catch (error) {
        console.error('Failed to fetch destination', error);
        toast({ title: 'Error', description: 'Failed to load destination data.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id, form, router, toast]);

  const onSubmit = async (data: DestinationFormValues) => {
    setIsSubmitting(true);
    try {
      await updateDestinationPageDestination(id, data);
      toast({
        title: 'Destination Updated',
        description: 'The destination details have been successfully saved.',
      });
    } catch (error) {
       console.error('Error updating destination:', error);
       toast({
        title: 'Error',
        description: 'Failed to update destination. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
             <Button variant="outline" asChild>
                <Link href="/admin/destinations/destinations-list">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Destinations List
                </Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Save All Changes</>
              )}
            </Button>
        </div>
        
        {/* Main Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-headline font-light">Main Destination Details</CardTitle>
            <CardDescription>This is the primary information for the destination listing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Destination Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Short Description (for list view)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem><FormLabel>Main Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="imageHint" render={({ field }) => (
                <FormItem><FormLabel>Main Image AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
             <FormField
                control={form.control}
                name="detailedDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
        </Card>

        {/* Gallery Card */}
        <Card>
            <CardHeader>
                <CardTitle className="font-headline font-light">Image Gallery</CardTitle>
                <CardDescription>Add images for the destination detail page slider.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {galleryFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeGallery(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <FormField control={form.control} name={`gallery.${index}.url`} render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`gallery.${index}.hint`} render={({ field }) => (
                            <FormItem><FormLabel>AI Hint</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                 <Button type="button" variant="outline" onClick={() => appendGallery({ id: nanoid(), url: '', hint: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Gallery Image
                </Button>
            </CardFooter>
        </Card>

         {/* Additional Sections Card */}
        <Card>
            <CardHeader>
                <CardTitle className="font-headline font-light">Additional Content Sections</CardTitle>
                <CardDescription>Add detailed sections with an image and text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {sectionFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeSection(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                         <FormField control={form.control} name={`additionalSections.${index}.title`} render={({ field }) => (
                            <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`additionalSections.${index}.description`} render={({ field }) => (
                            <FormItem><FormLabel>Section Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name={`additionalSections.${index}.image`} render={({ field }) => (
                            <FormItem><FormLabel>Section Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name={`additionalSections.${index}.imageHint`} render={({ field }) => (
                            <FormItem><FormLabel>Section Image AI Hint</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                 <Button type="button" variant="outline" onClick={() => appendSection({ id: nanoid(), title: '', description: '', image: '', imageHint: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Section
                </Button>
            </CardFooter>
        </Card>

      </form>
    </Form>
  );
}
