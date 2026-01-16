import { motion } from "framer-motion";
import { useState } from "react";
import { Search, X } from "lucide-react";
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
    price: "₹5",
    buyLink: "https://spicysmp.dpdns.org/party_key.html",
    isFree: false,
  },
  {
    name: "Apple Key",
    description: "FULL NETHERITE KIT Enchantment (IV) SPAWNER GOLDEN APPLE MORE LUCK",
    price: "₹10",
    buyLink: "https://spicysmp.dpdns.org/APPLE_key.html",
    isFree: false,
  },
  {
    name: "Banana Key",
    description: "FULL NETHERITE KIT Enchantment (V) SPAWNER GOLDEN APPLE",
    price: "₹15",
    buyLink: "https://spicysmp.dpdns.org/banana_key.html",
    isFree: false,
  },
  {
    name: "Blood Key",
    description: "FULL NETHERITE KIT Enchantment (VII) SPAWNER GOLDEN APPLE, NOTCH APPLE",
    price: "₹20",
    buyLink: "https://spicysmp.dpdns.org/BLOOD_key.html",
    isFree: false,
  },
  {
    name: "Blue Key",
    description: "FULL NETHERITE KIT Enchantment (X) SPAWNER GOLDEN APPLE, NOTCH APPLE",
    price: "₹25",
    buyLink: "https://spicysmp.dpdns.org/BLUE_key.html",
    isFree: false,
  },
  {
    name: "Purple Key",
    description: "FULL NETHERITE KIT Enchantment (XV) SPAWNER GOLDEN APPLE, MACE",
    price: "₹30",
    buyLink: "https://spicysmp.dpdns.org/purple_key.html",
    isFree: false,
  },
];

const categories = ["All", "Free Keys", "Premium Keys"];

const StoreSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredKeys = keys.filter((key) => {
    const matchesCategory = 
      activeCategory === "All" ? true :
      activeCategory === "Free Keys" ? key.isFree :
      activeCategory === "Premium Keys" ? !key.isFree : true;
    
    const matchesSearch = 
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
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

        {/* Search bar */}
        <motion.div
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:shadow-[0_0_20px_hsla(185,100%,50%,0.2)] transition-all duration-300 font-display text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
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

        {/* Results count */}
        {searchQuery && (
          <motion.p
            className="text-center text-sm text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Found {filteredKeys.length} key{filteredKeys.length !== 1 ? 's' : ''}
          </motion.p>
        )}

        {/* Keys grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredKeys.map((key, index) => (
            <KeyCard key={key.name} {...key} index={index} />
          ))}
        </div>

        {/* No results message */}
        {filteredKeys.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground font-display">No keys found matching "{searchQuery}"</p>
          </motion.div>
        )}

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
