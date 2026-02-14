import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import tokenLogo from "@/assets/token-logo.png";

interface TokenItem {
  id: string;
  name: string;
  emoji: string;
  rarity: string;
  price: number;
}

const rarityConfig: Record<string, { color: string; gradient: string; bgGradient: string; glow: string; label: string; dropRate: string }> = {
  common: {
    color: "text-gray-400",
    gradient: "from-gray-400 to-gray-500",
    bgGradient: "from-gray-400/20 to-gray-500/20",
    glow: "0 0 20px hsla(0, 0%, 60%, 0.2)",
    label: "COMMON",
    dropRate: "50%",
  },
  uncommon: {
    color: "text-green-400",
    gradient: "from-green-400 to-green-600",
    bgGradient: "from-green-400/20 to-green-600/20",
    glow: "0 0 25px hsla(140, 70%, 50%, 0.25)",
    label: "UNCOMMON",
    dropRate: "30%",
  },
  rare: {
    color: "text-blue-400",
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-400/20 to-blue-600/20",
    glow: "0 0 30px hsla(220, 70%, 50%, 0.3)",
    label: "RARE",
    dropRate: "15%",
  },
  epic: {
    color: "text-purple-400",
    gradient: "from-purple-400 to-purple-600",
    bgGradient: "from-purple-400/20 to-purple-600/20",
    glow: "0 0 35px hsla(280, 70%, 50%, 0.35)",
    label: "EPIC",
    dropRate: "8%",
  },
  legendary: {
    color: "text-yellow-400",
    gradient: "from-yellow-400 to-orange-500",
    bgGradient: "from-yellow-400/20 to-orange-500/20",
    glow: "0 0 40px hsla(45, 100%, 50%, 0.4)",
    label: "LEGENDARY",
    dropRate: "3%",
  },
  mythic: {
    color: "text-red-400",
    gradient: "from-red-400 to-pink-600",
    bgGradient: "from-red-400/20 to-pink-600/20",
    glow: "0 0 50px hsla(0, 80%, 50%, 0.45)",
    label: "MYTHIC",
    dropRate: "1%",
  },
};

const tokens: TokenItem[] = [
  // Common - ₹20
  { id: "token-zombie", name: "Zombie Token", emoji: "🧟", rarity: "common", price: 20 },
  { id: "token-skeleton", name: "Skeleton Token", emoji: "💀", rarity: "common", price: 20 },
  { id: "token-spider", name: "Spider Token", emoji: "🕷️", rarity: "common", price: 20 },
  { id: "token-pig", name: "Pig Token", emoji: "🐷", rarity: "common", price: 20 },
  { id: "token-bat", name: "Bat Token", emoji: "🦇", rarity: "common", price: 20 },
  { id: "token-chicken", name: "Chicken Token", emoji: "🐔", rarity: "common", price: 20 },
  { id: "token-squid", name: "Squid Token", emoji: "🦑", rarity: "common", price: 20 },
  { id: "token-horse", name: "Horse Token", emoji: "🐴", rarity: "common", price: 20 },
  // Uncommon - ₹30
  { id: "token-blaze", name: "Blaze Token", emoji: "🔥", rarity: "uncommon", price: 30 },
  { id: "token-guardian", name: "Guardian Token", emoji: "🐡", rarity: "uncommon", price: 30 },
  { id: "token-snow-golem", name: "Snow Golem Token", emoji: "⛄", rarity: "uncommon", price: 30 },
  { id: "token-wolf", name: "Wolf Token", emoji: "🐺", rarity: "uncommon", price: 30 },
  { id: "token-bee", name: "Bee Token", emoji: "🐝", rarity: "uncommon", price: 30 },
  { id: "token-witch", name: "Witch Token", emoji: "🧙", rarity: "uncommon", price: 30 },
  { id: "token-frog", name: "Frog Token", emoji: "🐸", rarity: "uncommon", price: 30 },
  { id: "token-iron-golem", name: "Iron Golem Token", emoji: "🤖", rarity: "uncommon", price: 30 },
  // Rare - ₹50
  { id: "token-wither-skeleton", name: "Wither Skeleton Token", emoji: "☠️", rarity: "rare", price: 50 },
  { id: "token-ender-guardian", name: "Ender Guardian Token", emoji: "👁️", rarity: "rare", price: 50 },
  { id: "token-evoker", name: "Evoker Token", emoji: "🧙‍♂️", rarity: "rare", price: 50 },
  { id: "token-pillager", name: "Pillager Token", emoji: "🏹", rarity: "rare", price: 50 },
  { id: "token-shulker", name: "Shulker Token", emoji: "📦", rarity: "rare", price: 50 },
  { id: "token-vindicator", name: "Vindicator Token", emoji: "🪓", rarity: "rare", price: 50 },
  // Epic - ₹80
  { id: "token-ravager", name: "Ravager Token", emoji: "🦏", rarity: "epic", price: 80 },
  // Legendary - ₹100
  { id: "token-ender-dragon", name: "Ender Dragon Token", emoji: "🐉", rarity: "legendary", price: 100 },
  // Mythic - ₹120
  { id: "token-warden", name: "Warden Token", emoji: "👹", rarity: "mythic", price: 120 },
];

const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

const TokensSection = () => {
  const navigate = useNavigate();

  const groupedTokens = rarityOrder.map((rarity) => ({
    rarity,
    config: rarityConfig[rarity],
    items: tokens.filter((t) => t.rarity === rarity),
  }));

  return (
    <section id="tokens" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-yellow-500/10 blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[150px] -translate-y-1/2" />
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
            🎯 MOB TOKENS
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4">
            <span className="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">Token Collection</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Collect powerful mob tokens on TOKEN SMP! Each token has unique abilities.
          </p>
        </motion.div>

        {groupedTokens.map((group) => (
          <div key={group.rarity} className="mb-12">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${group.config.gradient}`}>
                <span className="font-display font-bold text-white text-sm">{group.config.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">Drop Rate: {group.config.dropRate}</span>
              <span className={`font-display font-bold ${group.config.color}`}>₹{group.items[0]?.price}</span>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {group.items.map((token, index) => (
                <motion.div
                  key={token.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/checkout/${token.id}`)}
                >
                  <div
                    className="relative overflow-hidden rounded-xl bg-card border border-border/50 p-4 transition-all duration-300 hover:border-opacity-80 text-center"
                    style={{ boxShadow: group.config.glow }}
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                    
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${group.config.bgGradient} flex items-center justify-center`}>
                      <span className="text-3xl">{token.emoji}</span>
                    </div>

                    <h4 className="font-display text-sm font-bold text-foreground mb-1 line-clamp-1">
                      {token.name}
                    </h4>

                    <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-display font-bold bg-gradient-to-r ${group.config.gradient} text-white mb-2`}>
                      {group.config.label}
                    </div>

                    <div className={`font-display font-bold ${group.config.color}`}>
                      ₹{token.price}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TokensSection;
