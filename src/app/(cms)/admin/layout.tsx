// src/app/(cms)/admin/layout.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MapPin,
  ImageIcon,
  Newspaper,
  Palette,
  ConciergeBell,
  Info,
  Menu,
  ChevronLeft,
  Phone,
  Users,
  HelpCircle,
  Gavel,
  GalleryHorizontal,
  Car,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { href: '/admin/logo', icon: ImageIcon, label: 'Logo Update' },
  { href: '/admin/homepage', icon: Newspaper, label: 'Homepage' },
  { href: '/admin/about', icon: Info, label: 'About Us' },
  { href: '/admin/destinations', icon: MapPin, label: 'Destinations' },
  { href: '/admin/services', icon: ConciergeBell, label: 'Services' },
  { href: '/admin/tours', icon: Palette, label: 'Tours' },
  { href: '/admin/gallery', icon: GalleryHorizontal, label: 'Gallery' },
  { href: '/admin/blog', icon: BookOpen, label: 'Blog' },
  { href: '/admin/rent-a-car', icon: Car, label: 'Rent a Car' },
  { href: '/admin/contact', icon: Phone, label: 'Contact Page' },
  { href: '/admin/faq', icon: HelpCircle, label: 'FAQ Page' },
  { href: '/admin/user-tracking', icon: Users, label: 'User Tracking' },
  { href: '/admin/legal', icon: Gavel, label: 'Legal Pages' },
];

const AdminSidebarNav = ({ isMobile = false, isCollapsed = false }: { isMobile?: boolean, isCollapsed?: boolean }) => {
  const pathname = usePathname();
  const NavLinkComponent = isMobile ? SheetClose : 'div';

  return (
    <nav className="grid items-start gap-2 text-sm font-medium">
      <TooltipProvider delayDuration={0}>
        {navItems.map((item) =>
          isCollapsed && !isMobile ? (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary md:h-8 md:w-8',
                    pathname.startsWith(item.href) && item.href !== '/admin' || pathname === item.href ? 'bg-muted text-primary' : ''
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            <NavLinkComponent key={item.href} asChild>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname.startsWith(item.href) && item.href !== '/admin' || pathname === item.href ? 'bg-muted text-primary' : ''
                )}
              >
                {isMobile && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            </NavLinkComponent>
          )
        )}
      </TooltipProvider>
    </nav>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div
      className={cn(
        'grid min-h-screen w-full transition-[grid-template-columns]',
        isSidebarCollapsed ? 'md:grid-cols-[60px_1fr]' : 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'
      )}
    >
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 relative">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6 text-primary" />
              {!isSidebarCollapsed && <span className="font-bold text-primary">Grand Explorer</span>}
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <div className={cn('px-4', isSidebarCollapsed && 'px-2 flex justify-center')}>
              <AdminSidebarNav isCollapsed={isSidebarCollapsed} />
            </div>
          </div>
          <div className="mt-auto p-4 border-t">
            <Button
              variant="outline"
              size="icon"
              className="w-full"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <ChevronLeft
                className={cn(
                  'h-5 w-5 transition-transform',
                  isSidebarCollapsed && 'rotate-180'
                )}
              />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header & Main Content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <Logo className="h-6 w-6 text-primary" />
                  <span className="font-bold text-primary">Grand Explorer</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <AdminSidebarNav isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add breadcrumbs or search here in the future */}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
