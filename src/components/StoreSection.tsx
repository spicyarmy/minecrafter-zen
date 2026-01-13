import { motion } from "framer-motion";
import { useState } from "react";
import KeyCard from "./KeyCard";

const keys = [
  {
    name: "Vote Key",
    description: "DIAMOND KIT (II-III) SPAWNER GOLDEN APPLE",
    price: "FREE",
    buyLink: "https://spicysmp.dpdns.org/vote_key.html",
    isFree: true,
  },
  {
    name: "Party Key",
    description: "Give other random keys to players",
    price: "FREE",
    buyLink: "https://spicysmp.dpdns.org/party_key.html",
    isFree: true,
  },
  {
    name: "Banana Key (5x)",
    description: "FULL NETHERITE KIT Enchantment (V) SPAWNER GOLDEN APPLE",
    price: "₹50.00",
    buyLink: "https://spicysmp.dpdns.org/banana_key.html",
    isFree: false,
  },
  {
    name: "Apple Key (5x)",
    description: "FULL NETHERITE KIT Enchantment (IV) SPAWNER GOLDEN APPLE MORE LUCK",
    price: "₹60.00",
    buyLink: "https://spicysmp.dpdns.org/APPLE_key.html",
    isFree: false,
  },
  {
    name: "Blood Key",
    description: "FULL NETHERITE KIT Enchantment (VII) SPAWNER GOLDEN APPLE, NOTCH APPLE",
    price: "₹100.00",
    buyLink: "https://spicysmp.dpdns.org/BLOOD_key.html",
    isFree: false,
  },
  {
    name: "Blue Key (5x)",
    description: "FULL NETHERITE KIT Enchantment (X) SPAWNER GOLDEN APPLE, NOTCH APPLE",
    price: "₹150.00",
    buyLink: "https://spicysmp.dpdns.org/BLUE_key.html",
    isFree: false,
  },
  {
    name: "Purple Key (5x)",
    description: "FULL NETHERITE KIT Enchantment (XV) SPAWNER GOLDEN APPLE, MACE",
    price: "₹200.00",
    buyLink: "https://spicysmp.dpdns.org/purple_key.html",
    isFree: false,
  },
];

const categories = ["All", "Free Keys", "Premium Keys"];

const StoreSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredKeys = keys.filter((key) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Free Keys") return key.isFree;
    if (activeCategory === "Premium Keys") return !key.isFree;
    return true;
  });

  return (
    <section id="store" className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-4">
            🔑 CRATE KEYS
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4">
            <span className="gradient-text">Unlock Your Luck</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use keys in-game to get random items according to your luck!
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-display text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Keys grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredKeys.map((key, index) => (
            <KeyCard key={key.name} {...key} index={index} />
          ))}
        </div>

        {/* Info banner */}
        <motion.div
          className="mt-12 p-6 rounded-2xl glass border border-accent/20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-muted-foreground">
            <span className="text-accent font-semibold">💡 TIP:</span> When a player uses a key in-game, they get random items according to their luck!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default StoreSection;
