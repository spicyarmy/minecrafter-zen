import ParticleBackground from "@/components/ParticleBackground";
import OneBlockNavbar from "@/components/OneBlockNavbar";
import OneBlockHeroSection from "@/components/OneBlockHeroSection";
import OneBlockRanksSection from "@/components/OneBlockRanksSection";
import OneBlockKeysSection from "@/components/OneBlockKeysSection";
import OneBlockExtrasSection from "@/components/OneBlockExtrasSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import OneBlockFooter from "@/components/OneBlockFooter";

const OneBlockStore = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <OneBlockNavbar />
      <OneBlockHeroSection />
      <OneBlockRanksSection />
      <OneBlockKeysSection />
      <OneBlockExtrasSection />
      <FeaturesSection />
      <CTASection />
      <OneBlockFooter />
    </div>
  );
};

export default OneBlockStore;
