import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";

const keys = [
  {
    id: "ob-key-common",
    name: "Common Key",
    description: "Basic rewards including ores, food, and starter gear.",
    price: 5,
    gradient: "from-gray-400 to-gray-500",
    accent: "text-gray-400",
    rarity: "Common",
  },
  {
    id: "ob-key-rare",
    name: "Rare Key",
    description: "Better rewards with enchanted gear, spawners, and golden apples.",
    price: 10,
    gradient: "from-blue-400 to-blue-600",
    accent: "text-blue-400",
    rarity: "Rare",
  },
  {
    id: "ob-key-epic",
    name: "Epic Key",
    description: "Epic rewards with netherite gear, special items, and notch apples.",
    price: 15,
    gradient: "from-purple-400 to-purple-600",
    accent: "text-purple-400",
    rarity: "Epic",
  },
  {
    id: "ob-key-legendary",
    name: "Legendary Key",
    description: "The best rewards! Max enchanted gear, mace, totems, and more.",
    price: 20,
    gradient: "from-yellow-400 to-orange-500",
    accent: "text-yellow-400",
    rarity: "Legendary",
  },
];

const OneBlockKeysSection = () => {
  const navigate = useNavigate();

  return (
    <section id="keys" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-4">🔑 CRATE KEYS</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">One Block Keys</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Open crates and get random items based on rarity!</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {keys.map((key, index) => (
            <motion.div
              key={key.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 p-5 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_30px_hsla(160,100%,50%,0.2)]">
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${key.gradient} flex items-center justify-center`}>
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${key.gradient} text-white text-xs font-display font-semibold`}>
                    {key.rarity}
                  </span>
                </div>

                <h4 className="font-display text-lg font-bold text-foreground mb-2">{key.name}</h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{key.description}</p>

                <div className="flex items-center justify-between">
                  <span className={`font-display font-bold ${key.accent}`}>₹{key.price}</span>
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/checkout/${key.id}`)}>
                    Buy Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OneBlockKeysSection;
