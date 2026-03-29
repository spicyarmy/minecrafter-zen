import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Sword, Shield, Pickaxe, Axe, Zap, Sparkles, Plus, Minus, Check, ShoppingCart, Crown, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/ParticleBackground";

// Weapon types
const WEAPONS = [
  { 
    id: "mace", 
    name: "Mace", 
    icon: "🔨",
    emoji: "⚔️",
    basePrice: 30,
    gradient: "from-amber-500 to-orange-600",
    glow: "hsla(30, 100%, 50%, 0.4)",
    color: "text-amber-400",
    description: "Devastating blunt force weapon"
  },
  { 
    id: "sword", 
    name: "Sword", 
    icon: "⚔️",
    emoji: "🗡️",
    basePrice: 25,
    gradient: "from-cyan-500 to-blue-600",
    glow: "hsla(200, 100%, 50%, 0.4)",
    color: "text-cyan-400",
    description: "Classic melee combat weapon"
  },
  { 
    id: "axe", 
    name: "Axe", 
    icon: "🪓",
    emoji: "🪓",
    basePrice: 28,
    gradient: "from-red-500 to-rose-600",
    glow: "hsla(0, 100%, 50%, 0.4)",
    color: "text-red-400",
    description: "Heavy hitting battle axe"
  },
  { 
    id: "pickaxe", 
    name: "Pickaxe", 
    icon: "⛏️",
    emoji: "⛏️",
    basePrice: 20,
    gradient: "from-emerald-500 to-teal-600",
    glow: "hsla(160, 100%, 50%, 0.4)",
    color: "text-emerald-400",
    description: "Essential mining tool"
  },
  { 
    id: "trident", 
    name: "Trident", 
    icon: "🔱",
    emoji: "🔱",
    basePrice: 35,
    gradient: "from-blue-500 to-indigo-600",
    glow: "hsla(230, 100%, 50%, 0.4)",
    color: "text-blue-400",
    description: "Legendary aquatic weapon"
  },
  { 
    id: "bow", 
    name: "Bow", 
    icon: "🏹",
    emoji: "🏹",
    basePrice: 22,
    gradient: "from-yellow-500 to-amber-600",
    glow: "hsla(45, 100%, 50%, 0.4)",
    color: "text-yellow-400",
    description: "Precise ranged weapon"
  },
];

// Enchantments per weapon type
const ENCHANTMENTS: Record<string, { id: string; name: string; maxLevel: number; pricePerLevel: number; icon: string }[]> = {
  mace: [
    { id: "sharpness", name: "Sharpness", maxLevel: 15, pricePerLevel: 3, icon: "⚡" },
    { id: "smite", name: "Smite", maxLevel: 15, pricePerLevel: 2, icon: "☀️" },
    { id: "fire_aspect", name: "Fire Aspect", maxLevel: 10, pricePerLevel: 4, icon: "🔥" },
    { id: "knockback", name: "Knockback", maxLevel: 10, pricePerLevel: 3, icon: "💨" },
    { id: "unbreaking", name: "Unbreaking", maxLevel: 10, pricePerLevel: 2, icon: "🛡️" },
    { id: "mending", name: "Mending", maxLevel: 1, pricePerLevel: 15, icon: "✨" },
    { id: "looting", name: "Looting", maxLevel: 10, pricePerLevel: 3, icon: "💰" },
  ],
  sword: [
    { id: "sharpness", name: "Sharpness", maxLevel: 15, pricePerLevel: 3, icon: "⚡" },
    { id: "smite", name: "Smite", maxLevel: 15, pricePerLevel: 2, icon: "☀️" },
    { id: "bane_of_arthropods", name: "Bane of Arthropods", maxLevel: 15, pricePerLevel: 2, icon: "🕷️" },
    { id: "fire_aspect", name: "Fire Aspect", maxLevel: 10, pricePerLevel: 4, icon: "🔥" },
    { id: "knockback", name: "Knockback", maxLevel: 10, pricePerLevel: 3, icon: "💨" },
    { id: "looting", name: "Looting", maxLevel: 10, pricePerLevel: 3, icon: "💰" },
    { id: "sweeping_edge", name: "Sweeping Edge", maxLevel: 10, pricePerLevel: 3, icon: "🌀" },
    { id: "unbreaking", name: "Unbreaking", maxLevel: 10, pricePerLevel: 2, icon: "🛡️" },
    { id: "mending", name: "Mending", maxLevel: 1, pricePerLevel: 15, icon: "✨" },
  ],
  axe: [
    { id: "sharpness", name: "Sharpness", maxLevel: 15, pricePerLevel: 3, icon: "⚡" },
    { id: "smite", name: "Smite", maxLevel: 15, pricePerLevel: 2, icon: "☀️" },
    { id: "efficiency", name: "Efficiency", maxLevel: 15, pricePerLevel: 2, icon: "⚙️" },
    { id: "fire_aspect", name: "Fire Aspect", maxLevel: 10, pricePerLevel: 4, icon: "🔥" },
    { id: "unbreaking", name: "Unbreaking", maxLevel: 10, pricePerLevel: 2, icon: "🛡️" },
    { id: "mending", name: "Mending", maxLevel: 1, pricePerLevel: 15, icon: "✨" },
    { id: "silk_touch", name: "Silk Touch", maxLevel: 1, pricePerLevel: 10, icon: "🧤" },
  ],
  pickaxe: [
    { id: "efficiency", name: "Efficiency", maxLevel: 15, pricePerLevel: 2, icon: "⚙️" },
    { id: "fortune", name: "Fortune", maxLevel: 10, pricePerLevel: 4, icon: "💎" },
    { id: "silk_touch", name: "Silk Touch", maxLevel: 1, pricePerLevel: 10, icon: "🧤" },
    { id: "unbreaking", name: "Unbreaking", maxLevel: 10, pricePerLevel: 2, icon: "🛡️" },
    { id: "mending", name: "Mending", maxLevel: 1, pricePerLevel: 15, icon: "✨" },
  ],
  trident: [
    { id: "loyalty", name: "Loyalty", maxLevel: 10, pricePerLevel: 3, icon: "🔗" },
    { id: "riptide", name: "Riptide", maxLevel: 10, pricePerLevel: 4, icon: "🌊" },
    { id: "channeling", name: "Channeling", maxLevel: 1, pricePerLevel: 12, icon: "⚡" },
    { id: "impaling", name: "Impaling", maxLevel: 15, pricePerLevel: 3, icon: "🔱" },
    { id: "unbreaking", name: "Unbreaking", maxLevel: 10, pricePerLevel: 2, icon: "🛡️" },
    { id: "mending", name: "Mending", maxLevel: 1, pricePerLevel: 15, icon: "✨" },
  ],
  bow: [
    { id: "power", name: "Power", maxLevel: 15, pricePerLevel: 3, icon: "💥" },
    { id: "punch", name: "Punch", maxLevel: 10, pricePerLevel: 3, icon: "💨" },
    { id: "flame", name: "Flame", maxLevel: 1, pricePerLevel: 10, icon: "🔥" },
    { id: "infinity", name: "Infinity", maxLevel: 1, pricePerLevel: 12, icon: "♾️" },
    { id: "unbreaking", name: "Unbreaking", maxLevel: 10, pricePerLevel: 2, icon: "🛡️" },
    { id: "mending", name: "Mending", maxLevel: 1, pricePerLevel: 15, icon: "✨" },
  ],
};

