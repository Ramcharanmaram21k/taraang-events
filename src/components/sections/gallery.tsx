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

  const [
    img1,
    img2,
    img3,
    img4,
    img5,
  ] = images;

  return (
    <section id="gallery" className="py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Our Gallery
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A glimpse into the unforgettable moments we've crafted.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 grid-rows-2 gap-4 md:grid-cols-4">
          {img1 && (
            <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={img1.imageUrl.replace('/600/400', '/800/800')}
                alt={img1.description}
                width={800}
                height={800}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={img1.imageHint}
              />
               <div className="absolute inset-0 bg-black/20" />
            </div>
          )}
          {img2 && (
             <div className="group relative overflow-hidden rounded-lg shadow-lg">
               <Image
                src={img2.imageUrl}
                alt={img2.description}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={img2.imageHint}
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-sm font-semibold text-white">{img2.description}</p>
              </div>
            </div>
          )}
          {img3 && (
             <div className="group relative overflow-hidden rounded-lg shadow-lg">
               <Image
                src={img3.imageUrl}
                alt={img3.description}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={img3.imageHint}
              />
               <div className="absolute inset-0 bg-black/20" />
            </div>
          )}
          {img4 && (
             <div className="group relative overflow-hidden rounded-lg shadow-lg">
               <Image
                src={img4.imageUrl}
                alt={img4.description}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={img4.imageHint}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}
          {img5 && (
             <div className="group relative overflow-hidden rounded-lg shadow-lg">
               <Image
                src={img5.imageUrl}
                alt={img5.description}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={img5.imageHint}
              />
               <div className="absolute inset-0 bg-black/20" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
