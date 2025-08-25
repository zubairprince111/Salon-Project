
"use client";
import React from "react";

import Image from "next/image";
import Link from 'next/link';
import { Header } from "@/components/glamora/header";
import { Footer } from "@/components/glamora/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Quote,
  MapPin,
  Phone,
  Mail,
  PlusCircle,
  HeartHandshake,
  ChevronDown,
  Scissors,
  Droplets,
  Sparkles,
  Paintbrush,
  Palette,
  Gem,
  PenTool
} from "lucide-react";
import { StyleRecommender } from "@/components/glamora/style-recommender";
import { useCart, CartItem } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { services } from "@/lib/services.tsx";
import Autoplay from "embla-carousel-autoplay"


const testimonials = [
  {
    quote: "Glamora is my go-to salon! The atmosphere is so relaxing and luxurious. I always leave feeling beautiful and refreshed. The staff is incredibly talented and friendly.",
    name: "Jessica Miller",
    avatar: "https://drive.google.com/uc?export=view&id=17UD0ZUjVnUjR2In6hBxsK3oiVjPNkDHs",
  },
  {
    quote: "I had the most amazing facial at Glamora. My skin has never felt so soft and looked so radiant. The esthetician was so knowledgeable and customized the treatment for me.",
    name: "Samantha Chen",
    avatar: "https://drive.google.com/uc?export=view&id=15dv-g5nbJQIp3lvqZKKrRW-hL_zPcVkc",
  },
  {
    quote: "The best haircut I've ever had! The stylist really listened to what I wanted and gave me a cut that's easy to manage and looks fantastic. Highly recommend!",
    name: "Emily Rodriguez",
    avatar: "https://drive.google.com/uc?export=view&id=1xTsPUOGueFppoLrX1fJropzrjwBkrXMQ",
  },
];

const HeroSection = () => {
    return (
        <section className="relative h-[70vh] min-h-[450px] w-full">
            <Image
                src="https://drive.google.com/uc?export=view&id=1dOWY5mm6lhHD6Bky5Y_ztPc7fXjAv3uV"
                alt="Interior of a luxury beauty salon"
                data-ai-hint="salon interior"
                fill
                className="object-cover object-center"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
                <div className="bg-black/30 backdrop-blur-sm p-6 md:p-8 rounded-lg animate-fade-in opacity-0">
                    <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-white">
                        Experience True Elegance
                    </h1>
                    <p className="mt-4 max-w-2xl text-base md:text-xl text-primary-foreground/90">
                        Indulge in a world of beauty and relaxation. Your journey to radiance begins here.
                    </p>
                    <Button size="lg" className="mt-8">
                        Book Your Appointment
                    </Button>
                </div>
            </div>
        </section>
    )
};

const ServicesSection = () => {
    const { addItem } = useCart();
    const { toast } = useToast();
    const [showAll, setShowAll] = React.useState(false);
    
    const visibleServices = showAll ? services : services.slice(0, 4);

    const handleAddToBooking = (e: React.MouseEvent, service: Omit<CartItem, 'quantity'>) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({ ...service, quantity: 1 });
        toast({
            title: "Added to Booking",
            description: `${service.name} has been added to your booking cart.`,
        });
    };

    return (
      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              Our Signature Services
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Discover our range of premium services designed to make you look and
              feel your best.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleServices.map((service) => (
              <Link href={`/service/${service.id}`} key={service.id} className="group flex flex-col no-underline">
                <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 h-full">
                  <CardContent className="p-6 text-center flex flex-col flex-grow">
                    <div className="flex justify-center mb-4">{service.icon}</div>
                    <h3 className="font-headline text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">
                      {service.shortDescription}
                    </p>
                    <p className="font-semibold text-primary">৳{service.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 bg-card/50 mt-auto">
                      <Button className="w-full" onClick={(e) => handleAddToBooking(e, service)}>
                          <PlusCircle className="mr-2 h-4 w-4"/>
                          Add to Booking
                      </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
           {services.length > 4 && (
            <div className="text-center mt-12">
              <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                <ChevronDown className={`mr-2 h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                {showAll ? 'View Less' : 'View More Services'}
              </Button>
            </div>
          )}
        </div>
      </section>
    )
};

const AboutSection = () => (
  <section id="about" className="bg-card/50 py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            About Glamora
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Founded on the principles of luxury, artistry, and client care,
            Glamora is a sanctuary of beauty and wellness. Our mission is to
            provide an unparalleled salon experience, combining technical
            expertise with a passion for aesthetic excellence.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our team of highly-trained stylists, estheticians, and artists are
            dedicated to their craft, continuously learning the latest
            techniques to bring you the very best in beauty. We believe that
            every client is unique, and we take the time to create personalized
            treatments that enhance your natural beauty and leave you feeling
            confident and renewed.
          </p>
          <Button variant="outline" className="mt-6">
            Meet Our Team
          </Button>
        </div>
        <div className="order-1 md:order-2">
          <Image
            src="https://drive.google.com/uc?export=view&id=12tLm2CSHLjc-CMot0vPBICtpTE_zpfWQ"
            alt="A beautician at work in a stylish salon"
            data-ai-hint="beautician working"
            width={600}
            height={700}
            className="rounded-lg shadow-xl w-full h-auto"
          />
        </div>
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    return (
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              What Our Clients Say
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              We are proud to have earned the trust and loyalty of our wonderful
              clients.
            </p>
          </div>
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col justify-between h-full shadow-lg">
                      <CardContent className="p-6 text-center flex flex-col items-center">
                        <Quote className="w-8 h-8 text-primary/50 mb-4" />
                        <p className="text-muted-foreground text-sm italic mb-6 flex-grow">
                          "{testimonial.quote}"
                        </p>
                        <Avatar>
                          <AvatarImage
                            src={testimonial.avatar}
                            alt={testimonial.name}
                          />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h4 className="font-headline font-semibold mt-4">
                          {testimonial.name}
                        </h4>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>
    );
};

const ContactSection = () => (
  <section id="contact" className="bg-card/50 py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">
          Get in Touch
        </h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We would love to hear from you. Contact us to book an appointment or
          for any inquiries.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="w-full">
          <Image
            src="https://drive.google.com/uc?export=view&id=1VJb9Uo3tsdGLe7uVhmbIRl4YV_W4BuyU"
            alt="Map showing salon location"
            data-ai-hint="map city"
            width={600}
            height={450}
            className="rounded-lg shadow-xl w-full h-auto"
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-headline font-semibold">Our Address</h3>
              <p className="text-muted-foreground">
                123 Beauty Avenue, Elegance City, 12345
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-headline font-semibold">Phone</h3>
              <p className="text-muted-foreground">(123) 456-7890</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-headline font-semibold">Email</h3>
              <p className="text-muted-foreground">hello@glamora.com</p>
            </div>
          </div>
          <Button size="lg" className="mt-4">
            Book Online Now
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-grow animate-fade-in opacity-0">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <StyleRecommender />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
