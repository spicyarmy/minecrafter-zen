import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import RankCard from "./RankCard";
import { useProducts } from "@/hooks/useProducts";

// Fallback images for ranks
import spicyRank from "@/assets/ranks/spicy_rank.png";
import proRank from "@/assets/ranks/pro_rank.png";
import eliteRank from "@/assets/ranks/elite_rank.png";
import legendRank from "@/assets/ranks/legend_rank.png";
import deadliestRank from "@/assets/ranks/deadliest_rank.png";
import immortalRank from "@/assets/ranks/immortal_rank.png";
import supremeRank from "@/assets/ranks/supreme_rank.png";
import customRank from "@/assets/ranks/custom_rank.png";

const rankImages: Record<string, string> = {
  pro: proRank, elite: eliteRank, legend: legendRank,
  immortal: immortalRank, deadliest: deadliestRank,
  supreme: supremeRank, spicy: spicyRank, custom: customRank,
};

const validTiers = ["spicy", "pro", "elite", "legend", "deadliest", "immortal", "supreme", "admin", "custom"] as const;

interface RanksSectionProps {
  serverName?: string;
  serverParam?: string;
}

const RanksSection = ({ serverName = "GEM SMP", serverParam }: RanksSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const server = serverParam || "gem";
  const { products, loading } = useProducts(server, "rank");

  const filteredRanks = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="ranks" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[150px] -translate-y-1/2" />
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
            ⚔️ PREMIUM RANKS
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4">
            <span className="gradient-text">Select Your Rank</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock exclusive perks, kits, and abilities on {serverName}
          </p>
        </motion.div>

        <motion.div
          className="max-w-md mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ranks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_20px_hsla(320,100%,50%,0.2)] transition-all duration-300 font-display text-sm"
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

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {searchQuery && (
              <motion.p className="text-center text-sm text-muted-foreground mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Found {filteredRanks.length} rank{filteredRanks.length !== 1 ? 's' : ''}
              </motion.p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRanks.map((product, index) => {
                const tierKey = product.product_key.toLowerCase();
                const tier = validTiers.includes(tierKey as any) ? tierKey as any : "pro";
                const image = rankImages[tierKey] || proRank;

                return (
                  <RankCard
                    key={product.id}
                    name={product.name}
                    description={product.description || ""}
                    kitName={`${product.name.replace(" RANK", "")} Kit`}
                    originalPrice={`₹${product.original_price || product.price}`}
                    salePrice={`₹${product.price}`}
                    buyLink=""
                    image={image}
                    tier={tier}
                    index={index}
                    serverParam={serverParam}
                  />
                );
              })}
            </div>

            {filteredRanks.length === 0 && !loading && (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-muted-foreground font-display">
                  {searchQuery ? `No ranks found matching "${searchQuery}"` : "No ranks available"}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default RanksSection;
