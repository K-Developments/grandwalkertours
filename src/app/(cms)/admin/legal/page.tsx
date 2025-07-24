// src/app/(cms)/admin/legal/page.tsx
'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

const legalPages = [
    { name: 'Privacy Policy', description: 'Manage the content of the privacy policy page.', href: '/admin/legal/privacy-policy' },
    { name: 'Cookie Policy', description: 'Manage the content of the cookie policy page.', href: '/admin/legal/cookie-policy' },
]

export default function LegalAdminHubPage() {
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
            <CardTitle className="font-headline font-light">Legal Pages Content</CardTitle>
            <CardDescription>Select a legal page to manage its content.</CardDescription>
        </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {legalPages.map(page => (
                <Card key={page.name} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl font-light">{page.name}</CardTitle>
                        <CardDescription>{page.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                         <Button asChild variant="outline">
                            <Link href={page.href}>
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
