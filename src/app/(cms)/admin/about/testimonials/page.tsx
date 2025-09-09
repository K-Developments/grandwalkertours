// src/app/(cms)/admin/about/testimonials/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getTestimonials, addTestimonial, deleteTestimonial, updateTestimonial } from '@/lib/firebase/admin-firestore';
import type { Testimonial } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonialFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  role: z.string().min(2, 'Role must be at least 2 characters long.'),
  quote: z.string().min(10, 'Quote must be at least 10 characters long.'),
  avatar: z.string().url('Please enter a valid avatar image URL.'),
  avatarHint: z.string().optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: '',
      role: '',
      quote: '',
      avatar: '',
      avatarHint: '',
    },
  });

  useEffect(() => {
    const unsubscribe = getTestimonials((data) => {
      setTestimonials(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editingTestimonial) {
      form.reset(editingTestimonial);
    } else {
      form.reset({
        name: '',
        role: '',
        quote: '',
        avatar: '',
        avatarHint: '',
      });
    }
  }, [editingTestimonial, form]);

  const onSubmit = async (data: TestimonialFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingTestimonial && editingTestimonial.id) {
        await updateTestimonial(editingTestimonial.id, data);
      } else {
        await addTestimonial(data);
      }
      form.reset();
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial(id);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };
  
  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingTestimonial(null);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</CardTitle>
          <CardDescription>{editingTestimonial ? 'Modify the details for this testimonial.' : 'Add a new customer testimonial.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Role/Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="quote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatarHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar AI Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      {editingTestimonial ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                    </>
                  )}
                </Button>
                {editingTestimonial && (
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
          <CardTitle className="font-headline font-light">Current Testimonials</CardTitle>
          <CardDescription>Manage the existing testimonials.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading testimonials...</p>
          ) : testimonials.length === 0 ? (
            <p>No testimonials found. Add one using the form above.</p>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex items-center gap-4 p-2 border rounded-lg">
                  <Avatar>
                     <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                     <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{testimonial.name} <span className="text-sm text-muted-foreground font-normal">- {testimonial.role}</span></p>
                    <p className="text-sm text-muted-foreground italic">"{testimonial.quote}"</p>
                  </div>
                   <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(testimonial)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit testimonial</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(testimonial.id!)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete testimonial</span>
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
