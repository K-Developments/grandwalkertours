// src/app/(site)/faq/page.tsx
import Link from 'next/link';
import { getSsgFaqItems, getFaqPageHeroContentSSG } from '@/lib/firebase/firestore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import MotionWrapper from '@/app/(components)/motion-wrapper';
import FaqHero from '@/app/faq/(components)/hero';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about our tours, booking process, and travel policies. Grand Walker Tours is here to help you plan your perfect journey.',
};

export default async function FAQPage() {
  const faqItems = await getSsgFaqItems();
  const heroContent = await getFaqPageHeroContentSSG();

  return (
    <>
      <FaqHero content={heroContent} />
      <div className="container mx-auto px-4 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-muted-foreground">--&gt;</span>
                <span className="ml-1 text-sm font-medium text-foreground md:ml-2">
                  FAQ
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <MotionWrapper>
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            {faqItems.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item) => (
                  <AccordionItem value={item.id!} key={item.id}>
                    <AccordionTrigger className="text-lg text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>
                  No frequently asked questions have been added yet. Please
                  check back later.
                </p>
              </div>
            )}
          </div>
        </section>
      </MotionWrapper>
    </>
  );
}
