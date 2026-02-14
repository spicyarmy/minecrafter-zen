import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import RanksSection from "@/components/RanksSection";
import CurrencySection from "@/components/CurrencySection";
import VideoSection from "@/components/VideoSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import GuidedTour from "@/components/GuidedTour";

const TokenStore = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GuidedTour />
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <VideoSection />
      <RanksSection />
      <CurrencySection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default TokenStore;
