import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Star, Flame, Skull, Sparkles, Gem, ShieldCheck, ExternalLink, Zap, Shield, Check } from "lucide-react";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  description: string;
  kitName: string;
  originalPrice: string;
  salePrice: string;
  buyLink: string;
  image: string;
  tier: "pro" | "elite" | "legend" | "deadliest" | "immortal" | "supreme" | "admin";
}

const tierConfig = {
  pro: {
    icon: Star,
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-500/20 to-blue-600/20",
    glow: "0 0 60px hsla(185, 100%, 50%, 0.3)",
    accent: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    perks: ["Diamond Armor Kit", "2 Homes", "/nick Command", "Colored Chat"],
  },
  elite: {
    icon: Crown,
    gradient: "from-blue-500 to-purple-600",
    bgGradient: "from-blue-500/20 to-purple-600/20",
    glow: "0 0 60px hsla(240, 100%, 50%, 0.3)",
    accent: "text-blue-400",
    borderColor: "border-blue-500/30",
    perks: ["Full Diamond Kit", "5 Homes", "/fly in Lobby", "Priority Queue"],
  },
  legend: {
    icon: Flame,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-500/20 to-orange-600/20",
    glow: "0 0 60px hsla(45, 100%, 50%, 0.3)",
    accent: "text-amber-400",
    borderColor: "border-amber-500/30",
    perks: ["Netherite Armor Kit", "10 Homes", "Custom Title", "Exclusive Trails"],
  },
  deadliest: {
    icon: Skull,
    gradient: "from-red-500 to-rose-600",
    bgGradient: "from-red-500/20 to-rose-600/20",
    glow: "0 0 60px hsla(0, 100%, 50%, 0.3)",
    accent: "text-red-400",
    borderColor: "border-red-500/30",
    perks: ["Combat Perks", "15 Homes", "Exclusive Particles", "Kill Effects"],
  },
  immortal: {
    icon: Sparkles,
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-500/20 to-rose-500/20",
    glow: "0 0 60px hsla(320, 100%, 50%, 0.3)",
    accent: "text-pink-400",
    borderColor: "border-pink-500/30",
    perks: ["Flight in Lobby", "Unique Titles", "20 Homes", "Legendary Kit"],
  },
  supreme: {
    icon: Gem,
    gradient: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-500/20 to-violet-600/20",
    glow: "0 0 60px hsla(280, 100%, 50%, 0.3)",
    accent: "text-purple-400",
    borderColor: "border-purple-500/30",
    perks: ["Max Claim Blocks", "30 Homes", "All Commands", "Supreme Kit"],
  },
  admin: {
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-500/20 to-teal-600/20",
    glow: "0 0 60px hsla(160, 100%, 50%, 0.3)",
    accent: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    perks: ["Admin Commands", "Unlimited Homes", "Staff Badge", "Full Access"],
  },
};

const PurchaseModal = ({
  isOpen,
  onClose,
  name,
  description,
  kitName,
  originalPrice,
  salePrice,
  buyLink,
  image,
  tier,
}: PurchaseModalProps) => {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-border/50" style={{ boxShadow: config.glow }}>
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br ${config.bgGradient} blur-[80px]`} />
          <div className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br ${config.bgGradient} blur-[80px]`} />
        </div>

        <div className="relative z-10">
          {/* Header with image */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            
            {/* Floating badge */}
            <motion.div
              className={`absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} flex items-center gap-2`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Icon className="w-4 h-4 text-white" />
              <span className="text-sm font-display font-bold text-white">{name}</span>
            </motion.div>

            {/* Sale tag */}
            <motion.div
              className="absolute top-4 right-4 px-3 py-1 rounded-full bg-destructive/90 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <span className="text-xs font-display font-bold text-destructive-foreground">SALE</span>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className={`font-display text-2xl font-black ${config.accent}`}>
                {name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {description} Includes the exclusive <span className="font-semibold text-foreground">{kitName}</span>.
              </DialogDescription>
            </DialogHeader>

            {/* Perks grid */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {config.perks.map((perk, index) => (
                <motion.div
                  key={perk}
                  className={`flex items-center gap-2 p-3 rounded-lg glass ${config.borderColor} border`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Check className={`w-4 h-4 ${config.accent}`} />
                  <span className="text-sm text-foreground">{perk}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 py-4 border-y border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4 text-secondary" />
                <span className="text-xs">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-xs">Secure Payment</span>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg text-muted-foreground line-through">{originalPrice}</span>
                <motion.span
                  className={`font-display text-3xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 }}
                >
                  {salePrice}
                </motion.span>
              </div>

              <Button variant="hero" size="lg" className="group" asChild>
                <a href={buyLink} target="_blank" rel="noopener noreferrer">
                  <span>Purchase Now</span>
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
