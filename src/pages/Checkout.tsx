import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Crown, Star, Flame, Skull, Sparkles, Gem, Check, Zap, Shield, Clock, ChevronDown, Package, Gift, Key, Upload, Loader2, CheckCircle, Coins, MapPin, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Rank images
import spicyRank from "@/assets/ranks/spicy_rank.png";
import proRank from "@/assets/ranks/pro_rank.png";
import eliteRank from "@/assets/ranks/elite_rank.png";
import legendRank from "@/assets/ranks/legend_rank.png";
import deadliestRank from "@/assets/ranks/deadliest_rank.png";
import immortalRank from "@/assets/ranks/immortal_rank.png";
import supremeRank from "@/assets/ranks/supreme_rank.png";
import paymentQR from "@/assets/payment-qr.png";

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1459835220290441345/25r77rdGny-cj81NCY1ivV5l8C5Z78f9MswpNtg6l9peOEpr-EF55Is7cmTiAAEUfFht";


type ProductType = "rank" | "key" | "currency";

interface RankProduct {
  type: "rank";
  name: string;
  description: string;
  kitName: string;
  image: string;
  tier: string;
  isCustomRank?: boolean;
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

interface CurrencyProduct {
  type: "currency";
  name: string;
  description: string;
  ratePerUnit: number; // Rs per 1 unit
  unit: string;
  minQuantity: number;
  qrLink: string;
}

type Product = RankProduct | KeyProduct | CurrencyProduct;

const products: Record<string, Product> = {
  // Ranks - ordered by price (ascending)
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
    perks: ["/Kit", "/Fly", "/Withdraw", "2 Home Slots", "2 Auction Slots", "Priority Support"],
    kitItems: ["Diamond Sword", "Diamond Pickaxe", "Diamond Axe", "Diamond Shovel", "Water Bucket", "Iron Block x2", "Diamond Helmet (Protection IV, Unbreaking III, Mending)", "Diamond Chestplate (Protection IV, Unbreaking III, Mending)", "Diamond Leggings", "Diamond Boots", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/pro.html",
  },
  elite: {
    type: "rank",
    name: "ELITE RANK",
    description: "Step up your game with backpack access, more homes, and premium perks.",
    kitName: "ELITE Kit",
    image: eliteRank,
    tier: "elite",
    durations: [
      { days: 30, price: 55 },
      { days: 60, price: 100 },
    ],
    perks: ["/Kit", "/Backpack", "/Fly", "/Withdraw", "4 Home Slots", "4 Auction Slots"],
    kitItems: ["Diamond Sword", "Diamond Pickaxe", "Diamond Axe", "Diamond Shovel", "Diamond Hoe", "Milk Bucket", "Iron Block", "Bed", "Diamond Helmet (Protection V, Unbreaking V, Mending)", "Diamond Chestplate (Protection V, Unbreaking V, Mending)", "Diamond Leggings", "Diamond Boots", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/elite.html",
  },
  legend: {
    type: "rank",
    name: "LEGEND RANK",
    description: "Become a legend on the server with exclusive kit and priority access.",
    kitName: "LEGEND Kit",
    image: legendRank,
    tier: "legend",
    durations: [
      { days: 30, price: 80 },
      { days: 60, price: 150 },
    ],
    perks: ["/Kit", "/Backpack", "/Fly", "/Withdraw", "6 Home Slots", "6 Auction Slots"],
    kitItems: ["Diamond Sword", "Diamond Pickaxe", "Diamond Axe", "Golden Apple x32", "Golden Block x2", "Ladder", "Diamond Helmet (Protection VI, Thorns III, Unbreaking VI, Mending)", "Diamond Chestplate (Protection VI, Thorns III, Unbreaking VI, Mending)", "Diamond Leggings", "Diamond Boots", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/legend.html",
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
    perks: ["/Kit", "/Backpack", "/Fly", "/Withdraw", "8 Home Slots", "8 Auction Slots"],
    kitItems: ["Diamond Sword", "Diamond Pickaxe", "Diamond Axe", "Slime Block x2", "Ladder", "Diamond Helmet (Protection VII, Unbreaking VII, Mending VII)", "Diamond Chestplate (Protection VII, Unbreaking VII, Mending VII)", "Diamond Leggings", "Diamond Boots", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/immortal.html",
  },
  deadliest: {
    type: "rank",
    name: "DEADLIEST RANK",
    description: "Unleash your true combat potential with Bolt Armor Trim and Redstone upgrades.",
    kitName: "DEADLIEST Kit",
    image: deadliestRank,
    tier: "deadliest",
    durations: [
      { days: 30, price: 150 },
      { days: 60, price: 280 },
    ],
    perks: ["/Kit", "/Backpack", "/Fly", "/Withdraw", "10 Home Slots", "10 Auction Slots"],
    kitItems: ["Diamond Sword", "Diamond Pickaxe", "Diamond Axe", "Shulker Box", "Potion x4", "Diamond Helmet (Bolt Armor Trim, Protection VIII, Fire Protection VIII, Respiration VIII, Unbreaking VIII, Mending VIII)", "Diamond Chestplate (Bolt Armor Trim, Redstone Material, Protection VIII, Fire Protection VIII, Respiration VIII, Unbreaking VIII, Mending VIII)", "Diamond Leggings", "Diamond Boots", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/deadliest.html",
  },
  supreme: {
    type: "rank",
    name: "SUPREME RANK",
    description: "The ultimate status. Dominate with maximum slots and Silence Armor Trim.",
    kitName: "SUPREME Kit",
    image: supremeRank,
    tier: "supreme",
    durations: [
      { days: 30, price: 200 },
      { days: 60, price: 380 },
    ],
    perks: ["/Kit", "/Backpack", "/Fly", "/Withdraw", "15 Home Slots", "15 Auction Slots"],
    kitItems: ["Diamond Sword", "Diamond Pickaxe", "Diamond Axe", "Diamond Shovel", "Diamond Hoe", "Potion", "Shulker Box", "Bed", "Ladder", "Diamond Helmet (Silence Armor Trim, Amethyst Material, Protection IX, Fire Protection IX, Unbreaking IX, Mending IX)", "Diamond Chestplate (Silence Armor Trim, Amethyst Material, Protection IX, Fire Protection IX, Unbreaking IX, Mending IX)", "Diamond Leggings", "Diamond Boots", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/supreme.html",
  },
  spicy: {
    type: "rank",
    name: "SPICY RANK",
    description: "The ultimate signature rank! Silence Armor Trim with Emerald Material and max enchants.",
    kitName: "SPICY Kit",
    image: spicyRank,
    tier: "spicy",
    durations: [
      { days: 30, price: 250 },
      { days: 60, price: 450 },
    ],
    perks: ["/Kit", "/Backpack", "/Fly", "/Withdraw", "Unlimited Home Slots", "Unlimited Auction Slots", "VIP Priority"],
    kitItems: ["Diamond Pickaxe", "Diamond Shovel", "Diamond Axe", "Diamond Hoe", "Fire Resistance Potion", "Milk Bucket", "Bed", "Red Wool", "Diamond Helmet (Silence Armor Trim, Emerald Material, Protection X, Fire Protection X, Unbreaking X, Mending X)", "Diamond Chestplate (Silence Armor Trim, Emerald Material, Protection X, Fire Protection X, Unbreaking X, Mending X)", "Diamond Leggings", "Diamond Boots", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/spicy.html",
  },
  custom: {
    type: "rank",
    name: "CUSTOM RANK",
    description: "Create your own identity! Choose your own rank name with SPICY Kit perks + 2000 Claim Blocks bonus.",
    kitName: "CUSTOM Kit",
    image: spicyRank,
    tier: "custom",
    isCustomRank: true,
    durations: [
      { days: 30, price: 300 },
      { days: 60, price: 550 },
    ],
    perks: ["/Kit", "/Backpack", "/Fly", "/Withdraw", "Unlimited Home Slots", "Unlimited Auction Slots", "VIP Priority", "2000 Claim Blocks", "Custom Rank Name"],
    kitItems: ["Diamond Pickaxe", "Diamond Shovel", "Diamond Axe", "Diamond Hoe", "Fire Resistance Potion", "Milk Bucket", "Bed", "Red Wool", "Diamond Helmet (Silence Armor Trim, Emerald Material, Protection X, Fire Protection X, Unbreaking X, Mending X)", "Diamond Chestplate (Silence Armor Trim, Emerald Material, Protection X, Fire Protection X, Unbreaking X, Mending X)", "Diamond Leggings", "Diamond Boots", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/custom.html",
  },
  // Keys - ordered by price (ascending)
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
    description: "Colorful candles and party decorations for celebrations!",
    price: 5,
    isFree: false,
    rewards: ["Feather", "Pink Candle", "Green Candle", "Yellow Candle", "Red Candle", "Blue Candle", "Purple Candle"],
    qrLink: "https://spicysmp.dpdns.org/party_key.html",
  },
  "apple-key": {
    type: "key",
    name: "Apple Key",
    description: "Netherite gear with high enchantments and spawners.",
    price: 10,
    isFree: false,
    rewards: ["Netherite Sword", "Netherite Axe", "Netherite Pickaxe", "Netherite Shovel", "Golden Apple", "Spawner x2", "Netherite Helmet", "Netherite Chestplate", "Netherite Leggings", "Netherite Boots", "Gold Coin", "Feather"],
    qrLink: "https://spicysmp.dpdns.org/APPLE_key.html",
  },
  "banana-key": {
    type: "key",
    name: "Banana Key",
    description: "Full Netherite kit with high-level enchantments and spawners.",
    price: 15,
    isFree: false,
    rewards: ["Netherite Sword", "Netherite Axe", "Netherite Pickaxe", "Netherite Shovel", "Netherite Hoe", "Golden Apple", "Spawner x3", "Netherite Helmet", "Netherite Chestplate", "Netherite Leggings", "Netherite Boots", "Gold Coin", "Feather"],
    qrLink: "https://spicysmp.dpdns.org/banana_key.html",
  },
  "blood-key": {
    type: "key",
    name: "Blood Key",
    description: "Powerful Netherite kit with Notch Apples and spawners.",
    price: 20,
    isFree: false,
    rewards: ["Netherite Sword", "Netherite Axe", "Netherite Pickaxe", "Spawner x2 (10-12)", "Golden Apple x2", "Netherite Helmet", "Netherite Chestplate", "Netherite Leggings", "Netherite Boots", "Gold Coin", "Feather", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/BLOOD_key.html",
  },
  "blue-key": {
    type: "key",
    name: "Blue Key",
    description: "High-value Netherite kit with extreme enchantments and spawners.",
    price: 25,
    isFree: false,
    rewards: ["Netherite Helmet", "Netherite Chestplate", "Netherite Leggings", "Netherite Boots", "Netherite Sword", "Netherite Axe", "Netherite Pickaxe", "Netherite Shovel", "Golden Apple (64)", "Notch Apple x2", "Spawner x3 (30)", "Gold Coin", "Feather", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/BLUE_key.html",
  },
  "purple-key": {
    type: "key",
    name: "Purple Key",
    description: "The ultimate key with Mace weapon, max enchants and spawners.",
    price: 30,
    isFree: false,
    rewards: ["Notch Apple (64)", "Spawner x3 (20-30)", "Gold Coin", "Netherite Helmet", "Netherite Chestplate", "Netherite Leggings", "Netherite Boots", "Mace", "Netherite Sword", "Netherite Axe", "Netherite Pickaxe", "Netherite Hoe", "Netherite Shovel", "Feather", "Fishing Rod"],
    qrLink: "https://spicysmp.dpdns.org/purple_key.html",
  },
  // Lifesteal Keys
  "core-key": {
    type: "key",
    name: "Core Key",
    description: "Essential Lifesteal gear with balanced enchantments and hearts.",
    price: 10,
    isFree: false,
    rewards: ["Diamond Sword", "Diamond Armor Set", "Golden Apples x16", "Hearts x2", "Spawner"],
    qrLink: "https://spicysmp.dpdns.org/core_key.html",
  },
  "flux-key": {
    type: "key",
    name: "Flux Key",
    description: "Advanced Lifesteal kit with powerful enchantments and extra hearts.",
    price: 20,
    isFree: false,
    rewards: ["Netherite Sword", "Netherite Armor Set", "Golden Apples x32", "Hearts x4", "Spawner x2", "Notch Apple"],
    qrLink: "https://spicysmp.dpdns.org/flux_key.html",
  },
  "aura-key": {
    type: "key",
    name: "Aura Key",
    description: "Ultimate Lifesteal crate with max enchantments, hearts and rare items.",
    price: 30,
    isFree: false,
    rewards: ["Netherite Sword (Max Enchant)", "Netherite Armor Set (Max Enchant)", "Notch Apple x64", "Hearts x6", "Spawner x3", "Mace", "Gold Coin"],
    qrLink: "https://spicysmp.dpdns.org/aura_key.html",
  },
  // Currency products
  coins: {
    type: "currency",
    name: "In-Game Coins",
    description: "Buy coins to use in the server economy. Trade, purchase items from shops, and more!",
    ratePerUnit: 2, // ₹2 = 1 coin
    unit: "coins",
    minQuantity: 100,
    qrLink: "https://spicysmp.dpdns.org/coins.html",
  },
  claimblocks: {
    type: "currency",
    name: "Claim Blocks",
    description: "Protect your builds! Claim blocks let you expand your protected territory on the server.",
    ratePerUnit: 1, // ₹1 = 1 claim block
    unit: "blocks",
    minQuantity: 100,
    qrLink: "https://spicysmp.dpdns.org/claimblocks.html",
  },
};

const tierConfig: Record<string, { icon: typeof Star; gradient: string; bgGradient: string; glow: string; accent: string }> = {
  spicy: {
    icon: Flame,
    gradient: "from-orange-500 to-red-600",
    bgGradient: "from-orange-500/20 to-red-600/20",
    glow: "0 0 80px hsla(20, 100%, 50%, 0.5)",
    accent: "text-orange-400",
  },
  custom: {
    icon: Sparkles,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-500/20 to-teal-600/20",
    glow: "0 0 80px hsla(160, 100%, 50%, 0.5)",
    accent: "text-emerald-400",
  },
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
  const [keyQuantity, setKeyQuantity] = useState(1);
  const [currencyQuantity, setCurrencyQuantity] = useState(100);
  const [showKitItems, setShowKitItems] = useState(false);
  const [selectedServer, setSelectedServer] = useState<"survival" | "lifesteal">("survival");
  
  // Form states
  const [minecraftUsername, setMinecraftUsername] = useState("");
  const [customRankName, setCustomRankName] = useState("");
  const [transferId, setTransferId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_percent: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const product = productId ? products[productId] : null;
  
  const isCustomRank = product?.type === "rank" && (product as RankProduct).isCustomRank;
  const isCurrency = product?.type === "currency";
  const isRank = product?.type === "rank";
  const isKey = product?.type === "key";
  
  // Spicy & Custom ranks are Survival only, lifesteal keys are Lifesteal only
  const lifestealKeyIds = ["core-key", "flux-key", "aura-key"];
  const isSurvivalOnly = (isRank && ((product as RankProduct).tier === "spicy" || (product as RankProduct).tier === "custom"));
  const isLifestealOnly = productId ? lifestealKeyIds.includes(productId) : false;
  const showServerSelector = !isSurvivalOnly && !isLifestealOnly && !isCurrency && !isKey;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Set initial currency quantity based on min quantity
    if (product?.type === "currency") {
      setCurrencyQuantity((product as CurrencyProduct).minQuantity);
    }
  }, [product]);

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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("code, discount_percent, expires_at, usage_limit, used_count")
        .eq("code", couponCode.toUpperCase().trim())
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Coupon error:", error);
        setCouponError("Failed to validate coupon. Please try again.");
        return;
      }

      if (!data) {
        setCouponError("Invalid coupon code");
        return;
      }

      // Check if coupon is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setCouponError("This coupon has expired");
        return;
      }

      // Check usage limit
      if (data.usage_limit && data.used_count >= data.usage_limit) {
        setCouponError("This coupon has reached its usage limit");
        return;
      }

      setAppliedCoupon({ code: data.code, discount_percent: data.discount_percent });
      setCouponCode("");
      toast.success(`Coupon applied! ${data.discount_percent}% OFF`);
    } catch (err) {
      console.error("Coupon error:", err);
      setCouponError("Something went wrong. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    toast.info("Coupon removed");
  };

  const handleSubmit = async () => {
    if (!minecraftUsername.trim()) {
      toast.error("Please enter your Minecraft username");
      return;
    }
    if (isCustomRank && !customRankName.trim()) {
      toast.error("Please enter your custom rank name");
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
      const isCurrencyProduct = product?.type === "currency";
      const isKeyProduct = product?.type === "key";
      
      let price = 0;
      let quantity: number | string = 1;
      let duration = "N/A";
      
      if (isRankProduct) {
        price = (product as RankProduct).durations[selectedDuration].price;
        duration = `${(product as RankProduct).durations[selectedDuration].days} Days`;
      } else if (isKeyProduct) {
        price = (product as KeyProduct).price * keyQuantity;
        quantity = keyQuantity;
      } else if (isCurrencyProduct) {
        price = currencyQuantity * (product as CurrencyProduct).ratePerUnit;
        quantity = `${currencyQuantity} ${(product as CurrencyProduct).unit}`;
      }
      
      // Apply site discount if active
      if (isDiscountActive) {
        price = Math.round(price * 0.9);
      }
      
      // Apply coupon discount if present
      if (appliedCoupon) {
        price = Math.round(price * (1 - appliedCoupon.discount_percent / 100));
      }

      const embedFields = [
        { name: "📦 Product", value: product?.name || "Unknown", inline: true },
        { name: "🔢 Quantity", value: `${quantity}`, inline: true },
        { name: "💰 Final Price", value: `₹${price}`, inline: true },
        { name: "⏱️ Duration", value: duration, inline: true },
        { name: "🎯 Minecraft Username", value: minecraftUsername, inline: true },
        { name: "🔢 Transfer ID", value: transferId, inline: true },
        { name: "🖥️ Server", value: isSurvivalOnly ? "Survival" : isLifestealOnly ? "Lifesteal" : selectedServer.charAt(0).toUpperCase() + selectedServer.slice(1), inline: true },
      ];
      
      // Add discount info
      if (isDiscountActive) {
        embedFields.push({ name: "🎉 Site Discount", value: "10% OFF", inline: true });
      }
      
      // Add coupon info if applied
      if (appliedCoupon) {
        embedFields.push({ name: "🎟️ Coupon Applied", value: `${appliedCoupon.code} (${appliedCoupon.discount_percent}% OFF)`, inline: true });
      }
      
      // Add custom rank name field if applicable
      if (isCustomRank && customRankName.trim()) {
        embedFields.push({ name: "✨ Custom Rank Name", value: customRankName, inline: true });
      }

      const webhookUrl = DISCORD_WEBHOOK_URL;

      const embedPayload = {
        embeds: [{
          title: "🎮 New Purchase Request!",
          color: isCustomRank ? 0x10b981 : 0x00ff00,
          fields: embedFields,
          timestamp: new Date().toISOString(),
          footer: { text: "SPICY NETWORK Store" }
        }]
      };

      // First send the embed message
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embedPayload),
      });

      // Then send the screenshot as a file
      formData.append("file", screenshot, screenshot.name);
      formData.append("payload_json", JSON.stringify({
        content: `📸 Payment Screenshot for **${minecraftUsername}** (Transfer ID: ${transferId})`
      }));

      await fetch(webhookUrl, {
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

  // Currency-specific config
  const currencyConfig: Record<string, { icon: typeof Coins; gradient: string; bgGradient: string; glow: string; accent: string }> = {
    coins: {
      icon: Coins,
      gradient: "from-yellow-500 to-amber-600",
      bgGradient: "from-yellow-500/20 to-amber-600/20",
      glow: "0 0 60px hsla(45, 100%, 50%, 0.4)",
      accent: "text-yellow-400",
    },
    claimblocks: {
      icon: MapPin,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/20 to-emerald-600/20",
      glow: "0 0 60px hsla(140, 100%, 50%, 0.4)",
      accent: "text-green-400",
    },
  };

  const config = isRank ? tierConfig[(product as RankProduct).tier] : isCurrency && productId ? currencyConfig[productId] : null;
  const Icon = config?.icon || (isCurrency ? (productId === "coins" ? Coins : MapPin) : Key);
  const gradient = config?.gradient || (isKey && (product as KeyProduct).isFree ? "from-accent to-cyan-400" : "from-secondary to-amber-400");
  const bgGradient = config?.bgGradient || (isKey && (product as KeyProduct).isFree ? "from-accent/20 to-cyan-400/20" : "from-secondary/20 to-amber-400/20");
  const glow = config?.glow || (isKey && (product as KeyProduct).isFree ? "0 0 80px hsla(185, 100%, 50%, 0.3)" : "0 0 80px hsla(45, 100%, 50%, 0.3)");
  const accent = config?.accent || (isKey && (product as KeyProduct).isFree ? "text-accent" : "text-secondary");

  // Discount configuration - 10% off until Jan 20, 2026
  const discountEndDate = new Date('2026-01-20T23:59:59');
  const isDiscountActive = new Date() <= discountEndDate;
  const siteDiscountPercent = 10;

  // Calculate prices based on product type
  let originalPrice = 0;
  if (isRank) {
    originalPrice = (product as RankProduct).durations[selectedDuration].price;
  } else if (isKey) {
    originalPrice = (product as KeyProduct).price * keyQuantity;
  } else if (isCurrency) {
    originalPrice = currencyQuantity * (product as CurrencyProduct).ratePerUnit;
  }
  
  // Apply site-wide discount first
  const afterSiteDiscount = isDiscountActive ? Math.round(originalPrice * (1 - siteDiscountPercent / 100)) : originalPrice;
  
  // Then apply coupon discount on top
  const couponDiscountAmount = appliedCoupon ? Math.round(afterSiteDiscount * (appliedCoupon.discount_percent / 100)) : 0;
  const currentPrice = afterSiteDiscount - couponDiscountAmount;
  const totalSavings = originalPrice - currentPrice;

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
                ) : isCurrency ? (
                  <div className={`w-full aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Icon className="w-24 h-24 text-white" />
                    </motion.div>
                  </div>
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
                    {isRank ? (product as RankProduct).tier.toUpperCase() : isCurrency ? "CURRENCY" : (product as KeyProduct).isFree ? "FREE" : "PREMIUM"}
                  </span>
                </div>
              </div>

              {/* Title and description */}
              <h1 className={`font-display text-3xl md:text-4xl font-black mb-3 ${accent}`}>
                {product.name}
              </h1>
              <p className="text-muted-foreground mb-6">{product.description}</p>

              {/* Perks/Rewards - Only show for ranks and keys */}
              {(isRank || isKey) && (
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
              )}

              {/* Currency info */}
              {isCurrency && (
                <div className="space-y-3 mb-6">
                  <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                    What You Get
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <motion.div
                      className="flex items-center gap-2 p-3 rounded-lg glass border border-border/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Check className={`w-4 h-4 ${accent} flex-shrink-0`} />
                      <span className="text-sm text-foreground">
                        Rate: ₹{(product as CurrencyProduct).ratePerUnit} = 1 {(product as CurrencyProduct).unit.slice(0, -1)}
                      </span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2 p-3 rounded-lg glass border border-border/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <Check className={`w-4 h-4 ${accent} flex-shrink-0`} />
                      <span className="text-sm text-foreground">Minimum: {(product as CurrencyProduct).minQuantity} {(product as CurrencyProduct).unit}</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2 p-3 rounded-lg glass border border-border/50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Check className={`w-4 h-4 ${accent} flex-shrink-0`} />
                      <span className="text-sm text-foreground">Buy any amount you want!</span>
                    </motion.div>
                  </div>
                </div>
              )}

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
                {/* Discount Banner */}
                {isDiscountActive && !(product as KeyProduct).isFree && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-white font-display text-sm font-bold">
                      🎉 10% OFF - Valid till 20 January!
                    </span>
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Card header */}
                <div className={`p-6 bg-gradient-to-r ${gradient}`}>
                  <h2 className="font-display text-xl font-bold text-white mb-1">Complete Purchase</h2>
                  <p className="text-white/80 text-sm">Secure payment via UPI/QR Code</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Server selector */}
                  {showServerSelector && (
                    <div>
                      <label className="block text-sm font-display text-muted-foreground mb-3">
                        Choose Server:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["survival", "lifesteal"] as const).map((server) => (
                          <button
                            key={server}
                            onClick={() => setSelectedServer(server)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              selectedServer === server
                                ? `border-transparent bg-gradient-to-r ${server === "survival" ? "from-green-500 to-emerald-600" : "from-red-500 to-rose-600"} text-white`
                                : "border-border/50 bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className="font-display font-bold capitalize">{server === "survival" ? "⛏️ Survival" : "❤️ Lifesteal"}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Survival only badge */}
                  {isSurvivalOnly && (
                    <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <span className="text-sm font-display text-green-400">⛏️ Survival Server Only</span>
                    </div>
                  )}

                  {/* Lifesteal only badge */}
                  {isLifestealOnly && (
                    <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <span className="text-sm font-display text-red-400">❤️ Lifesteal Server Only</span>
                    </div>
                  )}

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
                              {isDiscountActive ? (
                                <span>
                                  <span className="line-through text-xs mr-1">₹{duration.price}</span>
                                  <span className="text-green-400">₹{Math.round(duration.price * 0.9)}</span>
                                </span>
                              ) : (
                                `₹${duration.price}`
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity selector (keys only) */}
                  {!isRank && !(product as KeyProduct).isFree && (
                    <div>
                      <label className="block text-sm font-display text-muted-foreground mb-3">
                        Select Quantity:
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((qty) => (
                          <button
                            key={qty}
                            onClick={() => setKeyQuantity(qty)}
                            className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                              keyQuantity === qty
                                ? `border-transparent bg-gradient-to-r ${gradient} text-white`
                                : "border-border/50 bg-card hover:border-primary/50"
                            }`}
                          >
                            <div className="font-display font-bold text-lg">{qty}x</div>
                            <div className={`text-xs ${keyQuantity === qty ? "text-white/80" : "text-muted-foreground"}`}>
                              {isDiscountActive ? (
                                <span>
                                  <span className="line-through mr-1">₹{(product as KeyProduct).price * qty}</span>
                                  <span className="text-green-400">₹{Math.round((product as KeyProduct).price * qty * 0.9)}</span>
                                </span>
                              ) : (
                                `₹${(product as KeyProduct).price * qty}`
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Currency quantity input */}
                  {isCurrency && (
                    <div>
                      <label className="block text-sm font-display text-muted-foreground mb-3">
                        Enter Amount ({(product as CurrencyProduct).unit}):
                      </label>
                      <div className="space-y-3">
                        <div className="relative">
                          <Input
                            type="number"
                            min={(product as CurrencyProduct).minQuantity}
                            value={currencyQuantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || (product as CurrencyProduct).minQuantity;
                              setCurrencyQuantity(Math.max(val, (product as CurrencyProduct).minQuantity));
                            }}
                            className="bg-background/50 border-border/50 text-lg font-display text-center"
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[100, 500, 1000, 2000].map((amount) => (
                            <button
                              key={amount}
                              onClick={() => setCurrencyQuantity(amount)}
                              className={`p-2 rounded-lg border-2 transition-all duration-300 text-sm font-display ${
                                currencyQuantity === amount
                                  ? `border-transparent bg-gradient-to-r ${gradient} text-white`
                                  : "border-border/50 bg-card hover:border-primary/50 text-muted-foreground"
                              }`}
                            >
                              {amount}
                            </button>
                          ))}
                        </div>
                        <div className="p-3 rounded-lg glass border border-border/50 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Rate: ₹{(product as CurrencyProduct).ratePerUnit} = 1 {(product as CurrencyProduct).unit.slice(0, -1)}</p>
                          <p className="text-sm font-display">
                            <span className="text-muted-foreground">You get: </span>
                            <span className={accent}>{currencyQuantity} {(product as CurrencyProduct).unit}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Coupon Code Input */}
                  {!(isKey && (product as KeyProduct).isFree) && (
                    <div className="space-y-3">
                      <label className="block text-sm font-display text-muted-foreground">
                        <Tag className="w-4 h-4 inline mr-1" />
                        Have a Coupon Code?
                      </label>
                      
                      {appliedCoupon ? (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/30"
                        >
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-accent" />
                            <span className="font-display font-bold text-accent">{appliedCoupon.code}</span>
                            <span className="text-xs text-muted-foreground">({appliedCoupon.discount_percent}% OFF)</span>
                          </div>
                          <button
                            onClick={removeCoupon}
                            className="p-1 hover:bg-destructive/20 rounded text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              setCouponError(null);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                            className="bg-background/50 border-border/50 uppercase"
                          />
                          <Button
                            variant="outline"
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon}
                            className="shrink-0"
                          >
                            {isApplyingCoupon ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Apply"
                            )}
                          </Button>
                        </div>
                      )}
                      
                      {couponError && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-destructive"
                        >
                          {couponError}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* QR Code Display */}
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-white rounded-xl mb-3">
                      <img 
                        src={paymentQR} 
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
                    {isKey && (product as KeyProduct).isFree ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`font-display text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                      >
                        FREE
                      </motion.div>
                    ) : (
                      <div className="space-y-1">
                        {(isDiscountActive || appliedCoupon) && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-muted-foreground line-through text-lg"
                          >
                            ₹{originalPrice}
                          </motion.div>
                        )}
                        <motion.div
                          key={currentPrice}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`font-display text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                        >
                          ₹{currentPrice}
                        </motion.div>
                        
                        {/* Discount breakdown */}
                        <div className="space-y-1 mt-2">
                          {isDiscountActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs font-display font-bold rounded mr-1"
                            >
                              🎉 10% Site Discount
                            </motion.div>
                          )}
                          {appliedCoupon && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="inline-block px-2 py-1 bg-accent/20 text-accent text-xs font-display font-bold rounded"
                            >
                              🎟️ {appliedCoupon.code}: {appliedCoupon.discount_percent}% OFF
                            </motion.div>
                          )}
                        </div>
                        
                        {totalSavings > 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-block px-2 py-1 bg-destructive/20 text-destructive text-xs font-display font-bold rounded mt-2"
                          >
                            You save ₹{totalSavings}!
                          </motion.div>
                        )}
                        {isCurrency && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-muted-foreground mt-2"
                          >
                            for {currencyQuantity} {(product as CurrencyProduct).unit}
                          </motion.div>
                        )}
                      </div>
                    )}
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

                        {/* Custom Rank Name Field */}
                        {isCustomRank && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="overflow-hidden"
                          >
                            <label className="block text-sm font-display text-muted-foreground mb-2">
                              Your Custom Rank Name *
                            </label>
                            <Input
                              placeholder="Choose your rank name (e.g., DRAGON, WARRIOR, NINJA)"
                              value={customRankName}
                              onChange={(e) => setCustomRankName(e.target.value.toUpperCase())}
                              className="bg-background/50 border-border/50"
                              maxLength={15}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              This will be displayed as your rank in-game! Max 15 characters.
                            </p>
                          </motion.div>
                        )}

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
