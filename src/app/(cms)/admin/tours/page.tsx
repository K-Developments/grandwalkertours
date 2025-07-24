// src/app/(cms)/admin/tours/page.tsx
'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

const toursPageSections = [
    { name: 'Hero Section', description: 'Manage the main image on the tours page.', href: '/admin/tours/hero' },
    { name: 'Intro Section', description: 'Manage the title for the tours list.', href: '/admin/tours/intro' },
    { name: 'Tours List', description: 'Add, edit, or remove tours from the list.', href: '/admin/tours/tours-list' },
]

export default function ToursAdminPage() {
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
            <CardTitle className="font-headline font-light">Tours Page Content</CardTitle>
            <CardDescription>Select a section of the tours page to manage its content.</CardDescription>
        </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {toursPageSections.map(section => (
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
