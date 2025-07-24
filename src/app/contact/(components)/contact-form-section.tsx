// src/app/contact/(components)/contact-form-section.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { getContactPageDetailsContent } from '@/lib/firebase/firestore';
import type { ContactPageDetailsContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  country: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactInfoItem = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <div className="bg-primary text-primary-foreground p-3 rounded-full">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <div className="text-muted-foreground">{children}</div>
        </div>
    </div>
);

export default function ContactFormSection() {
  const [content, setContent] = useState<ContactPageDetailsContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getContactPageDetailsContent((data) => {
      setContent(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", country: "", phone: "", subject: "", message: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ContactFormValues) => {
    // Here you would typically send the form data to a server or email service.
    // For this example, we'll just simulate a delay and show a toast.
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(data);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We will get back to you shortly.",
    });
    form.reset();
  };

  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Contact Form First */}
        <div className="bg-card p-8 md:p-12 rounded-lg shadow-lg mb-12 md:mb-24">
            <h2 className="font-headline text-3xl md:text-4xl font-light text-foreground mb-6 text-center">Send Us a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col items-center gap-4">
                    {/* reCAPTCHA Placeholder */}
                    <div className="w-full max-w-xs h-20 bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">reCAPTCHA goes here</p>
                    </div>

                    <Button type="submit" className="w-full max-w-xs" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                        </>
                    ) : (
                        'Send Message'
                    )}
                    </Button>
                </div>
              </form>
            </Form>
        </div>

        {/* Contact Info and Image */}
        {loading ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="pt-8 space-y-6">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
                <Skeleton className="h-80 md:h-96 w-full" />
             </div>
        ) : content ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
                <div>
                <h2 className="font-headline text-3xl md:text-4xl font-light text-foreground mb-4">Get In Touch</h2>
                <p className="text-muted-foreground max-w-lg">
                    We're here to help you plan your next adventure. Whether you have a question about our tours, need a custom itinerary, or just want to say hello, we'd love to hear from you.
                </p>
                </div>
                <div className="space-y-6">
                    <ContactInfoItem icon={MapPin} title="Our Office">
                        <p>{content.addressLine1}</p>
                        <p>{content.addressLine2}</p>
                    </ContactInfoItem>
                    <ContactInfoItem icon={Mail} title="Email Us">
                        <a href={`mailto:${content.email}`} className="hover:text-primary transition-colors">{content.email}</a>
                    </ContactInfoItem>
                    <ContactInfoItem icon={Phone} title="Call Us">
                        <a href={`tel:${content.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">{content.phone}</a>
                    </ContactInfoItem>
                </div>
            </div>
            <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                    src={content.image || "https://placehold.co/600x400.png"}
                    alt="Contact illustration"
                    fill
                    className="object-cover"
                    data-ai-hint={content.imageHint || "travel agency office"}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={95}
                />
            </div>
            </div>
        ) : (
            <div className="text-center text-muted-foreground">
                <p>Contact details are not available at the moment. Please configure them in the admin panel.</p>
            </div>
        )}
      </div>
    </section>
  );
}
