import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Crown, Star, Skull, Zap, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ParticleBackground";
import tokenLogo from "@/assets/token-logo.png";
import tokenVipImg from "@/assets/ranks/token_vip.png";
import tokenLegendImg from "@/assets/ranks/token_legend.png";
import tokenDeadliestImg from "@/assets/ranks/token_deadliest.png";
import tokenRazerImg from "@/assets/ranks/token_razer.png";

const tokenRanks = [
  {
    id: "token-vip",
    name: "VIP RANK",
    description: "Start your journey with VIP status. Includes Protection IV Armor and tools.",
    price: "₹50",
    items: "Protection IV Armor & Tools",
    gradient: "from-cyan-500 to-blue-600",
    glow: "0 0 40px hsla(185, 100%, 50%, 0.3)",
    accent: "text-cyan-400",
    icon: Star,
    image: tokenVipImg,
  },
  {
    id: "token-legend",
    name: "LEGEND RANK",
    description: "Rise above the rest. Includes Protection V Armor and tools.",
    price: "₹100",
    items: "Protection V Armor & Tools",
    gradient: "from-amber-500 to-orange-600",
    glow: "0 0 40px hsla(45, 100%, 50%, 0.3)",
    accent: "text-amber-400",
    icon: Crown,
    image: tokenLegendImg,
  },
  {
    id: "token-deadliest",
    name: "DEADLIEST RANK",
    description: "Unleash destruction. Includes Protection VI Armor and tools.",
    price: "₹150",
    items: "Protection VI Armor & Tools",
    gradient: "from-red-500 to-rose-600",
    glow: "0 0 40px hsla(0, 100%, 50%, 0.3)",
    accent: "text-red-400",
    icon: Skull,
    image: tokenDeadliestImg,
  },
  {
    id: "token-razer",
    name: "RAZER RANK",
    description: "Ultimate power. Includes Protection VIII Armor and tools.",
    price: "₹200",
    items: "Protection VIII Armor & Tools",
    gradient: "from-green-500 to-emerald-600",
    glow: "0 0 40px hsla(140, 100%, 50%, 0.3)",
    accent: "text-green-400",
    icon: Zap,
    image: tokenRazerImg,
  },
];

const TokenStore = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 glass py-3"
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={tokenLogo} alt="Token SMP" className="w-10 h-10 rounded-lg" />
            <span className="font-display text-xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
              TOKEN SMP
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="heroOutline" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="heroOutline" size="sm" asChild>
              <a href="https://discord.gg/bBNsdzVfdB" target="_blank" rel="noopener noreferrer">
                Join Discord
              </a>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-yellow-500/20 blur-[100px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/20 blur-[100px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.img
              src={tokenLogo}
              alt="Token SMP"
              className="w-24 h-24 mx-auto mb-6 rounded-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            />
            <h1 className="text-5xl md:text-7xl font-display font-black mb-4">
              <span className="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">TOKEN SMP</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Premium ranks for the Token server. Gear up and dominate!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Zap, text: "Instant Delivery" },
                { icon: Shield, text: "Secure Purchases" },
                { icon: Headphones, text: "24/7 Support" },
              ].map((f, i) => (
                <motion.div
                  key={f.text}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <f.icon className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-muted-foreground">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ranks Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-yellow-500/10 blur-[150px] -translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-4">
              ⚔️ TOKEN RANKS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4">
              <span className="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">Select Your Rank</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tokenRanks.map((rank, index) => {
              const Icon = rank.icon;
              return (
                <motion.div
                  key={rank.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div
                    className="relative rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-500 h-full"
                    style={{ boxShadow: rank.glow }}
                  >
                    {/* Top gradient bar */}
                    <div className={`h-2 bg-gradient-to-r ${rank.gradient}`} />

                    <div className="p-6">
                      {/* Rank Image */}
                      <div className="w-full h-32 mb-4 rounded-xl overflow-hidden">
                        <img src={rank.image} alt={rank.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rank.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className={`font-display text-xl font-bold mb-2 ${rank.accent}`}>
                        {rank.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {rank.description}
                      </p>

                      {/* Items badge */}
                      <div className="px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground font-display mb-4">
                        🛡️ {rank.items}
                      </div>

                      {/* Price */}
                      <div className={`font-display text-2xl font-bold bg-gradient-to-r ${rank.gradient} bg-clip-text text-transparent mb-4`}>
                        {rank.price}
                      </div>

                      {/* Buy button */}
                      <Button
                        variant="gaming"
                        className="w-full"
                        onClick={() => navigate(`/checkout/${rank.id}`)}
                      >
                        Buy Now
                      </Button>
                    </div>

                    {/* Hover border */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${rank.gradient} [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <img src={tokenLogo} alt="Token SMP" className="w-10 h-10 rounded-lg" />
            <span className="font-display text-xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
              TOKEN SMP
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-4">Part of SPICY NETWORK</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SPICY NETWORK. All rights reserved.</p>
          <p className="text-xs text-muted-foreground mt-1">Not affiliated with Mojang or Microsoft.</p>
        </div>
      </footer>
    </div>
  );
};

export default TokenStore;
