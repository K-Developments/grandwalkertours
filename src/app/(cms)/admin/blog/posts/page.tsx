// src/app/(cms)/admin/blog/posts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBlogPosts, addBlogPost, deleteBlogPost } from '@/lib/firebase/firestore';
import type { BlogPost } from '@/lib/types';
import { Trash2, PlusCircle, Loader2, Pencil, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function BlogPostsListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = getBlogPosts((data) => {
      setPosts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddPost = async () => {
    setIsAdding(true);
    try {
      const newPostData: Omit<BlogPost, 'id'> = {
        title: 'New Blog Post (Untitled)',
        slug: `new-post-${new Date().getTime()}`,
        excerpt: 'A brief summary of this new blog post.',
        featuredImage: 'https://placehold.co/1200x600.png',
        featuredImageHint: 'blog placeholder',
        content: '<p>Start writing your amazing blog post here!</p>',
        authorName: 'Admin',
        authorAvatar: 'https://placehold.co/100x100.png',
        publishedAt: new Date(),
      };
      const newPostId = await addBlogPost(newPostData);
      toast({
        title: 'Blog Post Created',
        description: 'Redirecting you to the editor...',
      });
      router.push(`/admin/blog/edit/${newPostId}`);
    } catch (error) {
      console.error('Error adding blog post:', error);
      toast({
        title: 'Error',
        description: 'Could not create new post. Please try again.',
        variant: 'destructive',
      });
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
        return;
    }
    try {
      await deleteBlogPost(id);
      toast({
        title: 'Blog Post Deleted',
        description: 'The post has been successfully removed.',
      });
    } catch (error) {
      console.error('Error deleting post:', error);
       toast({
        title: 'Error',
        description: 'Could not delete post. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline font-light">Blog Posts</CardTitle>
              <CardDescription>Manage the articles displayed on your blog.</CardDescription>
            </div>
            <Button onClick={handleAddPost} disabled={isAdding}>
              {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Add New Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p>No blog posts found. Add one using the button above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 p-2 border rounded-lg">
                  <div className="relative w-24 h-16 rounded-md overflow-hidden shrink-0">
                     <Image src={post.featuredImage} alt={post.title} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold truncate">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                        Published on {format(post.publishedAt.toDate(), 'PPP')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View Live</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/blog/edit/${post.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit post</span>
                        </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id!)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete post</span>
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
