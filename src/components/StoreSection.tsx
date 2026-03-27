import { motion } from "framer-motion";
import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import KeyCard from "./KeyCard";
import { useProducts } from "@/hooks/useProducts";

const categories = ["All", "Free Keys", "Premium Keys"];

const StoreSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { products, loading } = useProducts("gem", "key");

  const filteredKeys = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All" ? true :
      activeCategory === "Free Keys" ? p.price === 0 :
      activeCategory === "Premium Keys" ? p.price > 0 : true;

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="store" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-4">
            🔑 SURVIVAL CRATE KEYS
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4">
            <span className="gradient-text">Survival Keys</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use keys on the Survival server to get random items according to your luck!
          </p>
        </motion.div>

        <motion.div className="max-w-md mx-auto mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
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
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center gap-3 mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
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

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            {searchQuery && (
              <motion.p className="text-center text-sm text-muted-foreground mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Found {filteredKeys.length} key{filteredKeys.length !== 1 ? 's' : ''}
              </motion.p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredKeys.map((product, index) => (
                <KeyCard
                  key={product.id}
                  name={product.name}
                  description={product.description || ""}
                  price={product.price === 0 ? "FREE" : `₹${product.price}`}
                  buyLink=""
                  isFree={product.price === 0}
                  index={index}
                />
              ))}
            </div>
            {filteredKeys.length === 0 && (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-muted-foreground font-display">No keys found matching "{searchQuery}"</p>
              </motion.div>
            )}
          </>
        )}

        <motion.div className="mt-12 p-6 rounded-2xl glass border border-accent/20 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <p className="text-muted-foreground">
            <span className="text-accent font-semibold">💡 TIP:</span> When a player uses a key in-game, they get random items according to their luck!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default StoreSection;
