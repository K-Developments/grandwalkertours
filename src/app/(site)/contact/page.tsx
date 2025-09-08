// src/app/contact/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import ContactHero from '@/app/contact/(components)/hero';
import ContactFormSection from '@/app/contact/(components)/contact-form-section';
import MotionWrapper from '@/app/(components)/motion-wrapper';
import { getContactPageHeroContentSSG, getContactPageDetailsContentSSG } from '@/lib/firebase/firestore';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Grand Walker Tours. We are here to answer your questions and help you plan your next unforgettable journey to Sri Lanka. Reach out via phone, email, or our contact form.',
}

export default async function ContactPage() {
  const heroContent = await getContactPageHeroContentSSG();
  const detailsContent = await getContactPageDetailsContentSSG();

  return (
    <>
      <ContactHero content={heroContent} />
      <div className="container mx-auto px-4 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-muted-foreground">--&gt;</span>
                  <span className="ml-1 text-sm font-medium text-foreground md:ml-2">Contact Us</span>
                </div>
              </li>
            </ol>
          </nav>
      </div>
      <MotionWrapper>
        <ContactFormSection content={detailsContent} />
      </MotionWrapper>
    </>
  );
}
