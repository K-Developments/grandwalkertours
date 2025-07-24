// src/app/(cms)/admin/about/page.tsx
'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

const aboutPageSections = [
    { name: 'Hero Section', description: 'Manage the main image on the about us page.', href: '/admin/about/hero' },
    { name: 'Section Titles', description: 'Manage the titles for each section.', href: '/admin/about/section-titles' },
    { name: 'Mission & Vision', description: 'Update the mission and vision statements and images.', href: '/admin/about/mission-vision' },
    { name: 'Why Choose Us', description: 'Manage the reasons to choose your company.', href: '/admin/about/why-choose-us' },
    { name: 'Testimonials', description: 'Manage customer testimonials.', href: '/admin/about/testimonials' },
]

export default function AboutAdminPage() {
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
            <CardTitle className="font-headline font-light">About Us Page Content</CardTitle>
            <CardDescription>Select a section of the about us page to manage its content.</CardDescription>
        </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aboutPageSections.map(section => (
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
