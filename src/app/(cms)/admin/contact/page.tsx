// src/app/(cms)/admin/contact/page.tsx
'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

const contactPageSections = [
    { name: 'Hero Section', description: 'Manage the main image on the contact us page.', href: '/admin/contact/hero' },
    { name: 'Contact Details', description: 'Update the address, phone, email, and image.', href: '/admin/contact/details' },
]

export default function ContactAdminPage() {
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
            <CardTitle className="font-headline font-light">Contact Us Page Content</CardTitle>
            <CardDescription>Select a section of the contact us page to manage its content.</CardDescription>
        </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactPageSections.map(section => (
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
