import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Gift, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ParticleBackground from "@/components/ParticleBackground";

interface WheelItem {
  id: string;
  name: string;
  description: string;
  value_label: string;
  weight: number;
  color: string;
}

const WHEEL_COLORS = [
  "#ff0066", "#ffaa00", "#00ccff", "#aa00ff", "#00ff88",
  "#ff4400", "#ff00aa", "#00aaff", "#ffcc00", "#ff6600",
  "#cc00ff", "#00ffcc",
];

const LuckyWheel = () => {
  const [items, setItems] = useState<WheelItem[]>([]);
  const [spinCode, setSpinCode] = useState("");
  const [username, setUsername] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonItem, setWonItem] = useState<WheelItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase.from("wheel_items").select("*").eq("is_active", true);
      if (data && data.length > 0) {
        setItems(data as WheelItem[]);
      }
    };
    fetchItems();
  }, []);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;

    const ctx = canvas.getContext("2d")!;
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;
    const sliceAngle = (2 * Math.PI) / items.length;

    ctx.clearRect(0, 0, size, size);

    // Draw slices
    items.forEach((item, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      const color = item.color || WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fillStyle = color;
      ctx.fill();

      // Border
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.max(10, Math.min(14, 200 / items.length))}px 'Orbitron', sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;

      const text = item.name.length > 12 ? item.name.substring(0, 11) + "…" : item.name;
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();
    ctx.strokeStyle = "#ff00aa";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px 'Orbitron', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", center, center);
  }, [items]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const spin = async () => {
    if (!spinCode.trim()) {
      toast.error("Spin code daalo pehle!");
      return;
    }
    if (!username.trim()) {
      toast.error("Minecraft username daalo!");
      return;
    }
    if (items.length === 0) {
      toast.error("Wheel items load nahi hue!");
      return;
    }

    setIsSpinning(true);
    setShowResult(false);
    setWonItem(null);

    try {
      const res = await supabase.functions.invoke("wheel-spin", {
        body: { code: spinCode.trim(), username: username.trim() },
      });

      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);

      const { won_item_id } = res.data;
      const wonIndex = items.findIndex(i => i.id === won_item_id);
      if (wonIndex === -1) throw new Error("Item not found");

      const sliceAngle = 360 / items.length;
      // Target: the won item's slice center. Canvas draws from 3 o'clock, pointer is at top (270deg offset)
      const targetAngle = 360 - (wonIndex * sliceAngle + sliceAngle / 2);
      const spins = 5 + Math.floor(Math.random() * 5); // 5-9 full spins
      const finalRotation = rotation + spins * 360 + targetAngle - (rotation % 360);

      setRotation(finalRotation);

      // Wait for animation
      setTimeout(() => {
        setWonItem(items[wonIndex]);
        setShowResult(true);
        setIsSpinning(false);
        setSpinCode("");
      }, 5000);
    } catch (e: any) {
      toast.error(e.message || "Spin failed!");
      setIsSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />

      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Gift className="w-4 h-4 text-primary" />
            LUCKY WHEEL
            <Gift className="w-4 h-4 text-secondary" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-display font-black mb-4">
            <span className="gradient-text-hero text-glow-primary">LUCKY WHEEL 🎡</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            ₹50 pay karo, spin code lo admin se, aur wheel ghuma ke jeeto amazing prizes! 🎁
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Wheel */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -mt-2">
              <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-primary drop-shadow-[0_0_10px_hsla(320,100%,50%,0.8)]" />
            </div>

            {/* Glow behind wheel */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-[340px] h-[340px] rounded-full blur-[60px] opacity-30"
                style={{ background: "radial-gradient(circle, hsl(320 100% 50%), hsl(45 100% 50%), transparent)" }}
              />
            </div>

            <div
              className="relative"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
              }}
            >
              <canvas
                ref={canvasRef}
                width={340}
                height={340}
                className="rounded-full"
                style={{
                  filter: "drop-shadow(0 0 20px hsla(320, 100%, 50%, 0.4))",
                }}
              />
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* How it works */}
            <div className="glass rounded-2xl p-6 border border-border/50">
              <h3 className="font-display text-lg font-bold gradient-text mb-4">KAISE KHELEIN? 🤔</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">1</span>
                  <p>₹50 pay karo (Payment QR Discord pe hai)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">2</span>
                  <p>Admin se spin code lo Discord pe</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">3</span>
                  <p>Code aur username enter karo</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">4</span>
                  <p>Wheel spin karo aur jeeto! 🎉</p>
                </div>
              </div>
            </div>

            {/* Input form */}
            <div className="glass rounded-2xl p-6 border border-primary/30">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-display tracking-wider">MINECRAFT USERNAME</label>
                  <Input
                    placeholder="Tumhara username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-card border-border/50"
                    disabled={isSpinning}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-display tracking-wider">SPIN CODE</label>
                  <Input
                    placeholder="Admin se mila code..."
                    value={spinCode}
                    onChange={(e) => setSpinCode(e.target.value)}
                    className="bg-card border-border/50"
                    disabled={isSpinning}
                  />
                </div>
                <Button
                  onClick={spin}
                  disabled={isSpinning || items.length === 0}
                  className="w-full font-display text-lg py-6"
                  variant="default"
                >
                  {isSpinning ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> SPINNING...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" /> SPIN THE WHEEL! 🎡
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Items count */}
            <div className="text-center text-sm text-muted-foreground">
              <Star className="w-4 h-4 inline mr-1 text-secondary" />
              {items.length} prizes available • ₹5 se ₹300+ tak!
            </div>
          </motion.div>
        </div>

        {/* Result modal */}
        <AnimatePresence>
          {showResult && wonItem && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResult(false)}
            >
              <motion.div
                className="glass rounded-3xl p-8 max-w-md w-full mx-4 border border-primary/50 text-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  boxShadow: "0 0 80px hsla(320, 100%, 50%, 0.3), 0 0 120px hsla(45, 100%, 50%, 0.15)",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="font-display text-2xl font-black gradient-text mb-2">
                  CONGRATULATIONS!
                </h2>
                <p className="text-muted-foreground mb-6">Tumne jeeta hai:</p>
                <div
                  className="rounded-2xl p-6 mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${wonItem.color}33, ${wonItem.color}11)`,
                    border: `2px solid ${wonItem.color}`,
                  }}
                >
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    {wonItem.name}
                  </h3>
                  {wonItem.value_label && (
                    <p className="text-sm text-muted-foreground">{wonItem.value_label}</p>
                  )}
                  {wonItem.description && (
                    <p className="text-xs text-muted-foreground mt-2">{wonItem.description}</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Result Discord pe bhi bhej diya gaya hai! Admin tumhe item dega. 🎁
                </p>
                <Button onClick={() => setShowResult(false)} className="w-full font-display">
                  AWESOME! ✨
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LuckyWheel;
