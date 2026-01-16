import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Crown, Star, Flame, Skull, Sparkles, Gem, Check, Zap, Shield, Clock, ChevronDown, Package, Gift, Key, Upload, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Rank images
import proRank from "@/assets/ranks/pro_rank.png";
import eliteRank from "@/assets/ranks/elite_rank.png";
import legendRank from "@/assets/ranks/legend_rank.png";
import deadliestRank from "@/assets/ranks/deadliest_rank.png";
import immortalRank from "@/assets/ranks/immortal_rank.png";
import supremeRank from "@/assets/ranks/supreme_rank.png";

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1459835220290441345/25r77rdGny-cj81NCY1ivV5l8C5Z78f9MswpNtg6l9peOEpr-EF55Is7cmTiAAEUfFht";

type ProductType = "rank" | "key";

interface RankProduct {
  type: "rank";
  name: string;
  description: string;
  kitName: string;
  image: string;
  tier: string;
  durations: { days: number; price: number }[];
  perks: string[];
  kitItems: string[];
  qrLink: string;
}

interface KeyProduct {
  type: "key";
  name: string;
  description: string;
  price: number;
  isFree: boolean;
  rewards: string[];
  qrLink: string;
}

type Product = RankProduct | KeyProduct;

const products: Record<string, Product> = {
  // Ranks
  pro: {
    type: "rank",
    name: "PRO RANK",
    description: "Start your journey with the PRO status. Includes essential commands and exclusive gear.",
    kitName: "PRO Kit",
    image: proRank,
    tier: "pro",
    durations: [
      { days: 30, price: 30 },
      { days: 60, price: 55 },
    ],
    perks: ["Diamond Armor Kit", "2 Homes", "/nick Command", "Colored Chat", "Access to /hat", "Priority Support"],
    kitItems: ["Diamond Helmet (Protection III)", "Diamond Chestplate (Protection III)", "Diamond Leggings (Protection III)", "Diamond Boots (Protection III)", "Diamond Sword (Sharpness III)", "32x Golden Apples"],
    qrLink: "https://spicysmp.dpdns.org/pro.html",
  },
  elite: {
    type: "rank",
    name: "ELITE RANK",
    description: "Step up your game with colored chat, more homes, and premium perks.",
    kitName: "ELITE Kit",
    image: eliteRank,
    tier: "elite",
    durations: [
      { days: 30, price: 55 },
      { days: 60, price: 100 },
    ],
    perks: ["Full Diamond Kit", "5 Homes", "/fly in Lobby", "Priority Queue", "Colored Chat", "Custom Nickname"],
    kitItems: ["Diamond Helmet (Protection IV)", "Diamond Chestplate (Protection IV)", "Diamond Leggings (Protection IV)", "Diamond Boots (Protection IV)", "Diamond Sword (Sharpness IV)", "64x Golden Apples", "Ender Pearls x16"],
    qrLink: "https://spicysmp.dpdns.org/elite.html",
  },
  legend: {
    type: "rank",
    name: "LEGEND RANK",
    description: "Become a legend on the server with exclusive trails and priority access.",
    kitName: "LEGEND Kit",
    image: legendRank,
    tier: "legend",
    durations: [
      { days: 30, price: 80 },
      { days: 60, price: 150 },
    ],
    perks: ["Netherite Armor Kit", "10 Homes", "Custom Title", "Exclusive Trails", "Priority Queue", "/enderchest"],
    kitItems: ["Netherite Helmet (Protection IV)", "Netherite Chestplate (Protection IV)", "Netherite Leggings (Protection IV)", "Netherite Boots (Protection IV)", "Netherite Sword (Sharpness V)", "Notch Apple x8"],
    qrLink: "https://spicysmp.dpdns.org/legend.html",
  },
  deadliest: {
    type: "rank",
    name: "DEADLIEST RANK",
    description: "Unleash your true combat potential with special perks and kill effects.",
    kitName: "DEADLIEST Kit",
    image: deadliestRank,
    tier: "deadliest",
    durations: [
      { days: 30, price: 150 },
      { days: 60, price: 280 },
    ],
    perks: ["Combat Perks", "15 Homes", "Exclusive Particles", "Kill Effects", "/feed Command", "Special Trails"],
    kitItems: ["Netherite Helmet (Protection V)", "Netherite Chestplate (Protection V)", "Netherite Leggings (Protection V)", "Netherite Boots (Protection V)", "Netherite Sword (Sharpness VII)", "Notch Apple x16", "Totem x2"],
    qrLink: "https://spicysmp.dpdns.org/deadliest.html",
  },
  immortal: {
    type: "rank",
    name: "IMMORTAL RANK",
    description: "Unlock the power of eternity with flight and legendary abilities.",
    kitName: "IMMORTAL Kit",
    image: immortalRank,
    tier: "immortal",
    durations: [
      { days: 30, price: 110 },
      { days: 60, price: 200 },
    ],
    perks: ["Flight in Lobby", "Unique Titles", "20 Homes", "Legendary Kit", "/heal Command", "Exclusive Cosmetics"],
    kitItems: ["Netherite Helmet (Protection V, Mending)", "Netherite Chestplate (Protection V, Mending)", "Netherite Leggings (Protection V, Mending)", "Netherite Boots (Protection V, Mending)", "Netherite Sword (Sharpness VII, Mending)", "Notch Apple x24", "Totem x4"],
    qrLink: "https://spicysmp.dpdns.org/immortal.html",
  },
  supreme: {
    type: "rank",
    name: "SUPREME RANK",
    description: "The ultimate status. Dominate with maximum claim blocks and all commands.",
    kitName: "SUPREME Kit",
    image: supremeRank,
    tier: "supreme",
    durations: [
      { days: 30, price: 200 },
      { days: 60, price: 380 },
    ],
    perks: ["Max Claim Blocks", "30 Homes", "All Commands", "Supreme Kit", "VIP Support", "Beta Access"],
    kitItems: ["Netherite Helmet (All Max Enchants)", "Netherite Chestplate (All Max Enchants)", "Netherite Leggings (All Max Enchants)", "Netherite Boots (All Max Enchants)", "Netherite Sword (All Max Enchants)", "Notch Apple x32", "Totem x8", "Mace (Exclusive)"],
    qrLink: "https://spicysmp.dpdns.org/supreme.html",
  },
  // Keys
  "vote-key": {
    type: "key",
    name: "Vote Key",
    description: "Get this key for FREE by voting for our server! Contains diamond gear and golden apples.",
    price: 0,
    isFree: true,
    rewards: ["Diamond Kit (II-III)", "Spawner (Random)", "Golden Apples x8", "Random Enchant Books"],
    qrLink: "https://spicysmp.dpdns.org/vote_key.html",
  },
  "party-key": {
    type: "key",
    name: "Party Key",
    description: "Share the luck! This key gives random keys to other players on the server.",
    price: 0,
    isFree: true,
    rewards: ["Random Keys for Players", "Party Rewards", "Bonus XP", "Special Effects"],
    qrLink: "https://spicysmp.dpdns.org/party_key.html",
  },
  "banana-key": {
    type: "key",
    name: "Banana Key (5x)",
    description: "Full Netherite kit with high-level enchantments and rare items.",
    price: 50,
    isFree: false,
    rewards: ["Full Netherite Kit", "Enchantment (V)", "Spawner", "Golden Apples x16"],
    qrLink: "https://spicysmp.dpdns.org/banana_key.html",
  },
  "apple-key": {
    type: "key",
    name: "Apple Key (5x)",
    description: "Premium key with enhanced luck and better drop rates.",
    price: 60,
    isFree: false,
    rewards: ["Full Netherite Kit", "Enchantment (IV)", "Spawner", "Golden Apples x24", "More Luck Bonus"],
    qrLink: "https://spicysmp.dpdns.org/APPLE_key.html",
  },
  "blood-key": {
    type: "key",
    name: "Blood Key",
    description: "Powerful key with top-tier enchantments and Notch Apples.",
    price: 100,
    isFree: false,
    rewards: ["Full Netherite Kit", "Enchantment (VII)", "Spawner", "Golden Apples x32", "Notch Apple x4"],
    qrLink: "https://spicysmp.dpdns.org/BLOOD_key.html",
  },
  "blue-key": {
    type: "key",
    name: "Blue Key (5x)",
    description: "High-value key with extreme enchantments and rare rewards.",
    price: 150,
    isFree: false,
    rewards: ["Full Netherite Kit", "Enchantment (X)", "Spawner", "Golden Apples x48", "Notch Apple x8"],
    qrLink: "https://spicysmp.dpdns.org/BLUE_key.html",
  },
  "purple-key": {
    type: "key",
    name: "Purple Key (5x)",
    description: "Ultimate key with maximum enchantments and exclusive Mace weapon.",
    price: 200,
    isFree: false,
    rewards: ["Full Netherite Kit", "Enchantment (XV)", "Spawner", "Golden Apples x64", "Mace Weapon"],
    qrLink: "https://spicysmp.dpdns.org/purple_key.html",
  },
};

