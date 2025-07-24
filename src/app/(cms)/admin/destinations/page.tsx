// src/app/(cms)/admin/destinations/page.tsx
'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

const destinationsPageSections = [
    { name: 'Hero Section', description: 'Manage the main image on the destinations page.', href: '/admin/destinations/hero' },
    { name: 'Intro Section', description: 'Manage the title for the destinations list.', href: '/admin/destinations/intro' },
    { name: 'Destinations List', description: 'Add, edit, or remove destinations.', href: '/admin/destinations/destinations-list' },
]

export default function DestinationsAdminHubPage() {
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
            <CardTitle className="font-headline font-light">Destinations Page Content</CardTitle>
            <CardDescription>Select a section of the destinations page to manage its content.</CardDescription>
        </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinationsPageSections.map(section => (
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
