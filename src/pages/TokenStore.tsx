import TokenNavbar from "@/components/TokenNavbar";
import ParticleBackground from "@/components/ParticleBackground";
import TokenHeroSection from "@/components/TokenHeroSection";
import RanksSection from "@/components/RanksSection";
import TokensSection from "@/components/TokensSection";
import CurrencySection from "@/components/CurrencySection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import TokenFooter from "@/components/TokenFooter";
import GuidedTour from "@/components/GuidedTour";

const TokenStore = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GuidedTour />
      <ParticleBackground />
      <TokenNavbar />
      <TokenHeroSection />
      <TokensSection />
      <RanksSection />
      <CurrencySection />
      <FeaturesSection />
      <CTASection />
      <TokenFooter />
    </div>
  );
};

export default TokenStore;
