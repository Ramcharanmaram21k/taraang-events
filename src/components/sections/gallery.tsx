'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { getAiLayout } from '@/app/actions';
import { useState, useTransition, useRef } from 'react';
import type { GalleryLayout } from '@/ai/flows/layout-gallery-flow';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const galleryImageIds = [
  'gallery-1',
  'gallery-2',
  'gallery-3',
  'gallery-4',
  'gallery-5',
  'gallery-6',
];

const initialLayout: GalleryLayout = {
  layout: [
    { id: 'gallery-1', colSpan: 2, rowSpan: 2 },
    { id: 'gallery-2', colSpan: 1, rowSpan: 1 },
    { id: 'gallery-3', colSpan: 1, rowSpan: 1 },
    { id: 'gallery-4', colSpan: 1, rowSpan: 1 },
    { id: 'gallery-5', colSpan: 1, rowSpan: 1 },
  ],
};

type ImageItem = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const Gallery = () => {
  const [layout, setLayout] = useState<GalleryLayout>(initialLayout);
  const [images, setImages] = useState<ImageItem[]>(
    PlaceHolderImages.filter((img) => galleryImageIds.includes(img.id))
  );
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    if (files.length > 6) {
      toast({
        variant: 'destructive',
        title: 'Too many images',
        description: 'Please select a maximum of 6 images.',
      });
      return;
    }

    const filePromises = Array.from(files).map((file) => {
      return new Promise<{ id: string; description: string; url: string; hint: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: file.name,
            description: 'User uploaded image',
            hint: 'user upload',
            url: e.target?.result as string,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    startTransition(async () => {
      try {
        const newImagesForAI = await Promise.all(filePromises);
        const newImagesForState = newImagesForAI.map(img => ({
          id: img.id,
          description: img.description,
          imageUrl: img.url,
          imageHint: img.hint
        }));
        
        const result = await getAiLayout({ images: newImagesForAI });
        
        setImages(newImagesForState);
        setLayout(result);

      } catch (error) {
        console.error('Error processing images or getting layout:', error);
        toast({
            variant: 'destructive',
            title: 'Layout Generation Failed',
            description: 'There was an error generating the layout. Please try again.',
        });
      }
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section id="gallery" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Event Gallery Showcase
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore a curated collection of our finest work or upload your own images to get a custom layout.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            multiple
          />
          <Button onClick={handleButtonClick} disabled={isPending} className="mt-6">
            <Sparkles className="mr-2 h-4 w-4" />
            {isPending ? 'Generating...' : 'AI Layout Assistant'}
          </Button>
        </div>

        {isPending ? (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className={`col-span-1 row-span-1 ${i === 0 ? 'col-span-2 row-span-2' : ''}`} />
            ))}
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
                    <p className="text-sm font-semibold text-white">
                      {image.description === 'User uploaded image' ? image.id : image.description}
                    </p>
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
