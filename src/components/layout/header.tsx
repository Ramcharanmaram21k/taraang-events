"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      {/* Use a full-bleed row so edges can be flush */}
      <div className="flex items-center justify-between w-full h-16 px-3 md:px-4">
        {/* Logo - flush to the extreme left */}
        <div className="flex items-center gap-3 ml-0">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Taraang Events Logo"
              width={36}
              height={36}
              priority
            />
            <span className="font-headline text-lg font-bold hidden sm:inline-block">
              Taraang Events
            </span>
          </Link>
        </div>

        {/* Desktop nav - flush to the extreme right */}
        <nav className="hidden md:flex items-center h-full">
          <ul className="flex items-center h-full">
            {navLinks.map(({ href, label }, idx) => (
              <li key={label} className={`${idx === 0 ? "ml-6" : "ml-6"}`}>
                <Link
                  href={href}
                  className="inline-block h-full flex items-center px-0 py-3 text-sm font-medium transition-colors hover:text-sky-600"
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

            <SheetContent side="left" className="pr-0">
              <div className="flex items-center justify-between p-4">
                <Link href="/" className="flex items-center gap-3">
                  <Image src="/logo.png" alt="Taraang Events" width={28} height={28} />
                  <span className="font-headline text-lg font-bold">Taraang Events</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="px-6 pb-10">
                <ul className="flex flex-col gap-4">
                  {navLinks.map(({ href, label }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="block text-lg font-medium transition-colors hover:text-sky-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {label}
                      </Link>
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
