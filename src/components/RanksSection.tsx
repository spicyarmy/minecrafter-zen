import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import RankCard from "./RankCard";
import spicyRank from "@/assets/ranks/spicy_rank.png";
import proRank from "@/assets/ranks/pro_rank.png";
import eliteRank from "@/assets/ranks/elite_rank.png";
import legendRank from "@/assets/ranks/legend_rank.png";
import deadliestRank from "@/assets/ranks/deadliest_rank.png";
import immortalRank from "@/assets/ranks/immortal_rank.png";
import supremeRank from "@/assets/ranks/supreme_rank.png";

const ranks = [
  {
    name: "PRO RANK",
    description: "Start your journey with the PRO status. Includes essential commands.",
    kitName: "PRO Kit",
    originalPrice: "₹50",
    salePrice: "₹30",
    buyLink: "https://spicysmp.dpdns.org/pro.html",
    image: proRank,
    tier: "pro" as const,
  },
  {
    name: "ELITE RANK",
    description: "Step up your game. Comes with colored chat and more homes.",
    kitName: "ELITE Kit",
    originalPrice: "₹75",
    salePrice: "₹55",
    buyLink: "https://spicysmp.dpdns.org/elite.html",
    image: eliteRank,
    tier: "elite" as const,
  },
  {
    name: "LEGEND RANK",
    description: "Become a legend. Unlocks priority queue access.",
    kitName: "LEGEND Kit",
    originalPrice: "₹100",
    salePrice: "₹80",
    buyLink: "https://spicysmp.dpdns.org/legend.html",
    image: legendRank,
    tier: "legend" as const,
  },
  {
    name: "IMMORTAL RANK",
    description: "Unlock the power of eternity. Enjoy flight in lobby and unique titles.",
    kitName: "IMMORTAL Kit",
    originalPrice: "₹150",
    salePrice: "₹110",
    buyLink: "https://spicysmp.dpdns.org/immortal.html",
    image: immortalRank,
    tier: "immortal" as const,
  },
  {
    name: "DEADLIEST RANK",
    description: "Unleash your true potential! Gain access to special combat perks.",
    kitName: "DEADLIEST Kit",
    originalPrice: "₹200",
    salePrice: "₹150",
    buyLink: "https://spicysmp.dpdns.org/deadliest.html",
    image: deadliestRank,
    tier: "deadliest" as const,
  },
  {
    name: "SUPREME RANK",
    description: "The ultimate status. Dominate with maximum claim blocks.",
    kitName: "SUPREME Kit",
    originalPrice: "₹280",
    salePrice: "₹200",
    buyLink: "https://spicysmp.dpdns.org/supreme.html",
    image: supremeRank,
    tier: "supreme" as const,
  },
  {
    name: "SPICY RANK",
    description: "The ultimate signature rank! All fire perks and legendary items.",
    kitName: "SPICY Kit",
    originalPrice: "₹350",
    salePrice: "₹250",
    buyLink: "https://spicysmp.dpdns.org/spicy.html",
    image: spicyRank,
    tier: "spicy" as const,
  },
];

const RanksSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRanks = ranks.filter((rank) =>
    rank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rank.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rank.kitName.toLowerCase().includes(searchQuery.toLowerCase())
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
            Unlock exclusive perks, kits, and abilities on SPICYSMP
          </p>
        </motion.div>

        {/* Search bar */}
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

        {/* Results count */}
        {searchQuery && (
          <motion.p
            className="text-center text-sm text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Found {filteredRanks.length} rank{filteredRanks.length !== 1 ? 's' : ''}
          </motion.p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRanks.map((rank, index) => (
            <RankCard key={rank.name} {...rank} index={index} />
          ))}
        </div>

        {/* No results message */}
        {filteredRanks.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground font-display">No ranks found matching "{searchQuery}"</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RanksSection;
