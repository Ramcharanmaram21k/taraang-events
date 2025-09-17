"use server";

import { layoutGallery } from "@/ai/flows/layout-gallery-flow";
import type { GalleryLayout } from "@/ai/flows/layout-gallery-flow";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const galleryImageIds = [
  "gallery-1",
  "gallery-2",
  "gallery-3",
  "gallery-4",
  "gallery-5",
  "gallery-6",
];

export async function getAiLayout(): Promise<GalleryLayout> {
    const images = PlaceHolderImages.filter((img) =>
        galleryImageIds.includes(img.id)
    );
    const imageUrls = images.map((img) => ({id: img.id, description: img.description, hint: img.imageHint}));
    const layout = await layoutGallery({images: imageUrls});
    return layout;
}