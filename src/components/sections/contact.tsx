import { Phone } from "lucide-react";
import ContactForm from "@/components/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const contactDetails = [
  {
    name: "Ramcharan",
    phone: "6300016126",
  },
  {
    name: "K. Ramakrishna",
    phone: "9494555291",
  },
];

const Contact = () => {
  return (
    <section id="contact" className="bg-secondary py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Get In Touch
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Have a question or ready to plan your event? Contact us today!
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <h3 className="font-headline text-2xl font-bold">Contact Information</h3>
            <div className="space-y-6">
              {contactDetails.map((contact) => (
                <Card key={contact.name}>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{contact.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-lg transition-colors hover:text-primary">
                      <Phone className="h-5 w-5" />
                      <span>{contact.phone}</span>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="space-y-8">
             <h3 className="font-headline text-2xl font-bold">Send Us a Message</h3>
             <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
