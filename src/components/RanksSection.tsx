import { motion } from "framer-motion";
import RankCard from "./RankCard";
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
    originalPrice: "₹30",
    salePrice: "₹20-60",
    buyLink: "https://spicysmp.dpdns.org/pro.html",
    image: proRank,
    tier: "pro" as const,
  },
  {
    name: "ELITE RANK",
    description: "Step up your game. Comes with colored chat and more homes.",
    kitName: "ELITE Kit",
    originalPrice: "₹50",
    salePrice: "₹45-110",
    buyLink: "https://spicysmp.dpdns.org/elite.html",
    image: eliteRank,
    tier: "elite" as const,
  },
  {
    name: "LEGEND RANK",
    description: "Become a legend. Unlocks priority queue access.",
    kitName: "LEGEND Kit",
    originalPrice: "₹75",
    salePrice: "₹60-170",
    buyLink: "https://spicysmp.dpdns.org/legend.html",
    image: legendRank,
    tier: "legend" as const,
  },
  {
    name: "DEADLIEST RANK",
    description: "Unleash your true potential! Gain access to special combat perks.",
    kitName: "DEADLIEST Kit",
    originalPrice: "₹160",
    salePrice: "₹120-290",
    buyLink: "https://spicysmp.dpdns.org/deadliest.html",
    image: deadliestRank,
    tier: "deadliest" as const,
  },
  {
    name: "IMMORTAL RANK",
    description: "Unlock the power of eternity. Enjoy flight in lobby and unique titles.",
    kitName: "IMMORTAL Kit",
    originalPrice: "₹125",
    salePrice: "₹90-250",
    buyLink: "https://spicysmp.dpdns.org/immortal.html",
    image: immortalRank,
    tier: "immortal" as const,
  },
  {
    name: "SUPREME RANK",
    description: "The ultimate status. Dominate with maximum claim blocks.",
    kitName: "SUPREME Kit",
    originalPrice: "₹200",
    salePrice: "₹150-420",
    buyLink: "https://spicysmp.dpdns.org/supreme.html",
    image: supremeRank,
    tier: "supreme" as const,
  },
];

const RanksSection = () => {
  return (
    <section id="ranks" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[150px] -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ranks.map((rank, index) => (
            <RankCard key={rank.name} {...rank} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RanksSection;
