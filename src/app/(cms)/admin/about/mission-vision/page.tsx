// src/app/(cms)/admin/about/mission-vision/page.tsx
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
import { getMissionVisionContent, updateMissionVisionContent } from '@/lib/firebase/admin-firestore';
import type { MissionVisionContent } from '@/lib/types';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contentFormSchema = z.object({
  missionText: z.string().min(10, 'Mission text is required.'),
  missionImage: z.string().url('Please enter a valid image URL.').optional(),
  missionImageHint: z.string().optional(),
  visionText: z.string().min(10, 'Vision text is required.'),
  visionImage: z.string().url('Please enter a valid image URL.').optional(),
  visionImageHint: z.string().optional(),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

export default function MissionVisionAdminPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      missionText: '',
      missionImage: '',
      missionImageHint: '',
      visionText: '',
      visionImage: '',
      visionImageHint: '',
    },
  });

  const missionImageUrl = form.watch('missionImage');
  const visionImageUrl = form.watch('visionImage');

  useEffect(() => {
    const unsubscribe = getMissionVisionContent((data) => {
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
      await updateMissionVisionContent(data);
      toast({
        title: 'Content Updated',
        description: 'The Mission & Vision section has been successfully updated.',
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
        <CardTitle className="font-headline font-light">Mission & Vision Section</CardTitle>
        <CardDescription>
          Update the content for the mission and vision section on the "About Us" page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Mission</h3>
                 <FormField
                  control={form.control}
                  name="missionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-y min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="missionImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {missionImageUrl && (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border">
                    <Image src={missionImageUrl} alt="Mission Preview" fill className="object-cover" sizes="50vw" quality={95} />
                  </div>
                )}
                 <FormField
                  control={form.control}
                  name="missionImageHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mission Image AI Hint</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Vision */}
              <div className="space-y-4">
                 <h3 className="text-lg font-semibold border-b pb-2">Vision</h3>
                 <FormField
                  control={form.control}
                  name="visionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vision Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-y min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visionImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vision Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {visionImageUrl && (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border">
                    <Image src={visionImageUrl} alt="Vision Preview" fill className="object-cover" sizes="50vw" quality={95} />
                  </div>
                )}
                 <FormField
                  control={form.control}
                  name="visionImageHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vision Image AI Hint</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
