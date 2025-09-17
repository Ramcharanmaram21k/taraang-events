import {
  Heart,
  Briefcase,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const services = [
  {
    title: "Weddings",
    description: "Creating magical moments for your special day, from intimate ceremonies to grand celebrations.",
    icon: Heart,
  },
  {
    title: "Corporate Events",
    description: "Professional and seamless execution for conferences, product launches, and company parties.",
    icon: Briefcase,
  },
  {
    title: "Parties & Socials",
    description: "Designing vibrant and memorable parties for birthdays, anniversaries, and social gatherings.",
    icon: PartyPopper,
  },
  {
    title: "Custom Celebrations",
    description: "Have a unique idea? We specialize in bringing one-of-a-kind event concepts to life.",
    icon: Sparkles,
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
            We offer a wide range of services to make your event perfect.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="text-center transition-shadow duration-300 hover:shadow-xl">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="font-headline text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
