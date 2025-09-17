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
              At Taraang Events, we believe that every event is a canvas for
              creating unforgettable memories. Our passion lies in blending{" "}
              <span className="text-primary font-semibold">local tradition</span> with{" "}
              <span className="text-primary font-semibold">modern innovation</span>,
              ensuring each celebration is both authentic and spectacular. With a
              foundation built on{" "}
              <span className="text-primary font-semibold">professionalism</span>,
              boundless{" "}
              <span className="text-primary font-semibold">creativity</span>, and
              deep-seated{" "}
              <span className="text-primary font-semibold">cultural expertise</span>, we
              have earned the trust of our clients to bring their cherished
              visions to life. We work to craft not just events, but meaningful
              experiences, leaving lasting impressions. We handle the intricate
              details so you can immerse yourself in the joy of the moment.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              We believe every event tells a unique story, and we are committed
              to making yours exceptional.
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
