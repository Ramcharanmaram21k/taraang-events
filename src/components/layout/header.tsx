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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-3 mr-auto">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Taraang Events Logo"
              width={40}
              height={40}
              priority
              className="drop-shadow-sm"
            />
            <span className="font-headline text-xl font-bold hidden sm:inline-block">
              Taraang Events
            </span>
          </Link>
        </div>

        <nav>
          <ul className="flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <li key={label} className="hidden md:block">
                <Link
                  href={href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="pr-0">
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center gap-3">
                  <Image src="/logo.png" alt="Taraang Events" width={32} height={32} className="drop-shadow-sm"/>
                  <span className="font-headline text-lg font-bold">Taraang Events</span>
                </Link>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </div>

              <nav className="p-6">
                <ul className="flex flex-col gap-6">
                  {navLinks.map(({ href, label }) => (
                    <li key={label}>
                      <SheetClose asChild>
                        <Link
                          href={href}
                          className="block text-lg font-medium transition-colors hover:text-primary"
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
