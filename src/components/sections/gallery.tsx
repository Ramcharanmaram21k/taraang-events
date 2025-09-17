import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const galleryImageIds = [
  "gallery-1",
  "gallery-2",
  "gallery-3",
  "gallery-4",
  "gallery-5",
  "gallery-6",
];

const Gallery = () => {
  const images = PlaceHolderImages.filter((img) =>
    galleryImageIds.includes(img.id)
  );

  return (
    <section id="gallery" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Our Gallery
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A glimpse into the beautiful moments we've helped create.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {images.map((image, idx) => (
            <div
              key={image.id}
              className={`overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 ${
                idx === 0 || idx === 5 ? 'md:col-span-1' : ''
              } ${
                idx === 2 ? 'md:col-span-1' : ''
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={image.description}
                width={600}
                height={400}
                className="h-full w-full object-cover"
                data-ai-hint={image.imageHint}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
