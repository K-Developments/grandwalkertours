// src/app/(cms)/admin/blog/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getBlogPostById, updateBlogPost } from '@/lib/firebase/admin-firestore';
import type { BlogPost } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import RichTextEditor from '@/components/ui/rich-text-editor';
import Image from 'next/image';
import { format } from 'date-fns';

const blogPostFormSchema = z.object({
  title: z.string().min(5, 'Title is required.'),
  slug: z.string().min(5, 'Slug is required.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and contain no spaces.'),
  excerpt: z.string().min(10, 'Excerpt is required.'),
  featuredImage: z.string().url('A valid image URL is required.'),
  featuredImageHint: z.string().optional(),
  content: z.string().min(20, 'Content must be at least 20 characters.'),
  authorName: z.string().min(2, 'Author name is required.'),
  authorAvatar: z.string().url('A valid avatar URL is required.'),
  publishedAt: z.string().min(1, 'Published date is required.'), // Stored as string for the input
});

type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      featuredImage: '',
      featuredImageHint: '',
      content: '',
      authorName: '',
      authorAvatar: '',
      publishedAt: format(new Date(), 'yyyy-MM-dd'),
    },
  });
  
  const featuredImageUrl = form.watch('featuredImage');

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const postData = await getBlogPostById(id);
        if (postData) {
          form.reset({
            ...postData,
            // Convert timestamp back to yyyy-MM-dd string for the date input
            publishedAt: postData.publishedAt ? format(new Date(postData.publishedAt as any), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          });
        } else {
           toast({ title: 'Error', description: 'Blog post not found.', variant: 'destructive' });
           router.push('/admin/blog/posts');
        }
      } catch (error) {
        console.error('Failed to fetch blog post', error);
        toast({ title: 'Error', description: 'Failed to load blog post data.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, form, router, toast]);

  const onSubmit = async (data: BlogPostFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert date string back to Firestore Timestamp before saving
      const dataToSave = {
        ...data,
        publishedAt: new Date(data.publishedAt),
      };
      await updateBlogPost(id, dataToSave);
      toast({
        title: 'Blog Post Updated',
        description: 'The post has been successfully saved.',
      });
      router.push('/admin/blog/posts');
    } catch (error) {
       console.error('Error updating blog post:', error);
       toast({
        title: 'Error',
        description: 'Failed to update blog post. Please try again.',
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
                <Link href="/admin/blog/posts">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog Posts
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
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline font-light">Edit Blog Post</CardTitle>
            <CardDescription>Update the details for this blog post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Post Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>URL Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="excerpt" render={({ field }) => (
                <FormItem><FormLabel>Excerpt (Short Summary)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="featuredImage" render={({ field }) => (
                <FormItem><FormLabel>Featured Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            {featuredImageUrl && (
                 <div className="relative w-full h-64 rounded-md overflow-hidden border">
                  <Image src={featuredImageUrl} alt="Featured Image Preview" fill className="object-cover" sizes="50vw" />
                </div>
            )}
            <FormField control={form.control} name="featuredImageHint" render={({ field }) => (
                <FormItem><FormLabel>Featured Image AI Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="authorName" render={({ field }) => (
                <FormItem><FormLabel>Author Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="authorAvatar" render={({ field }) => (
                <FormItem><FormLabel>Author Avatar URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="publishedAt" render={({ field }) => (
                <FormItem><FormLabel>Published Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Content</FormLabel>
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
      </form>
    </Form>
  );
}
