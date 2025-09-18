import { Mail, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/contactForm";
import { Toaster } from 'react-hot-toast';

const contactDetails = [
    {
        name: "K. Ramakrishna",
        phone: "9494555291",
        role: "Event Manager",
    },
    {
        name: "M. Ramcharan",
        phone: "6300016126",
        role: "Coordinator",
    },
];

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
    >
        <path d="M16.65,13.46C16.4,13.34,15.2,12.78,15,12.68C14.75,12.58,14.6,12.5,14.45,12.75C14.3,13,13.85,13.6,13.7,13.75C13.55,13.9,13.4,13.9,13.15,13.8C12.9,13.7,12.1,13.44,11.2,12.64C10.45,11.99,9.95,11.19,9.8,10.94C9.65,10.69,9.75,10.59,9.85,10.49C9.95,10.39,10.1,10.24,10.2,10.09C10.3,9.94,10.35,9.84,10.45,9.64C10.55,9.44,10.5,9.29,10.45,9.19C10.4,9.09,10,8.04,9.8,7.59C9.6,7.14,9.4,7.19,9.25,7.19C9.1,7.19,8.95,7.19,8.8,7.19C8.65,7.19,8.4,7.24,8.2,7.44C8,7.64,7.5,8.09,7.5,9.04C7.5,9.99,8.2,10.94,8.35,11.09C8.5,11.24,10.25,14.04,13,15.44C13.75,15.79,14.1,15.94,14.4,16.04C15,16.24,15.55,16.19,16,16.14C16.45,16.09,17.45,15.54,17.65,14.94C17.85,14.34,17.85,13.89,17.8,13.79C17.75,13.69,17.55,13.64,17.3,13.54C17.05,13.44,16.9,13.49,16.65,13.46M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22C13.25,22 14.45,21.8 15.55,21.3L19.8,22L20.25,17.85C21.45,16.5 22,14.8 22,13A10,10 0 0,0 12,3A10,10 0 0,0 12,2Z" />
    </svg>
);

const Contact = () => {
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: '#059669',
                        },
                    },
                    error: {
                        style: {
                            background: '#DC2626',
                        },
                    },
                }}
            />

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
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <h3 className="font-headline text-2xl font-bold">Contact Information</h3>
                            <div className="space-y-6">
                                {contactDetails.map((contact) => (
                                    <Card
                                        key={contact.name}
                                        className="hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-xl">
                                                <User className="h-5 w-5 text-primary" />
                                                {contact.name}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">{contact.role}</p>
                                        </CardHeader>
                                        <CardContent>
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="flex items-center gap-3 text-lg transition-colors hover:text-primary"
                                            >
                                                <Phone className="h-5 w-5" />
                                                <span>{contact.phone}</span>
                                            </a>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Message Section with Form */}
                        <div className="space-y-8">
                            <h3 className="font-headline text-2xl font-bold">Send Us a Message</h3>

                            {/* Contact Form */}
                            <ContactForm />

                            {/* Quick Action Buttons */}
                            <Card>
                                <CardContent className="pt-6 grid grid-cols-1 gap-4">
                                    <a
                                        href="https://wa.me/919494555291"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                                            <WhatsAppIcon />
                                            <span>Chat on WhatsApp</span>
                                        </Button>
                                    </a>
                                    <a href="mailto:tarangevents25@gmail.com" className="w-full">
                                        <Button variant="outline" className="w-full">
                                            <Mail />
                                            <span>Send an Email</span>
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
