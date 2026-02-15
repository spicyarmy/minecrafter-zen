import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import RanksSection from "@/components/RanksSection";
import StoreSection from "@/components/StoreSection";
import LifestealStoreSection from "@/components/LifestealStoreSection";
import CurrencySection from "@/components/CurrencySection";
import VideoSection from "@/components/VideoSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import GuidedTour from "@/components/GuidedTour";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Guided Tour disabled */}
      
      {/* Animated particle background */}
      <ParticleBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Video Section */}
      <VideoSection />
      
      {/* Ranks Section */}
      <RanksSection />
      
      {/* Survival Keys Section */}
      <StoreSection />
      
      {/* Lifesteal Keys Section */}
      <LifestealStoreSection />
      
      {/* Currency Section - Coins & Claim Blocks */}
      <CurrencySection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
