'use server';

import { logCookieConsent } from '@/lib/firebase/firestore';

export async function handleCookieConsent() {
  try {
    await logCookieConsent();
    return { success: true };
  } catch (error) {
    console.error('Failed to log cookie consent:', error);
    return { success: false, error: 'Failed to log consent.' };
  }
}
