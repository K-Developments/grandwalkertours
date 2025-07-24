// src/app/(cms)/admin/homepage/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

const homepageSections = [
    { name: 'Hero Slider', description: 'Manage the main images and text on the homepage.', href: '/admin/homepage/hero' },
    { name: 'Welcome Section', description: 'Update the introductory content block.', href: '/admin/homepage/welcome' },
    { name: 'Section Titles', description: 'Manage the titles for each section.', href: '/admin/homepage/section-titles' },
    { name: 'Destinations', description: 'Add, remove, or edit featured destinations.', href: '/admin/homepage/destinations' },
    { name: 'Tours', description: 'Manage the tour packages displayed.', href: '/admin/homepage/tours' },
    { name: 'Services', description: 'Update the services offered.', href: '/admin/homepage/services' },
]

export default function HomepageAdminPage() {
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
            <CardTitle className="font-headline font-light">Homepage Content</CardTitle>
            <CardDescription>Select a section of the homepage to manage its content.</CardDescription>
        </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homepageSections.map(section => (
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
