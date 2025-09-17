import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Taraang Events Logo" width={32} height={32} />
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
