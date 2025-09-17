import Image from "next/image";

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              About Taraang Events
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Taraang Events is a premier event management company specializing in creating unforgettable experiences. From elegant weddings and professional corporate events to vibrant parties and traditional Indian functions, our dedicated team brings your vision to life with creativity, precision, and passion.
            </p>
             <p className="mt-4 text-lg text-muted-foreground">
              We believe every event tells a unique story, and we are committed to making yours exceptional.
            </p>
          </div>
          <div className="order-1 md:order-2">
             <Image
              src="https://picsum.photos/seed/aboutus/600/600"
              alt="Team discussing event plans"
              width={600}
              height={600}
              className="rounded-lg shadow-xl"
              data-ai-hint="team planning"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