const MAX_PRICE = 120;

const CustomWeapon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serverParam = searchParams.get("server") || "gem";
  
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [selectedEnchantments, setSelectedEnchantments] = useState<Record<string, number>>({});

  const weapon = WEAPONS.find(w => w.id === selectedWeapon);
  const enchantmentList = selectedWeapon ? ENCHANTMENTS[selectedWeapon] || [] : [];

  const totalPrice = useMemo(() => {
    if (!weapon) return 0;
    let price = weapon.basePrice;
    for (const [enchId, level] of Object.entries(selectedEnchantments)) {
      const ench = enchantmentList.find(e => e.id === enchId);
      if (ench && level > 0) {
        price += ench.pricePerLevel * level;
      }
    }
    return Math.min(price, MAX_PRICE);
  }, [weapon, selectedEnchantments, enchantmentList]);

  const toggleEnchantment = (enchId: string) => {
    setSelectedEnchantments(prev => {
      if (prev[enchId] !== undefined) {
        const next = { ...prev };
        delete next[enchId];
        return next;
      }
      return { ...prev, [enchId]: 1 };
    });
  };

  const changeLevel = (enchId: string, delta: number) => {
    const ench = enchantmentList.find(e => e.id === enchId);
    if (!ench) return;
    setSelectedEnchantments(prev => {
      const current = prev[enchId] || 1;
      const next = Math.max(1, Math.min(ench.maxLevel, current + delta));
      return { ...prev, [enchId]: next };
    });
  };

  const handleBuy = () => {
    if (!weapon) return;
    // Build summary
    const enchSummary = Object.entries(selectedEnchantments)
      .map(([id, level]) => {
        const e = enchantmentList.find(en => en.id === id);
        return e ? `${e.name} ${level}` : "";
      })
      .filter(Boolean)
      .join(", ");
    
    const productName = `Custom ${weapon.name}${enchSummary ? ` (${enchSummary})` : ""}`;
    navigate(`/checkout/custom-weapon?server=${serverParam}&customName=${encodeURIComponent(productName)}&customPrice=${totalPrice}`);
  };

  const selectWeapon = (id: string) => {
    setSelectedWeapon(id);
    setSelectedEnchantments({});
  };

  const activeEnchCount = Object.keys(selectedEnchantments).length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />

      {/* Header */}
      <div className="relative z-10 pt-6 pb-4 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
          </Button>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-20">
        {/* Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-display tracking-wider text-muted-foreground">WEAPON FORGE</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-black mb-3">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              CUSTOM WEAPONS
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Forge your ultimate weapon. Choose enchantments, set levels, and dominate the server!
          </p>
        </motion.div>

        {/* Step 1: Weapon Selection */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">1</span>
            Choose Your Weapon
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {WEAPONS.map((w, i) => (
              <motion.button
                key={w.id}
                onClick={() => selectWeapon(w.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-2xl p-4 text-center transition-all duration-300 border-2 ${
                  selectedWeapon === w.id
                    ? `border-primary bg-primary/10 shadow-[0_0_30px_hsla(320,100%,50%,0.3)]`
                    : "border-border/50 glass hover:border-primary/30"
                }`}
              >
                <motion.div 
                  className="text-4xl mb-2"
                  animate={selectedWeapon === w.id ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {w.icon}
                </motion.div>
                <div className={`font-display font-bold text-sm ${selectedWeapon === w.id ? w.color : "text-foreground"}`}>
                  {w.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">₹{w.basePrice} base</div>
                {selectedWeapon === w.id && (
                  <motion.div
                    layoutId="weapon-check"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Enchantments */}
        <AnimatePresence mode="wait">
          {selectedWeapon && weapon && (
            <motion.div
              key={selectedWeapon}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">2</span>
                Select Enchantments
                <span className="text-xs text-muted-foreground ml-2">
                  (Max level 15 • All enchantments max = ₹{MAX_PRICE})
                </span>
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {enchantmentList.map((ench, i) => {
                  const isActive = selectedEnchantments[ench.id] !== undefined;
                  const level = selectedEnchantments[ench.id] || 0;
                  const enchCost = isActive ? ench.pricePerLevel * level : 0;

                  return (
                    <motion.div
                      key={ench.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-xl p-4 border-2 transition-all duration-300 ${
                        isActive
                          ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_hsla(320,100%,50%,0.15)]"
                          : "border-border/30 glass hover:border-border/60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => toggleEnchantment(ench.id)}
                          className="flex items-center gap-2 flex-1"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
                            isActive ? `bg-gradient-to-br ${weapon.gradient} shadow-lg` : "bg-muted"
                          }`}>
                            {ench.icon}
                          </div>
                          <div className="text-left">
                            <div className={`font-display font-bold text-sm ${isActive ? weapon.color : "text-foreground"}`}>
                              {ench.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ₹{ench.pricePerLevel}/level • Max {ench.maxLevel}
                            </div>
                          </div>
                        </button>

                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                          isActive ? "border-primary bg-primary" : "border-muted-foreground/30"
                        }`} onClick={() => toggleEnchantment(ench.id)}>
                          {isActive && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                        </div>
                      </div>

                      {/* Level Control */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => changeLevel(ench.id, -1)}
                                  disabled={level <= 1}
                                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 disabled:opacity-30 transition-all"
                                >
                                  <Minus className="w-4 h-4" />
                                </motion.button>

                                <div className="w-16 text-center">
                                  <motion.span
                                    key={level}
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className={`font-display font-black text-xl ${weapon.color}`}
                                  >
                                    {level}
                                  </motion.span>
                                  <div className="text-[10px] text-muted-foreground -mt-1">LEVEL</div>
                                </div>

                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => changeLevel(ench.id, 1)}
                                  disabled={level >= ench.maxLevel}
                                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 disabled:opacity-30 transition-all"
                                >
                                  <Plus className="w-4 h-4" />
                                </motion.button>
                              </div>

                              {/* Level bar */}
                              <div className="flex-1 mx-3">
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                  <motion.div
                                    className={`h-full rounded-full bg-gradient-to-r ${weapon.gradient}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(level / ench.maxLevel) * 100}%` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  />
                                </div>
                              </div>

                              <span className="text-xs font-display font-bold text-muted-foreground">
                                +₹{enchCost}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Price Bar */}
        <AnimatePresence>
          {selectedWeapon && weapon && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4"
            >
              <div className="container mx-auto">
                <div className="glass rounded-2xl p-4 border border-primary/30 shadow-[0_-10px_40px_hsla(320,100%,50%,0.2)]">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl`}>{weapon.icon}</div>
                      <div>
                        <div className="font-display font-bold">
                          Custom {weapon.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activeEnchCount} enchantment{activeEnchCount !== 1 ? "s" : ""} selected
                          {serverParam === "lifesteal" ? " • Lifesteal" : " • Gem SMP"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Total Price</div>
                        <motion.div
                          key={totalPrice}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          className={`font-display text-2xl font-black bg-gradient-to-r ${weapon.gradient} bg-clip-text text-transparent`}
                        >
                          ₹{totalPrice}
                        </motion.div>
                      </div>
                      <Button
                        variant="gaming"
                        size="lg"
                        onClick={handleBuy}
                        disabled={activeEnchCount === 0}
                        className="min-w-[140px]"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomWeapon;
