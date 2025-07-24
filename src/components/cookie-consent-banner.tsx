
// src/components/cookie-consent-banner.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { handleCookieConsent } from '@/app/actions';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // This code runs only on the client-side, after hydration
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === null) {
      // No consent has been given yet
      setIsVisible(true);
    }
  }, []);

  const handleAccept = async () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    // Call server action to log the consent
    await handleCookieConsent();
  };
  
  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
     console.log('Cookie consent declined.');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed bottom-4 right-4 z-50 w-full max-w-sm"
        >
          <div className="bg-card p-6 rounded-lg shadow-2xl border">
            <div className="flex items-start gap-4">
              <Cookie className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="font-headline text-lg font-semibold">We Use Cookies</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Our website uses cookies to analyze our traffic. By clicking "Accept", you consent to our use of cookies. Read our{' '}
                  <Link href="/cookie-policy" className="underline hover:text-primary">Cookie Policy</Link> for more details.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" size="sm" onClick={handleDecline}>Decline</Button>
              <Button variant="default" size="sm" onClick={handleAccept}>Accept</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
