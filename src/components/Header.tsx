
'use client';

import React, { useState, useEffect } from 'react';
import {
  Phone,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Menu,
  X,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getTourPageTours, getDestinationPageDestinations } from '@/lib/firebase/firestore';
import type { Tour, Destination } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';

const topNavLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/faq', label: 'FAQ' },
   { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isToursMenuOpen, setIsToursMenuOpen] = useState(false);
  const [isDestinationsMenuOpen, setIsDestinationsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const unsubscribeTours = getTourPageTours(setTours);
    const unsubscribeDestinations = getDestinationPageDestinations(setDestinations);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeTours();
      unsubscribeDestinations();
    };
  }, []);
  
  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, transition: { duration: 0.2, ease: 'easeOut' } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeIn' } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2, ease: 'easeOut' } },
  };

  const largeLogoVariants = {
    hidden: { opacity: 0, height: "50%", transition: { duration: 0.3, ease: 'easeOut' } },
    visible: { opacity: 1, height: "100%", transition: { duration: 0.4, ease: 'easeIn' } },
  };

  const smallLogoVariants = {
     hidden: { opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } },
     visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeIn', delay: 0.1 } },
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 md:border-none border-t-[0.3rem] border-primary ',
        isScrolled || isMobile
          ? 'bg-[hsl(var(--background))]  shadow-md'
          : 'bg-transparent'
      )}
    >
      {/* --- TOP BAR --- */}
      <AnimatePresence>
        {!isScrolled && !isMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-[#ffffffeb]"
          >
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center h-10 text-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <a href="#" className="text-black hover:text-primary">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-black hover:text-primary">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-black hover:text-primary">
                      <Facebook className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                  {topNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="font-body text-black hover:text-primary transition-colors uppercase"
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN BAR --- */}
      <div className={cn(
        "container mx-auto px-4 py-0",
         !isScrolled || isMobile ? "py-0" : "py-5"
        )}>
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          isScrolled || isMobile ? "h-16" : "h-20"
        )}>
          <Link href="/" className="flex items-center gap-2 h-full">
            <AnimatePresence mode="wait">
              {(!isScrolled && !isMobile) ? (
                <motion.div
                  key="large-logo"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={largeLogoVariants}
                  className="relative h-full  "
                >
                  <Image
                    src="/logo-dark.png"
                    alt="Grand Walker Tours Logo"
                    width={150}
                    height={150}
                    className="object-contain "
                   />
                </motion.div>
              ) : (
                <motion.div
                  key="small-logo"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={smallLogoVariants}
                >
                  <Image
                    src="/logo-light.png"
                    alt="Grand Walker Tours Logo"
                    width={120}
                    height={36}
                    className="object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8  ">
            <ul
              className={cn(
                'flex items-center gap-8 font-body uppercase',
                isScrolled || isMobile ? 'text-black' : 'text-primary-foreground '
              )}
            >
              <li><Link href="/" className="text-lg hover:text-primary transition-colors">Home</Link></li>
              
              <DropdownMenu open={isToursMenuOpen} onOpenChange={setIsToursMenuOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                  <Link 
                    href="/tours" 
                    className="flex items-center gap-1 text-lg hover:text-primary transition-colors focus:outline-none"
                    onMouseEnter={() => setIsToursMenuOpen(true)}
                    onMouseLeave={() => setIsToursMenuOpen(false)}
                  >
                    Tours 
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isToursMenuOpen && "rotate-180")} />
                  </Link>
                </DropdownMenuTrigger>
                <AnimatePresence>
                  {isToursMenuOpen && (
                    <DropdownMenuContent 
                      asChild
                      onMouseEnter={() => setIsToursMenuOpen(true)}
                      onMouseLeave={() => setIsToursMenuOpen(false)}
                      align="start"
                      className="bg-background/80 backdrop-blur-md border-white/20 shadow-xl min-w-[240px]"
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                      >
                        {tours.map((tour) => (
                          <React.Fragment key={tour.id}>
                            <DropdownMenuItem asChild className="font-body text-base py-2.5 px-4 focus:bg-primary/10 focus:text-primary cursor-pointer uppercase">
                              <Link href={`/tours?tourId=${tour.id}`}>{tour.name}</Link>
                            </DropdownMenuItem>
                          </React.Fragment>
                        ))}
                      </motion.div>
                    </DropdownMenuContent>
                  )}
                </AnimatePresence>
              </DropdownMenu>

              <DropdownMenu open={isDestinationsMenuOpen} onOpenChange={setIsDestinationsMenuOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                  <Link 
                    href="/destinations" 
                    className="flex items-center gap-1 text-lg hover:text-primary transition-colors focus:outline-none"
                    onMouseEnter={() => setIsDestinationsMenuOpen(true)}
                    onMouseLeave={() => setIsDestinationsMenuOpen(false)}
                  >
                    Destinations
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isDestinationsMenuOpen && "rotate-180")} />
                  </Link>
                </DropdownMenuTrigger>
                <AnimatePresence>
                  {isDestinationsMenuOpen && (
                    <DropdownMenuContent 
                      asChild
                      onMouseEnter={() => setIsDestinationsMenuOpen(true)}
                      onMouseLeave={() => setIsDestinationsMenuOpen(false)}
                      align="start"
                      className="bg-background/80 backdrop-blur-md border-white/20 shadow-xl min-w-[240px]"
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                      >
                        {destinations.map((destination) => (
                          <React.Fragment key={destination.id}>
                            <DropdownMenuItem asChild className="font-body text-base py-2.5 px-4 focus:bg-primary/10 focus:text-primary cursor-pointer uppercase">
                              <Link href={`/destinations?destinationId=${destination.id}`}>{destination.name}</Link>
                            </DropdownMenuItem>
                          </React.Fragment>
                        ))}
                      </motion.div>
                    </DropdownMenuContent>
                  )}
                </AnimatePresence>
              </DropdownMenu>
              
              <li><Link href="/rent-a-car" className="text-lg hover:text-primary transition-colors">Rent a Car</Link></li>
              <li><Link href="/contact" className="text-lg hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </nav>

          {/* Mobile & Scrolled Nav Trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'hover:bg-white/20',
                    isScrolled || isMobile ? 'text-black hover:bg-accent/20' : 'text-primary-foreground'
                  )}
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                      <Image
                        src="/logo-dark.png"
                        alt="Grand Walker Tours Logo"
                        width={120}
                        height={36}
                        className="object-contain"
                      />
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex-grow p-6 overflow-y-auto">
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full flex flex-col gap-2"
                    >
                      <SheetClose asChild>
                        <Link
                          href="/"
                          className="font-body text-xl text-foreground hover:text-primary transition-colors w-full text-left py-2 uppercase"
                        >
                          Home
                        </Link>
                      </SheetClose>
                     
                      <AccordionItem value="tours" className="border-b-0">
                        <AccordionTrigger className="font-body text-xl text-foreground hover:text-primary transition-colors py-2 [&[data-state=open]>svg]:text-primary uppercase">
                          <Link href="/tours">Tours</Link>
                        </AccordionTrigger>
                        <AccordionContent className="pl-4">
                          <ul className="flex flex-col gap-2 mt-2">
                            {tours.map(tour => (
                              <li key={tour.id}>
                                <SheetClose asChild>
                                  <Link
                                    href={`/tours?tourId=${tour.id}`}
                                    className="text-muted-foreground hover:text-primary transition-colors uppercase"
                                  >
                                    {tour.name}
                                  </Link>
                                </SheetClose>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="destinations" className="border-b-0">
                        <AccordionTrigger className="font-body text-xl text-foreground hover:text-primary transition-colors py-2 [&[data-state=open]>svg]:text-primary uppercase">
                          <Link href="/destinations">Destinations</Link>
                        </AccordionTrigger>
                        <AccordionContent className="pl-4">
                          <ul className="flex flex-col gap-2 mt-2">
                            {destinations.map(destination => (
                              <li key={destination.id}>
                                <SheetClose asChild>
                                  <Link
                                    href={`/destinations?destinationId=${destination.id}`}
                                    className="text-muted-foreground hover:text-primary transition-colors uppercase"
                                  >
                                    {destination.name}
                                  </Link>
                                </SheetClose>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <SheetClose asChild>
                        <Link
                          href="/rent-a-car"
                          className="font-body text-xl text-foreground hover:text-primary transition-colors w-full text-left py-2 uppercase"
                        >
                          Rent a Car
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/gallery"
                          className="font-body text-xl text-foreground hover:text-primary transition-colors w-full text-left py-2 uppercase"
                        >
                          Gallery
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/contact"
                          className="font-body text-xl text-foreground hover:text-primary transition-colors w-full text-left py-2 uppercase"
                        >
                          Contact
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          href="/about"
                          className="font-body text-xl text-foreground hover:text-primary transition-colors w-full text-left py-2 uppercase"
                        >
                          About Us
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/services"
                          className="font-body text-xl text-foreground hover:text-primary transition-colors w-full text-left py-2 uppercase"
                        >
                          Services
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/faq"
                          className="font-body text-xl text-foreground hover:text-primary transition-colors w-full text-left py-2 uppercase"
                        >
                          FAQ
                        </Link>
                      </SheetClose>
                    </Accordion>
                  </nav>
                  <div className="p-6 border-t mt-auto">
                    <Button className="w-full" asChild>
                      <SheetClose asChild>
                        <Link href="/contact">Inquire Now</Link>
                      </SheetClose>
                    </Button>
                    <div className="flex justify-center gap-4 mt-4">
                      <a href="#" className="text-muted-foreground hover:text-primary">
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-primary">
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a href="#" className="text-muted-foreground hover:text-primary">
                        <Facebook className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
