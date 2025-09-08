// src/app/(site)/gallery/page.tsx
import { getSsgGalleryItems, getGalleryPageHeroContentSSG } from '@/lib/firebase/firestore';
import GalleryPageClient from './gallery-page-client';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Gallery',
    description: 'A visual journey through the stunning locations and unforgettable moments captured on our Sri Lanka tours. Explore the Grand Walker Tours gallery.',
};

export default async function GalleryPage() {
    const items = await getSsgGalleryItems();
    const heroContent = await getGalleryPageHeroContentSSG();

    return <GalleryPageClient items={items} heroContent={heroContent} />;
}
