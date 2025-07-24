import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsentBanner from '@/components/cookie-consent-banner';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
}
