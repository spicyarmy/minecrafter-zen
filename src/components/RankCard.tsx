import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Crown, Star, Flame, Skull, Sparkles, Gem, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RankCardProps {
  name: string;
  description: string;
  kitName: string;
  originalPrice: string;
  salePrice: string;
  buyLink: string;
  image: string;
  tier: "spicy" | "pro" | "elite" | "legend" | "deadliest" | "immortal" | "supreme" | "admin" | "custom";
  index: number;
}

const tierConfig = {
  spicy: {
    icon: Flame,
    gradient: "from-orange-500 to-red-600",
    glow: "0 0 30px hsla(20, 100%, 50%, 0.5)",
    accent: "text-orange-400",
  },
  pro: {
    icon: Star,
    gradient: "from-cyan-500 to-blue-600",
    glow: "0 0 30px hsla(185, 100%, 50%, 0.4)",
    accent: "text-cyan-400",
  },
  elite: {
    icon: Crown,
    gradient: "from-blue-500 to-purple-600",
    glow: "0 0 30px hsla(240, 100%, 50%, 0.4)",
    accent: "text-blue-400",
  },
  legend: {
    icon: Flame,
    gradient: "from-amber-500 to-orange-600",
    glow: "0 0 30px hsla(45, 100%, 50%, 0.4)",
    accent: "text-amber-400",
  },
  deadliest: {
    icon: Skull,
    gradient: "from-red-500 to-rose-600",
    glow: "0 0 30px hsla(0, 100%, 50%, 0.4)",
    accent: "text-red-400",
  },
  immortal: {
    icon: Sparkles,
    gradient: "from-pink-500 to-rose-500",
    glow: "0 0 30px hsla(320, 100%, 50%, 0.4)",
    accent: "text-pink-400",
  },
  supreme: {
    icon: Gem,
    gradient: "from-purple-500 to-violet-600",
    glow: "0 0 30px hsla(280, 100%, 50%, 0.4)",
    accent: "text-purple-400",
  },
  admin: {
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-teal-600",
    glow: "0 0 30px hsla(160, 100%, 50%, 0.4)",
    accent: "text-emerald-400",
  },
  custom: {
    icon: Sparkles,
    gradient: "from-emerald-500 to-teal-600",
    glow: "0 0 30px hsla(160, 100%, 50%, 0.5)",
    accent: "text-emerald-400",
  },
};

const RankCard = ({
  name,
  description,
  kitName,
  originalPrice,
  salePrice,
  buyLink,
  image,
  tier,
  index,
}: RankCardProps) => {
  const navigate = useNavigate();
  const config = tierConfig[tier];
  const Icon = config.icon;

  const handleBuyClick = () => {
    navigate(`/checkout/${tier}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative"
    >
      {/* Card container */}
      <div
        className="relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-500"
        style={{
          boxShadow: "0 4px 24px hsla(0, 0%, 0%, 0.4)",
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: config.glow }}
        />

        {/* Image container */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          
          {/* Floating icon badge */}
          <motion.div
            className={`absolute top-4 right-4 w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>

          {/* Wishlist heart */}
          <button className="absolute top-4 left-4 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm">♡</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className={`font-display text-xl font-bold mb-2 ${config.accent}`}>
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description} Includes the exclusive <span className="font-semibold">{kitName}</span>.
          </p>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
            <span className={`font-display text-xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              {salePrice}
            </span>
          </div>

          {/* Buy button */}
          <Button 
            variant="gaming" 
            className="w-full group/btn" 
            onClick={handleBuyClick}
          >
            <span className="relative z-10">Buy Now</span>
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover/btn:opacity-20 transition-opacity rounded-lg`}
            />
          </Button>
        </div>

        {/* Animated border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${config.gradient} [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]`} />
        </div>
      </div>
    </motion.div>
  );
};

export default RankCard;
