import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Zap, Shield, Headphones, Sword, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ParticleBackground";
import RanksSection from "@/components/RanksSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import minecraftHero from "@/assets/minecraft-hero.png";

const LifestealStore = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Ranks", href: "#ranks" },
    { name: "Contact", href: "#contact" },
  ];

  const features = [
    { icon: Zap, text: "Instant Delivery" },
    { icon: Shield, text: "Secure Purchases" },
    { icon: Headphones, text: "24/7 Support" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <motion.a href="#home" className="flex items-center gap-3" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <Sword className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
              LIFESTEAL
            </span>
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="font-display text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:block">
            <Button variant="heroOutline" size="sm" asChild>
              <a href="https://discord.gg/bBNsdzVfdB" target="_blank" rel="noopener noreferrer">
                Join Discord
              </a>
            </Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass mt-2 mx-4 rounded-xl overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="font-display text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img src={minecraftHero} alt="Lifesteal Minecraft Server" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="absolute inset-0 z-5">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px]"
            style={{ background: "hsla(0, 80%, 50%, 0.2)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px]"
            style={{ background: "hsla(340, 80%, 50%, 0.2)" }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.span
                className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                ⚔️ PVP MINECRAFT STORE
              </motion.span>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-red-400 via-rose-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_hsla(0,100%,50%,0.5)]">
                  LIFESTEAL
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Dominate the PvP arena with premium ranks and exclusive combat gear!
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button variant="hero" size="xl" asChild>
                <a href="#ranks">
                  Browse Ranks
                  <ArrowRight className="ml-2" />
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="https://discord.gg/bBNsdzVfdB" target="_blank" rel="noopener noreferrer">
                  Join Discord
                </a>
              </Button>
            </motion.div>

            <motion.div className="flex flex-wrap justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <feature.icon className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-muted-foreground">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
              <motion.div className="w-1.5 h-3 rounded-full bg-red-500" animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ranks */}
      <RanksSection serverName="LIFESTEAL" serverParam="lifesteal" />

      {/* Custom Weapons */}
      <CustomWeaponSection serverParam="lifesteal" />

      {/* Features */}
      <FeaturesSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <footer id="contact" className="relative py-16 border-t border-border/50">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/10 blur-[150px] rounded-full" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <Sword className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                LIFESTEAL
              </span>
            </div>
            <p className="text-muted-foreground max-w-md mb-8">
              Dominate PvP with premium ranks and gear!
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a href="https://discord.gg/bBNsdzVfdB" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-display text-sm tracking-wider">
                Discord <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} SPICY NETWORK. All rights reserved.</p>
              <p className="mt-1 text-xs">Not affiliated with Mojang or Microsoft.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LifestealStore;
