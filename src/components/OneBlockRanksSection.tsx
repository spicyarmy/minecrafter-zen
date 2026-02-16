import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Skull, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const ranks = [
  {
    id: "ob-vip",
    name: "VIP RANK",
    description: "Start strong on One Block with VIP perks, exclusive kit, and essential commands.",
    price: 30,
    icon: Star,
    gradient: "from-cyan-500 to-blue-600",
    glow: "0 0 30px hsla(185, 100%, 50%, 0.4)",
    accent: "text-cyan-400",
    kitItems: ["Diamond Tools (Enchanted)", "Diamond Armor Set", "Oak Sapling", "Water Bucket", "Lava Bucket", "Golden Apple x64"],
    perks: ["/Kit", "/Fly", "2 Home Slots", "Priority Support"],
  },
  {
    id: "ob-demon",
    name: "DEMON RANK",
    description: "Unleash dark power on One Block with Netherite gear and advanced abilities.",
    price: 50,
    icon: Skull,
    gradient: "from-red-500 to-rose-600",
    glow: "0 0 30px hsla(0, 100%, 50%, 0.4)",
    accent: "text-red-400",
    kitItems: ["Netherite Tools (Enchanted)", "Netherite Armor Set", "Chestplate (Protection IV)", "Golden Apple x64", "Spawner", "Totem of Undying x3"],
    perks: ["/Kit", "/Fly", "/Withdraw", "4 Home Slots", "4 Auction Slots"],
  },
  {
    id: "ob-spicy",
    name: "SPICY RANK",
    description: "The ultimate One Block rank! Max enchants, exclusive items, and all perks unlocked.",
    price: 80,
    icon: Flame,
    gradient: "from-orange-500 to-red-600",
    glow: "0 0 30px hsla(20, 100%, 50%, 0.5)",
    accent: "text-orange-400",
    kitItems: ["Netherite Sword (Max Enchant)", "Netherite Pickaxe (Max Enchant)", "Netherite Axe", "Netherite Armor (Silence Trim, Max Enchant)", "Notch Apple x64", "Spawner x3", "Mace", "Totem of Undying x3"],
    perks: ["/Kit", "/Fly", "/Withdraw", "Unlimited Homes", "Unlimited Auctions", "VIP Priority"],
  },
];

const OneBlockRanksSection = () => {
  const navigate = useNavigate();

  return (
    <section id="ranks" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-green-600/10 blur-[150px] -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-4">⚔️ PREMIUM RANKS</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">Select Your Rank</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Unlock exclusive perks, kits, and abilities on One Block</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {ranks.map((rank, index) => {
            const Icon = rank.icon;
            return (
              <motion.div
                key={rank.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-500" style={{ boxShadow: "0 4px 24px hsla(0, 0%, 0%, 0.4)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: rank.glow }} />
                  
                  {/* Gradient header */}
                  <div className={`h-32 bg-gradient-to-br ${rank.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                      <Icon className="w-16 h-16 text-white/90" />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>

                  <div className="p-6">
                    <h3 className={`font-display text-xl font-bold mb-2 ${rank.accent}`}>{rank.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{rank.description}</p>

                    {/* Perks preview */}
                    <div className="space-y-1 mb-4">
                      {rank.perks.slice(0, 4).map((perk) => (
                        <div key={perk} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${rank.gradient}`} />
                          {perk}
                        </div>
                      ))}
                      {rank.perks.length > 4 && (
                        <span className="text-xs text-muted-foreground/70">+{rank.perks.length - 4} more</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className={`font-display text-2xl font-bold bg-gradient-to-r ${rank.gradient} bg-clip-text text-transparent`}>₹{rank.price}</span>
                      <span className="text-xs text-muted-foreground">/30 days</span>
                    </div>

                    <Button variant="gaming" className="w-full" onClick={() => navigate(`/checkout/${rank.id}`)}>
                      Buy Now
                    </Button>
                  </div>

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
  );
};

export default OneBlockRanksSection;
