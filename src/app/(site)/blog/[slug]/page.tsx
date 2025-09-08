// src/app/(site)/blog/[slug]/page.tsx
import { getBlogPostBySlug, getSsgBlogPosts } from '@/lib/firebase/firestore';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Link from 'next/link';

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
 
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
 
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [
            {
                url: post.featuredImage,
                width: 1200,
                height: 630,
                alt: post.title,
            }
        ]
    }
  }
}

export async function generateStaticParams() {
  const posts = await getSsgBlogPosts();
 
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string }}) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <div className="container mx-auto px-4 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">--&gt;</span>
                   <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                      Blog
                    </Link>
                </div>
              </li>
              <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-muted-foreground">--&gt;</span>
                    <span className="ml-1 text-sm font-medium text-foreground md:ml-2 line-clamp-1">
                      {post.title}
                    </span>
                  </div>
                </li>
            </ol>
          </nav>
      </div>
      <article className="container mx-auto px-4 py-8 md:py-16">
        <header className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
          <h1 className="font-headline font-light text-4xl md:text-6xl mb-4">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{post.authorName}</span>
            </div>
            <span>&bull;</span>
            <time dateTime={post.publishedAt.toDateString()}>
              {format(post.publishedAt, 'PPP')}
            </time>
          </div>
        </header>

        <div className="relative w-full h-[30vh] md:h-[60vh] rounded-lg overflow-hidden mb-8 md:mb-12 shadow-lg">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint={post.featuredImageHint}
            priority
            sizes="100vw"
          />
        </div>

        <div 
          className="prose lg:prose-xl max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
}
