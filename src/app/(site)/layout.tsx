import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSsgTourPageTours, getSsgDestinationPageDestinations } from '@/lib/firebase/firestore';

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tours = await getSsgTourPageTours();
  const destinations = await getSsgDestinationPageDestinations();
  
  return (
    <div className="flex flex-col min-h-dvh">
      <Header tours={tours} destinations={destinations} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
