
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#services', label: 'Services' },
    { href: '/#about', label: 'About Us' },
    { href: '/#style-recommender', label: 'AI Stylist' },
    { href: '/#testimonials', label: 'Testimonials' },
    { href: '/#contact', label: 'Contact' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const NavItems = () => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium transition-colors hover:text-primary"
          onClick={handleLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-all duration-300", scrolled ? "bg-card/80 backdrop-blur-sm shadow-md" : "bg-transparent")}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground">Glamora</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavItems />
          <Button asChild>
            <Link href="/checkout">Book Now</Link>
          </Button>
           <Button asChild variant="outline" size="icon" className="relative">
              <Link href="/checkout">
                  <ShoppingCart className="h-4 w-4"/>
                  {isClient && totalItems > 0 && (
                     <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-1 text-xs">
                        {totalItems}
                    </Badge>
                  )}
                  <span className="sr-only">View Booking Cart</span>
              </Link>
           </Button>
        </nav>
        <div className="md:hidden flex items-center gap-2">
            <Button asChild variant="outline" size="icon" className="relative">
              <Link href="/checkout">
                  <ShoppingCart className="h-4 w-4"/>
                   {isClient && totalItems > 0 && (
                     <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-1 text-xs">
                        {totalItems}
                    </Badge>
                  )}
                  <span className="sr-only">View Booking Cart</span>
              </Link>
           </Button>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 mb-4" onClick={handleLinkClick}>
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold font-headline">Glamora</span>
                </Link>
                <div className="flex flex-col gap-4">
                  <NavItems />
                </div>
                <Button className="mt-4" onClick={handleLinkClick} asChild>
                    <Link href="/checkout">Book Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
