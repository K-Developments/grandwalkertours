
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { siteConfig } from '@/config/site';
import { getSlidesForPreload } from '@/lib/firebase/firestore';


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const slides = await getSlidesForPreload();
  const firstVideoUrl = slides.length > 0 && slides[0].videoUrl ? slides[0].videoUrl : null;

  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Playfair+Display:ital,wght@0,200..900;1,200..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />

        {/* Preload Header Logos */}
        <link rel="preload" as="image" href="/logo-dark.png" />
        <link rel="preload" as="image" href="/logo-light.png" />

        {/**preload the hero slider images when site is loading */}
        {slides.map((slide) => (
          <link key={slide.id} rel="preload" as="image" href={slide.image} />
        ))}
        
        {/**preload the hero slider video if it exists on the first slide */}
        {firstVideoUrl && (
          <link rel="preload" as="video" href={firstVideoUrl} type="video/mp4" />
        )}
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
