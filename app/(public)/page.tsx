import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import GallerySection from "@/components/public/GallerySection";
import ContactSection from "@/components/public/ContactSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <ContactSection />
    </main>
  );
}