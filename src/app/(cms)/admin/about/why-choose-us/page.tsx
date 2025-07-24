// src/app/(cms)/admin/about/why-choose-us/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getWhyChooseUsItems, addWhyChooseUsItem, deleteWhyChooseUsItem, updateWhyChooseUsItem } from '@/lib/firebase/firestore';
import type { WhyChooseUsItem } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

const itemFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  image: z.string().url('Please enter a valid image URL.'),
  imageHint: z.string().optional(),
  link: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

export default function WhyChooseUsAdminPage() {
  const [items, setItems] = useState<WhyChooseUsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<WhyChooseUsItem | null>(null);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      imageHint: '',
      link: '',
    },
  });

  useEffect(() => {
    const unsubscribe = getWhyChooseUsItems((data) => {
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editingItem) {
      form.reset(editingItem);
    } else {
      form.reset({
        title: '',
        description: '',
        image: '',
        imageHint: '',
        link: '',
      });
    }
  }, [editingItem, form]);

  const onSubmit = async (data: ItemFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingItem && editingItem.id) {
        await updateWhyChooseUsItem(editingItem.id, data);
      } else {
        await addWhyChooseUsItem(data);
      }
      form.reset();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWhyChooseUsItem(id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  
  const handleEdit = (item: WhyChooseUsItem) => {
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
          <CardTitle className="font-headline font-light">{editingItem ? 'Edit Item' : 'Add New Item'}</CardTitle>
          <CardDescription>{editingItem ? 'Modify the details for this item.' : 'Add a new "Why Choose Us" item.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
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
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Read More Link (Optional)</FormLabel>
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
                      {editingItem ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      {editingItem ? 'Update Item' : 'Add Item'}
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
          <CardTitle className="font-headline font-light">Current Items</CardTitle>
          <CardDescription>Manage the existing items.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading items...</p>
          ) : items.length === 0 ? (
            <p>No items found. Add one using the form above.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-2 border rounded-lg">
                  <div className="relative w-24 h-16 rounded-md overflow-hidden">
                     <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={95} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                   <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit item</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id!)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete item</span>
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
