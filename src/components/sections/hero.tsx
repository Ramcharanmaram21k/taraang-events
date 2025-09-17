import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-1");

  return (
    <section id="home" className="relative h-[calc(100vh-4rem)] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="font-headline text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          Crafting Memories That Last Forver
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl">
        From weddings to corporate celebrations, Taraang Events brings your vision to life.
        </p>
        <Button asChild className="mt-8" size="lg">
          <Link href="#contact">Plan you Event</Link>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
