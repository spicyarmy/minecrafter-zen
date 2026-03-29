import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import RanksSection from "@/components/RanksSection";
import StoreSection from "@/components/StoreSection";
import CurrencySection from "@/components/CurrencySection";
import CustomWeaponSection from "@/components/CustomWeaponSection";
import VideoSection from "@/components/VideoSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
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
      
      {/* Custom Weapons Section */}
      <CustomWeaponSection serverParam="gem" />
      
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
