
"use client";

import Image from "next/image";
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
  Scissors,
  Droplets,
  Sparkles,
  Paintbrush,
  Quote,
  MapPin,
  Phone,
  Mail,
  PlusCircle,
} from "lucide-react";
import { StyleRecommender } from "@/components/glamora/style-recommender";
import { useCart, CartItem } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";


const services = [
  {
    id: "1",
    icon: <Scissors className="w-10 h-10 text-primary" />,
    name: "Precision Haircut & Style",
    description: "A tailored cut and style to perfectly frame your face and match your lifestyle.",
    price: 6500,
  },
  {
    id: "2",
    icon: <Paintbrush className="w-10 h-10 text-primary" />,
    name: "Luxury Manicure & Pedicure",
    description: "Indulge in a relaxing treatment that leaves your nails flawlessly polished.",
    price: 5000,
  },
  {
    id: "3",
    icon: <Droplets className="w-10 h-10 text-primary" />,
    name: "Revitalizing Facial",
    description: "A custom facial using premium products to rejuvenate and nourish your skin.",
    price: 10000,
  },
  {
    id: "4",
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    name: "Professional Makeup",
    description: "Get a stunning look for any special occasion, applied by our expert makeup artists.",
    price: 7500,
  },
];

const testimonials = [
  {
    quote: "Glamora is my go-to salon! The atmosphere is so relaxing and luxurious. I always leave feeling beautiful and refreshed. The staff is incredibly talented and friendly.",
    name: "Jessica Miller",
    avatar: "https://placehold.co/100x100.png",
  },
  {
    quote: "I had the most amazing facial at Glamora. My skin has never felt so soft and looked so radiant. The esthetician was so knowledgeable and customized the treatment for me.",
    name: "Samantha Chen",
    avatar: "https://placehold.co/100x101.png",
  },
  {
    quote: "The best haircut I've ever had! The stylist really listened to what I wanted and gave me a cut that's easy to manage and looks fantastic. Highly recommend!",
    name: "Emily Rodriguez",
    avatar: "https://placehold.co/100x102.png",
  },
];

const HeroSection = () => (
  <section className="relative h-[80vh] min-h-[500px] w-full">
    <Image
      src="https://placehold.co/1600x900.png"
      alt="Interior of a luxury beauty salon"
      data-ai-hint="salon interior"
      fill
      className="object-cover object-center"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
      <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg">
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
          Experience True Elegance
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
          Indulge in a world of beauty and relaxation. Your journey to radiance
          begins here.
        </p>
        <Button size="lg" className="mt-8">
          Book Your Appointment
        </Button>
      </div>
    </div>
  </section>
);

const ServicesSection = () => {
    const { addItem } = useCart();
    const { toast } = useToast();

    const handleAddToBooking = (service: Omit<CartItem, 'quantity'>) => {
        addItem({ ...service, quantity: 1 });
        toast({
            title: "Added to Booking",
            description: `${service.name} has been added to your booking cart.`,
        });
    };

    return (
      <section id="services" className="py-20 md:py-32">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="group flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6 text-center flex flex-col flex-grow">
                  <div className="flex justify-center mb-4">{service.icon}</div>
                  <h3 className="font-headline text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {service.description}
                  </p>
                  <p className="font-semibold text-primary">৳{service.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 bg-card/50">
                    <Button className="w-full" onClick={() => handleAddToBooking(service)}>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Add to Booking
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
};

const AboutSection = () => (
  <section id="about" className="bg-card/50 py-20 md:py-32">
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
            src="https://placehold.co/600x700.png"
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

const TestimonialsSection = () => (
  <section id="testimonials" className="py-20 md:py-32">
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
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="bg-card/50 py-20 md:py-32">
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
        <div>
          <Image
            src="https://placehold.co/600x450.png"
            alt="Map showing salon location"
            data-ai-hint="map city"
            width={600}
            height={450}
            className="rounded-lg shadow-xl w-full h-auto"
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-headline font-semibold">Our Address</h3>
              <p className="text-muted-foreground">
                123 Beauty Avenue, Elegance City, 12345
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-headline font-semibold">Phone</h3>
              <p className="text-muted-foreground">(123) 456-7890</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-primary mt-1" />
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
