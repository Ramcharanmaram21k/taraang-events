import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const services = [
  {
    title: "Wedding Functions",
    imageId: "service-wedding",
  },
  {
    title: "Corporate Events",
    imageId: "service-corporate",
  },
  {
    title: "Parties / Receptions",
    imageId: "service-party",
  },
  {
    title: "Local Indian Functions",
    imageId: "service-indian-event",
  },
];

const Services = () => {
  return (
    <section id="services" className="bg-secondary py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We offer a wide range of services to make your special occasion memorable.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const image = PlaceHolderImages.find(
              (img) => img.id === service.imageId
            );
            return (
              <Card key={service.title} className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                {image && (
                  <div className="aspect-w-3 aspect-h-2">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      width={600}
                      height={400}
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
