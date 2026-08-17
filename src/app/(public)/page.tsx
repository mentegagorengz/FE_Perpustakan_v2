import HeroCarousel from "@/features/home/components/hero-carousel";
import ServiceNav from "@/features/home/components/service-nav";
import AboutSection from "@/features/home/components/about-section";
import LatestCollections from "@/features/home/components/latest-collections";
import CtaSection from "@/features/home/components/cta-section";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Library",
  name: "Perpustakaan Universitas Sam Ratulangi",
  description: "Pusat informasi ilmiah dan koleksi literatur Universitas Sam Ratulangi.",
  inLanguage: "id",
  areaServed: "ID",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-cream font-sans text-main-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroCarousel />
      <ServiceNav />
      <AboutSection />
      <LatestCollections />
      <CtaSection />
    </div>
  );
}
