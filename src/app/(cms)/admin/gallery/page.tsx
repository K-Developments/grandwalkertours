// src/app/(cms)/admin/gallery/page.tsx
'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

const galleryPageSections = [
    { name: 'Hero Section', description: 'Manage the main image on the gallery page.', href: '/admin/gallery/hero' },
    { name: 'Gallery Images', description: 'Add, edit, or remove images from the gallery.', href: '/admin/gallery/items' },
]

export default function GalleryAdminHubPage() {
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
            <CardTitle className="font-headline font-light">Gallery Page Content</CardTitle>
            <CardDescription>Select a section of the gallery page to manage its content.</CardDescription>
        </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryPageSections.map(section => (
                <Card key={section.name} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl font-light">{section.name}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                         <Button asChild variant="outline">
                            <Link href={section.href}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
