// src/app/(cms)/admin/homepage/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getServices, addService, deleteService, updateService } from '@/lib/firebase/admin-firestore';
import type { Service } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

const serviceFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  image: z.string().url('Please enter a valid image URL.'),
  imageHint: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export default function HomepageServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      imageHint: '',
    },
  });

  useEffect(() => {
    const unsubscribe = getServices((data) => {
      setServices(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editingService) {
      form.reset(editingService);
    } else {
      form.reset({
        title: '',
        description: '',
        image: '',
        imageHint: '',
      });
    }
  }, [editingService, form]);

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingService && editingService.id) {
        await updateService(editingService.id, data);
      } else {
        await addService(data);
      }
      form.reset();
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
            <CardTitle className="font-headline font-light">Homepage Services</CardTitle>
            <CardDescription>
                Manage the services displayed on the homepage.
            </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline font-light">{editingService ? 'Edit Service' : 'Add New Service'}</CardTitle>
          <CardDescription>
            {editingService ? 'Modify the details for this service.' : 'Add a new service to be displayed.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
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
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingService ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                      {editingService ? 'Update Service' : 'Add Service'}
                    </>
                  )}
                </Button>
                {editingService && (
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
          <CardTitle className="font-headline font-light">Current Homepage Services</CardTitle>
          <CardDescription>Manage the existing services displayed on the homepage.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading services...</p>
          ) : services.length === 0 ? (
            <p>No services found. Add one using the form above.</p>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center gap-4 p-2 border rounded-lg">
                  <div className="relative w-24 h-16 rounded-md overflow-hidden">
                     <Image src={service.image} alt={service.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={95} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{service.title}</p>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(service)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit service</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(service.id!)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Service</span>
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
