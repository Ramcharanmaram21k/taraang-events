"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Taraang Events Logo"
              width={48}
              height={48}
              priority
              className="drop-shadow-lg"
            />
            <span className="font-headline text-lg font-bold hidden sm:inline-block">
              Taraang Events
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm font-medium transition-colors hover:text-primary-foreground/80"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="p-0 bg-primary text-primary-foreground border-l-0">
               <SheetHeader className="flex flex-row items-center justify-between p-4 border-b border-primary-foreground/20">
                 <SheetTitle>
                   <Link href="/" className="flex items-center gap-3">
                     <Image src="/logo.png" alt="Taraang Events" width={48} height={48} className="drop-shadow-lg"/>
                     <span className="font-headline text-lg font-bold">Taraang Events</span>
                   </Link>
                 </SheetTitle>
                 <SheetClose asChild>
                    <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => setIsMobileMenuOpen(false)}
                     aria-label="Close menu"
                     className="hover:bg-primary-foreground/10 focus:ring-0"
                   >
                     <X className="h-5 w-5" />
                   </Button>
                 </SheetClose>
               </SheetHeader>
              <nav className="px-6 pb-10 mt-6">
                <ul className="flex flex-col gap-4">
                  {navLinks.map(({ href, label }) => (
                    <li key={label}>
                      <SheetClose asChild>
                        <Link
                          href={href}
                          className="block text-lg font-medium transition-colors hover:text-primary-foreground/80"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
