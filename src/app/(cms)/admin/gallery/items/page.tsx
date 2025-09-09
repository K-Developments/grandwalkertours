// src/app/(cms)/admin/gallery/items/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getGalleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem } from '@/lib/firebase/admin-firestore';
import type { GalleryItem } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const galleryItemFormSchema = z.object({
  image: z.string().url('Please enter a valid image URL.'),
  imageHint: z.string().optional(),
  category: z.string().optional(),
});

type GalleryItemFormValues = z.infer<typeof galleryItemFormSchema>;

export default function GalleryItemsAdminPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const { toast } = useToast();

  const form = useForm<GalleryItemFormValues>({
    resolver: zodResolver(galleryItemFormSchema),
    defaultValues: {
      image: '',
      imageHint: '',
      category: '',
    },
  });

  useEffect(() => {
    const unsubscribe = getGalleryItems((data) => {
      setGalleryItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editingItem) {
      form.reset(editingItem);
    } else {
      form.reset({
        image: '',
        imageHint: '',
        category: '',
      });
    }
  }, [editingItem, form]);

  const onSubmit = async (data: GalleryItemFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingItem && editingItem.id) {
        await updateGalleryItem(editingItem.id, data);
        toast({ title: 'Success', description: 'Gallery item updated successfully.' });
      } else {
        await addGalleryItem(data);
        toast({ title: 'Success', description: 'New image added to the gallery.' });
      }
      form.reset();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast({ title: 'Error', description: 'Failed to save gallery item.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image from the gallery?')) return;
    try {
      await deleteGalleryItem(id);
      toast({ title: 'Success', description: 'Gallery item deleted.' });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast({ title: 'Error', description: 'Failed to delete gallery item.', variant: 'destructive' });
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">{editingItem ? 'Edit Gallery Image' : 'Add New Gallery Image'}</CardTitle>
          <CardDescription>{editingItem ? 'Modify the details for this image.' : 'Add a new image to the website gallery.'}</CardDescription>
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} placeholder="e.g., Landscapes, Wildlife, Culture"/>
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
                      {editingItem ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      {editingItem ? 'Update Image' : 'Add Image'}
                    </>
                  )}
                </Button>
                {editingItem && (
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
          <CardTitle className="font-headline font-light">Current Gallery Images</CardTitle>
          <CardDescription>Manage the existing images in the gallery.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : galleryItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No images found. Add one using the form above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryItems.map((item) => (
                <div key={item.id} className="relative group border rounded-lg overflow-hidden">
                  <Image src={item.image} alt={item.category || 'Gallery image'} width={200} height={200} className="aspect-square object-cover w-full" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                    <p className="text-white text-xs text-center line-clamp-2 mb-2">{item.category}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Image</span>
                        </Button>
                        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id!)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Image</span>
                        </Button>
                    </div>
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
