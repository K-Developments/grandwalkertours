

'use client';

import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};


const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div 
            className="md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="w-8 h-8 text-primary" />
              <span className="font-headline text-2xl font-bold text-foreground">Grand Walker Tours</span>
            </Link>
            <p className="text-muted-foreground text-sm">Journeys Beyond the Ordinary.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:col-span-3">
            <div>
              <motion.h4 
                className="font-headline font-extralight mb-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                Explore
              </motion.h4>
              <motion.ul 
                className="space-y-2"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                <motion.li variants={itemVariants}><Link href="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link></motion.li>
                <motion.li variants={itemVariants}><Link href="/tours" className="text-sm text-muted-foreground hover:text-primary">Tours</Link></motion.li>
                <motion.li variants={itemVariants}><Link href="/destinations" className="text-sm text-muted-foreground hover:text-primary">Destinations</Link></motion.li>
                <motion.li variants={itemVariants}><Link href="/rent-a-car" className="text-sm text-muted-foreground hover:text-primary">Rent a Car</Link></motion.li>
                <motion.li variants={itemVariants}><Link href="/services" className="text-sm text-muted-foreground hover:text-primary">Services</Link></motion.li>
                <motion.li variants={itemVariants}><Link href="/gallery" className="text-sm text-muted-foreground hover:text-primary">Gallery</Link></motion.li>
              </motion.ul>
            </div>
            <div>
              <motion.h4 
                className="font-headline font-extralight mb-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                Company
              </motion.h4>
               <motion.ul 
                className="space-y-2"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                <motion.li variants={itemVariants}><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></motion.li>
                <motion.li variants={itemVariants}><a href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</a></motion.li>
                <motion.li variants={itemVariants}><a href="#" className="text-sm text-muted-foreground hover:text-primary">Press</a></motion.li>
              </motion.ul>
            </div>
            <div>
              <motion.h4 
                className="font-headline font-extralight mb-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                Support
              </motion.h4>
               <motion.ul 
                className="space-y-2"
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
              >
                <motion.li variants={itemVariants}><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></motion.li>
                <motion.li variants={itemVariants}><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></motion.li>
                <motion.li variants={itemVariants}><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></motion.li>
                <motion.li variants={itemVariants}><Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link></motion.li>
              </motion.ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Grand Walker Tours. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button variant="ghost" size="icon" asChild><a href="#"><Twitter className="w-5 h-5" /></a></Button>
            <Button variant="ghost" size="icon" asChild><a href="#"><Instagram className="w-5 h-5" /></a></Button>
            <Button variant="ghost" size="icon" asChild><a href="#"><Facebook className="w-5 h-5" /></a></Button>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground/80">
          <p>Design &amp; Development by Limidora</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
