"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { getAiLayout } from "@/app/actions";
import { useState, useTransition } from "react";
import type { GalleryLayout } from "@/ai/flows/layout-gallery-flow";
import { Skeleton } from "../ui/skeleton";

const galleryImageIds = [
  "gallery-1",
  "gallery-2",
  "gallery-3",
  "gallery-4",
  "gallery-5",
  "gallery-6",
];

const initialLayout: GalleryLayout = {
  layout: [
    { id: "gallery-1", colSpan: 2, rowSpan: 2 },
    { id: "gallery-2", colSpan: 1, rowSpan: 1 },
    { id: "gallery-3", colSpan: 1, rowSpan: 1 },
    { id: "gallery-4", colSpan: 1, rowSpan: 1 },
    { id: "gallery-5", colSpan: 1, rowSpan: 1 },
  ],
};

const Gallery = () => {
  const [layout, setLayout] = useState<GalleryLayout>(initialLayout);
  const [isPending, startTransition] = useTransition();

  const images = PlaceHolderImages.filter((img) =>
    galleryImageIds.includes(img.id)
  );

  const handleLayout = () => {
    startTransition(async () => {
      const result = await getAiLayout();
      setLayout(result);
    });
  };

  return (
    <section id="gallery" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Event Gallery Showcase
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore a curated collection of our finest work and draw inspiration for your next event.
          </p>
          <Button onClick={handleLayout} disabled={isPending} className="mt-6">
            <Sparkles className="mr-2 h-4 w-4" />
            {isPending ? "Generating..." : "Ask AI to Redesign"}
          </Button>
        </div>
        
        {isPending ? (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
              <Skeleton className="col-span-2 row-span-2" />
              <Skeleton className="col-span-1 row-span-1" />
              <Skeleton className="col-span-1 row-span-1" />
              <Skeleton className="col-span-1 row-span-1" />
              <Skeleton className="col-span-1 row-span-1" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
            {layout.layout.map((item) => {
              const image = images.find((img) => img.id === item.id);
              if (!image) return null;

              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg shadow-lg"
                  style={{
                    gridColumn: `span ${item.colSpan}`,
                    gridRow: `span ${item.rowSpan}`,
                  }}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                   <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                     <p className="text-sm font-semibold text-white">{image.description}</p>
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
