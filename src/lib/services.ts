
import { Scissors, Paintbrush, Droplets, Sparkles, Palette, Gem, HeartHandshake, PenTool } from 'lucide-react';

export const services = [
  {
    id: "1",
    icon: <Scissors className="w-10 h-10 text-primary" />,
    name: "Precision Haircut & Style",
    shortDescription: "A tailored cut and style to perfectly frame your face and match your lifestyle.",
    longDescription: "Our master stylists begin with a personal consultation to understand your vision, lifestyle, and hair's unique texture. This allows us to design a cut that is both flattering and functional. The service includes a luxurious shampoo and conditioning treatment, a precision haircut, and a professional blowout and style, leaving you looking and feeling your absolute best.",
    price: 6500,
    image: {
      src: "https://drive.google.com/uc?export=view&id=1_zDI4bxZPPfhu8C5HKUfIFV3BxOuSc4X",
      alt: "Woman getting a precision haircut",
      aiHint: "woman haircut"
    }
  },
  {
    id: "2",
    icon: <Paintbrush className="w-10 h-10 text-primary" />,
    name: "Luxury Manicure & Pedicure",
    shortDescription: "Indulge in a relaxing treatment that leaves your nails flawlessly polished.",
    longDescription: "Experience pure bliss with our luxury manicure and pedicure. This pampering session includes a soothing soak, meticulous nail shaping and cuticle care, a gentle exfoliating scrub, and a hydrating massage for your hands and feet. We finish with a perfect polish application from our extensive collection of high-end lacquers.",
    price: 5000,
    image: {
      src: "https://drive.google.com/uc?export=view&id=1ztMpLgcLTSl_q9bPaGx503KPLJMKCIyD",
      alt: "Perfectly polished nails after a manicure",
      aiHint: "manicure pedicure"
    }
  },
  {
    id: "3",
    icon: <Droplets className="w-10 h-10 text-primary" />,
    name: "Revitalizing Facial",
    shortDescription: "A custom facial using premium products to rejuvenate and nourish your skin.",
    longDescription: "Our revitalizing facial is customized to your specific skin needs. After a thorough skin analysis, our esthetician will perform a deep cleanse, exfoliation, and gentle extractions if needed. A custom-blended mask and a nutrient-rich serum are applied, followed by a relaxing facial massage to boost circulation and a final layer of moisturizer and SPF to protect your radiant new complexion.",
    price: 10000,
    image: {
      src: "https://drive.google.com/uc?export=view&id=1A0YY6ZJ5HNHUscFvawPPFITUQGXuXylu",
      alt: "Woman enjoying a relaxing facial treatment",
      aiHint: "facial treatment"
    }
  },
  {
    id: "4",
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    name: "Professional Makeup",
    shortDescription: "Get a stunning look for any special occasion, applied by our expert makeup artists.",
    longDescription: "Whether it's a wedding, gala, or an important night out, our professional makeup artists will create a look that enhances your natural beauty and lasts all day. Using only the highest quality products, we work with you to achieve your desired style, from natural and radiant to bold and glamorous.",
    price: 7500,
    image: {
      src: "https://drive.google.com/uc?export=view&id=1Php9gkAvIEYyMdhrZd6QTtnAhUY0VmIc",
      alt: "Woman with professional makeup for a special occasion",
      aiHint: "professional makeup"
    }
  },
  {
    id: "5",
    icon: <Palette className="w-10 h-10 text-primary" />,
    name: "Radiant Hair Coloring",
    shortDescription: "From subtle highlights to bold new colors, our experts will find the perfect shade for you.",
    longDescription: "Our color experts use advanced techniques to create beautiful, dimensional hair color. We offer a full range of services including single-process color, highlights, balayage, and creative color. Each service includes a consultation, custom color formulation, and a conditioning treatment to ensure your hair remains healthy and vibrant.",
    price: 8500,
    image: {
      src: "https://drive.google.com/uc?export=view&id=1XvIc782W_WgnJHuXm-XBN6z7H76NDzUd",
      alt: "Woman with freshly colored hair",
      aiHint: "hair coloring"
    }
  },
  {
    id: "6",
    icon: <Gem className="w-10 h-10 text-primary" />,
    name: "Bridal Glow Package",
    shortDescription: "A complete package including makeup, hair, and a pre-wedding facial for your special day.",
    longDescription: "Look and feel absolutely radiant on your wedding day with our all-inclusive bridal package. It features a trial run for both hair and makeup, a signature revitalizing facial a week before the wedding, and of course, expert hair styling and makeup application on your big day. We'll ensure you're picture-perfect from 'I do' to the last dance.",
    price: 25000,
    image: {
      src: "https://drive.google.com/uc?export=view&id=1mlwLBnM1CofH-ePObhK96aKXKP9cOMhb",
      alt: "Beautiful bride with elegant hair and makeup",
      aiHint: "bride makeup"
    }
  },
  {
    id: "7",
    icon: <HeartHandshake className="w-10 h-10 text-primary" />,
    name: "Deep Tissue Massage",
    shortDescription: "Release tension and soothe sore muscles with our therapeutic deep tissue massage.",
    longDescription: "This massage focuses on the deeper layers of muscle tissue, it is designed to relieve severe tension and chronic pain. Our certified massage therapists use slow, deliberate strokes and deep finger pressure to release contracted areas, making it ideal for those who are active or suffer from persistent muscle soreness.",
    price: 6000,
    image: {
      src: "https://drive.google.com/uc?export=view&id=1nBhIm-n4rRAaL6_rkhfVscCU9ZfKO-mB",
      alt: "Person receiving a deep tissue massage",
      aiHint: "deep tissue massage"
    }
  },
  {
    id: "8",
    icon: <PenTool className="w-10 h-10 text-primary" />,
    name: "Expert Brow Shaping",
    shortDescription: "Perfectly sculpted eyebrows to define your features, using threading or waxing.",
    longDescription: "Well-shaped eyebrows frame the face and enhance your features. Our brow experts will consult with you to find the perfect shape for your face. We offer both waxing and threading techniques for precise, long-lasting results. The service is completed with a soothing lotion to reduce redness.",
    price: 1500,
    image: {
      src: "https://drive.google.com/uc?export=view&id=133rahB5MDb685FMuvC12pYzWf4y5PzJ_",
      alt: "Woman with perfectly shaped eyebrows",
      aiHint: "eyebrow shaping"
    }
  },
];