const tierConfig: Record<string, { icon: typeof Star; gradient: string; bgGradient: string; glow: string; accent: string }> = {
  pro: {
    icon: Star,
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-500/20 to-blue-600/20",
    glow: "0 0 80px hsla(185, 100%, 50%, 0.4)",
    accent: "text-cyan-400",
  },
  elite: {
    icon: Crown,
    gradient: "from-blue-500 to-purple-600",
    bgGradient: "from-blue-500/20 to-purple-600/20",
    glow: "0 0 80px hsla(240, 100%, 50%, 0.4)",
    accent: "text-blue-400",
  },
  legend: {
    icon: Flame,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-500/20 to-orange-600/20",
    glow: "0 0 80px hsla(45, 100%, 50%, 0.4)",
    accent: "text-amber-400",
  },
  deadliest: {
    icon: Skull,
    gradient: "from-red-500 to-rose-600",
    bgGradient: "from-red-500/20 to-rose-600/20",
    glow: "0 0 80px hsla(0, 100%, 50%, 0.4)",
    accent: "text-red-400",
  },
  immortal: {
    icon: Sparkles,
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-500/20 to-rose-500/20",
    glow: "0 0 80px hsla(320, 100%, 50%, 0.4)",
    accent: "text-pink-400",
  },
  supreme: {
    icon: Gem,
    gradient: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-500/20 to-violet-600/20",
    glow: "0 0 80px hsla(280, 100%, 50%, 0.4)",
    accent: "text-purple-400",
  },
};

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [showKitItems, setShowKitItems] = useState(false);
  
  // Form states
  const [minecraftUsername, setMinecraftUsername] = useState("");
  const [transferId, setTransferId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = productId ? products[productId] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!minecraftUsername.trim()) {
      toast.error("Please enter your Minecraft username");
      return;
    }
    if (!transferId.trim()) {
      toast.error("Please enter your Transfer ID");
      return;
    }
    if (!screenshot) {
      toast.error("Please upload a payment screenshot");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      const isRankProduct = product?.type === "rank";
      const price = isRankProduct 
        ? (product as RankProduct).durations[selectedDuration].price 
        : (product as KeyProduct).price;
      const duration = isRankProduct 
        ? `${(product as RankProduct).durations[selectedDuration].days} Days` 
        : "N/A";

      const embedPayload = {
        embeds: [{
          title: "🎮 New Purchase Request!",
          color: 0x00ff00,
          fields: [
            { name: "📦 Product", value: product?.name || "Unknown", inline: true },
            { name: "💰 Price", value: `₹${price}`, inline: true },
            { name: "⏱️ Duration", value: duration, inline: true },
            { name: "🎯 Minecraft Username", value: minecraftUsername, inline: true },
            { name: "🔢 Transfer ID", value: transferId, inline: true },
          ],
          timestamp: new Date().toISOString(),
          footer: { text: "SPICYSMP Store" }
        }]
      };

      // First send the embed message
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embedPayload),
      });

      // Then send the screenshot as a file
      formData.append("file", screenshot, screenshot.name);
      formData.append("payload_json", JSON.stringify({
        content: `📸 Payment Screenshot for **${minecraftUsername}** (Transfer ID: ${transferId})`
      }));

      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      setIsSubmitted(true);
      toast.success("Purchase request submitted successfully!");
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Product Not Found</h1>
          <Button variant="hero" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const isRank = product.type === "rank";
  const config = isRank ? tierConfig[(product as RankProduct).tier] : null;
  const Icon = config?.icon || Key;
  const gradient = config?.gradient || (product as KeyProduct).isFree ? "from-accent to-cyan-400" : "from-secondary to-amber-400";
  const bgGradient = config?.bgGradient || (product as KeyProduct).isFree ? "from-accent/20 to-cyan-400/20" : "from-secondary/20 to-amber-400/20";
  const glow = config?.glow || (product as KeyProduct).isFree ? "0 0 80px hsla(185, 100%, 50%, 0.3)" : "0 0 80px hsla(45, 100%, 50%, 0.3)";
  const accent = config?.accent || (product as KeyProduct).isFree ? "text-accent" : "text-secondary";

  const currentPrice = isRank 
    ? (product as RankProduct).durations[selectedDuration].price 
    : (product as KeyProduct).price;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${bgGradient} blur-[150px]`} />
        <div className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${bgGradient} blur-[150px]`} />
      </div>

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 glass py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Store</span>
          </Button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-lg">🔥</span>
            </div>
            <span className="font-display text-lg font-bold gradient-text">SPICYSMP</span>
          </Link>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Shield className="w-4 h-4 text-accent" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Product info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Product image/icon */}
              <div
                className="relative rounded-2xl overflow-hidden mb-6"
                style={{ boxShadow: glow }}
              >
                {isRank ? (
                  <img
                    src={(product as RankProduct).image}
                    alt={product.name}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className={`w-full aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {(product as KeyProduct).isFree ? (
                        <Gift className="w-24 h-24 text-white" />
                      ) : (
                        <Key className="w-24 h-24 text-white" />
                      )}
                    </motion.div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Badge */}
                <div className={`absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r ${gradient} flex items-center gap-2`}>
                  <Icon className="w-4 h-4 text-white" />
                  <span className="text-sm font-display font-bold text-white">
                    {isRank ? (product as RankProduct).tier.toUpperCase() : (product as KeyProduct).isFree ? "FREE" : "PREMIUM"}
                  </span>
                </div>
              </div>

              {/* Title and description */}
              <h1 className={`font-display text-3xl md:text-4xl font-black mb-3 ${accent}`}>
                {product.name}
              </h1>
              <p className="text-muted-foreground mb-6">{product.description}</p>

              {/* Perks/Rewards */}
              <div className="space-y-3 mb-6">
                <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                  {isRank ? "Perks Included" : "Possible Rewards"}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(isRank ? (product as RankProduct).perks : (product as KeyProduct).rewards).map((item, index) => (
                    <motion.div
                      key={item}
                      className="flex items-center gap-2 p-3 rounded-lg glass border border-border/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Check className={`w-4 h-4 ${accent} flex-shrink-0`} />
                      <span className="text-sm text-foreground">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Kit items (ranks only) */}
              {isRank && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowKitItems(!showKitItems)}
                    className="flex items-center gap-2 text-sm font-display text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span>View Kit Items</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showKitItems ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showKitItems && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 p-4 rounded-xl glass border border-border/50 space-y-2">
                          {(product as RankProduct).kitItems.map((item) => (
                            <div key={item} className="flex items-center gap-2 text-sm">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
                              <span className="text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Right: Purchase card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="sticky top-24 rounded-2xl bg-card border border-border/50 overflow-hidden"
                style={{ boxShadow: glow }}
              >
                {/* Card header */}
                <div className={`p-6 bg-gradient-to-r ${gradient}`}>
                  <h2 className="font-display text-xl font-bold text-white mb-1">Complete Purchase</h2>
                  <p className="text-white/80 text-sm">Secure payment via UPI/QR Code</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Duration selector (ranks only) */}
                  {isRank && (
                    <div>
                      <label className="block text-sm font-display text-muted-foreground mb-3">
                        Select Duration:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(product as RankProduct).durations.map((duration, index) => (
                          <button
                            key={duration.days}
                            onClick={() => setSelectedDuration(index)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              selectedDuration === index
                                ? `border-transparent bg-gradient-to-r ${gradient} text-white`
                                : "border-border/50 bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className="font-display font-bold">{duration.days} Days</div>
                            <div className={selectedDuration === index ? "text-white/80" : "text-muted-foreground"}>
                              ₹{duration.price}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* QR Code Display */}
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-white rounded-xl mb-3">
                      <img 
                        src="https://spicysmp.dpdns.org/qr.png" 
                        alt="Payment QR Code" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Scan to pay via UPI
                    </p>
                  </div>

                  {/* Price display */}
                  <div className="text-center py-4 border-y border-border/50">
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <motion.div
                      key={currentPrice}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`font-display text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                    >
                      {(product as KeyProduct).isFree ? "FREE" : `₹${currentPrice}`}
                    </motion.div>
                  </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        Request Submitted!
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Your purchase request has been sent. We'll verify your payment and activate your {isRank ? "rank" : "key"} soon!
                      </p>
                      <Button 
                        variant="ghost" 
                        className="mt-4"
                        onClick={() => navigate("/")}
                      >
                        Back to Store
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-display text-muted-foreground mb-2">
                            Minecraft Username *
                          </label>
                          <Input
                            placeholder="Enter your Minecraft username"
                            value={minecraftUsername}
                            onChange={(e) => setMinecraftUsername(e.target.value)}
                            className="bg-background/50 border-border/50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-display text-muted-foreground mb-2">
                            UPI Transfer ID *
                          </label>
                          <Input
                            placeholder="Enter UPI Transaction ID"
                            value={transferId}
                            onChange={(e) => setTransferId(e.target.value)}
                            className="bg-background/50 border-border/50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-display text-muted-foreground mb-2">
                            Payment Screenshot *
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="hidden"
                          />
                          
                          {screenshotPreview ? (
                            <div className="relative">
                              <img 
                                src={screenshotPreview} 
                                alt="Screenshot preview" 
                                className="w-full h-32 object-cover rounded-lg border border-border/50"
                              />
                              <button
                                onClick={() => {
                                  setScreenshot(null);
                                  setScreenshotPreview(null);
                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="absolute top-2 right-2 p-1 bg-destructive/80 rounded-full text-white text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full p-6 border-2 border-dashed border-border/50 rounded-xl hover:border-primary/50 transition-colors flex flex-col items-center gap-2"
                            >
                              <Upload className="w-8 h-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Click to upload screenshot
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Trust badges */}
                      <div className="flex items-center justify-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-secondary" />
                          <span className="text-xs">Instant</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-accent" />
                          <span className="text-xs">Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-xs">24/7</span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        variant="hero"
                        size="xl"
                        className="w-full group"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <span>{(product as KeyProduct).isFree ? "Get Free Key" : "Submit Purchase"}</span>
                        )}
                      </Button>

                      {/* Info text */}
                      <p className="text-xs text-center text-muted-foreground">
                        After payment, fill the form above and we'll activate your purchase within 24 hours.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SPICYSMP. All rights reserved.</p>
          <p className="mt-1 text-xs">Server IP: play.spicynet.fun</p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
