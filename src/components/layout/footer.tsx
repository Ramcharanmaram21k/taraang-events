import Link from "next/link";
import Logo from "@/components/logo";

const Footer = () => {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <p className="font-headline text-lg font-bold">Taraang Events</p>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Taraang Events. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
