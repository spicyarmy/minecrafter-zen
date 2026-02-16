import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const extras = [
  {
    id: "ob-team-name",
    name: "Custom Team Name",
    description: "Create your own team identity! Set a custom team name visible to all players.",
    price: "₹10/player",
    icon: Users,
    gradient: "from-pink-500 to-rose-600",
    bgGradient: "from-pink-500/20 to-rose-600/20",
    glow: "0 0 40px hsla(330, 100%, 50%, 0.3)",
    accent: "text-pink-400",
  },
  {
    id: "ob-claimblocks",
    name: "Claim Blocks",
    description: "Protect your builds! Expand your protected territory on One Block.",
    price: "₹1 = 1 Block",
    icon: MapPin,
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-500/20 to-emerald-600/20",
    glow: "0 0 40px hsla(140, 100%, 50%, 0.3)",
    accent: "text-green-400",
  },
  {
    id: "ob-keep-inventory",
    name: "Keep Inventory",
    description: "Never lose your items on death! Keep your entire inventory safe for a full month.",
    price: "₹50/month",
    icon: Shield,
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-500/20 to-indigo-600/20",
    glow: "0 0 40px hsla(220, 100%, 50%, 0.3)",
    accent: "text-blue-400",
  },
];

const OneBlockExtrasSection = () => {
  const navigate = useNavigate();

  return (
    <section id="extras" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-pink-500/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-4">✨ EXTRAS & SERVICES</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">More Items</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Custom team names, claim blocks, keep inventory and more!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {extras.map((extra, index) => {
            const Icon = extra.icon;
            return (
              <motion.div
                key={extra.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="relative rounded-2xl bg-card border border-border/50 overflow-hidden h-full" style={{ boxShadow: extra.glow }}>
                  <div className={`h-2 bg-gradient-to-r ${extra.gradient}`} />
                  <div className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${extra.bgGradient} flex items-center justify-center mb-4`}>
                      <Icon className={`w-8 h-8 ${extra.accent}`} />
                    </div>
                    <h3 className={`font-display text-2xl font-bold ${extra.accent} mb-2`}>{extra.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{extra.description}</p>
                    <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${extra.gradient} mb-6`}>
                      <span className="font-display font-bold text-white">{extra.price}</span>
                    </div>
                    <Button variant="hero" className="w-full group-hover:scale-[1.02] transition-transform" onClick={() => navigate(`/checkout/${extra.id}`)}>
                      Buy Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OneBlockExtrasSection;
