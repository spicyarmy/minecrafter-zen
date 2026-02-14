import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flame, Coins } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import tokenLogo from "@/assets/token-logo.png";

const ServerSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            🎮 PREMIUM MINECRAFT STORE
          </motion.span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-4 leading-tight">
            <span className="gradient-text-hero text-glow-primary">SPICY NETWORK</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your server to browse the store
          </p>
        </motion.div>

        {/* Server Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* SPICY SMP Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group cursor-pointer"
            onClick={() => navigate("/spicy")}
          >
            <div
              className="relative rounded-3xl bg-card border border-border/50 overflow-hidden transition-all duration-500 p-8 text-center h-full"
              style={{ boxShadow: "0 0 60px hsla(320, 100%, 50%, 0.15)" }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: "inset 0 0 80px hsla(320, 100%, 50%, 0.1)" }}
              />

              {/* Icon */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center">
                <Flame className="w-12 h-12 text-orange-400" />
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                SPICY SMP
              </h2>
              <p className="text-muted-foreground mb-6">
                Ranks, Survival Keys, Lifesteal Keys, Coins & more
              </p>

              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 font-display font-bold text-white transition-all group-hover:shadow-[0_0_30px_hsla(20,100%,50%,0.5)]">
                Enter Store →
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-orange-500 to-red-600 [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]" />
              </div>
            </div>
          </motion.div>

          {/* TOKEN SMP Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group cursor-pointer"
            onClick={() => navigate("/token")}
          >
            <div
              className="relative rounded-3xl bg-card border border-border/50 overflow-hidden transition-all duration-500 p-8 text-center h-full"
              style={{ boxShadow: "0 0 60px hsla(45, 100%, 50%, 0.15)" }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: "inset 0 0 80px hsla(45, 100%, 50%, 0.1)" }}
              />

              {/* Token Logo */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden">
                <img src={tokenLogo} alt="Token SMP" className="w-full h-full object-cover" />
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
                TOKEN SMP
              </h2>
              <p className="text-muted-foreground mb-6">
                Ranks, Coins, Claim Blocks & more
              </p>

              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 font-display font-bold text-white transition-all group-hover:shadow-[0_0_30px_hsla(45,100%,50%,0.5)]">
                Enter Store →
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-yellow-500 to-amber-600 [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Discord link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="https://discord.gg/bBNsdzVfdB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors font-display text-sm tracking-wider"
          >
            Join our Discord →
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ServerSelect;
