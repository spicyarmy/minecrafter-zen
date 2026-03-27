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

const LuckyWheel = () => {
  const [items, setItems] = useState<WheelItem[]>([]);
  const [spinCode, setSpinCode] = useState("");
  const [username, setUsername] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonItem, setWonItem] = useState<WheelItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase.from("wheel_items").select("*").eq("is_active", true);
      if (data && data.length > 0) {
        setItems(data as WheelItem[]);
      }
    };
    fetchItems();
  }, []);

  const spin = async () => {
    if (!spinCode.trim()) { toast.error("Spin code daalo pehle!"); return; }
    if (!username.trim()) { toast.error("Minecraft username daalo!"); return; }
    if (items.length === 0) { toast.error("Wheel items load nahi hue!"); return; }

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
      const targetAngle = 360 - (wonIndex * sliceAngle + sliceAngle / 2);
      const spins = 6 + Math.floor(Math.random() * 4);
      const finalRotation = rotation + spins * 360 + targetAngle - (rotation % 360);

      setRotation(finalRotation);

      setTimeout(() => {
        setWonItem(items[wonIndex]);
        setShowResult(true);
        setIsSpinning(false);
        setSpinCode("");
      }, 6000);
    } catch (e: any) {
      toast.error(e.message || "Spin failed!");
      setIsSpinning(false);
    }
  };

  const sliceAngle = items.length > 0 ? 360 / items.length : 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />

      <div className="fixed top-4 left-4 z-50">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
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

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* CSS Wheel */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Pointer */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
              <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[36px] border-t-primary drop-shadow-[0_0_15px_hsla(320,100%,50%,0.9)]" />
            </div>

            {/* Outer glow ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="w-[380px] h-[380px] rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, hsla(320,100%,50%,0.4), hsla(45,100%,50%,0.4), hsla(185,100%,50%,0.4), hsla(280,100%,50%,0.4), hsla(320,100%,50%,0.4))",
                  filter: "blur(30px)",
                }}
                animate={isSpinning ? { rotate: 360 } : {}}
                transition={isSpinning ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
              />
            </div>

            {/* LED lights ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "hsl(320, 100%, 50%)" : "hsl(45, 100%, 50%)",
                    top: `${50 - 48 * Math.cos((i * 15 * Math.PI) / 180)}%`,
                    left: `${50 + 48 * Math.sin((i * 15 * Math.PI) / 180)}%`,
                    boxShadow: `0 0 8px ${i % 2 === 0 ? "hsla(320,100%,50%,0.8)" : "hsla(45,100%,50%,0.8)"}`,
                  }}
                  animate={{
                    opacity: isSpinning ? [1, 0.3, 1] : [0.6, 1, 0.6],
                    scale: isSpinning ? [1, 0.8, 1] : [0.9, 1.1, 0.9],
                  }}
                  transition={{
                    duration: isSpinning ? 0.3 : 1.5,
                    repeat: Infinity,
                    delay: i * (isSpinning ? 0.05 : 0.1),
                  }}
                />
              ))}
            </div>

            {/* The wheel itself */}
            <div
              ref={wheelRef}
              className="relative w-[340px] h-[340px] rounded-full overflow-hidden z-10"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? "transform 6s cubic-bezier(0.15, 0.6, 0.15, 1)" : "none",
                boxShadow: "0 0 30px hsla(320,100%,50%,0.3), inset 0 0 20px hsla(0,0%,0%,0.3)",
              }}
            >
              {items.length > 0 ? items.map((item, i) => {
                const startDeg = i * sliceAngle;
                const midDeg = startDeg + sliceAngle / 2;
                const color = item.color || `hsl(${(i * 360) / items.length}, 70%, 50%)`;

                return (
                  <div
                    key={item.id}
                    className="absolute inset-0"
                    style={{
                      background: `conic-gradient(from ${startDeg}deg at 50% 50%, ${color} 0deg, ${color} ${sliceAngle}deg, transparent ${sliceAngle}deg)`,
                    }}
                  >
                    {/* Text label */}
                    <div
                      className="absolute font-display font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      style={{
                        top: "50%",
                        left: "50%",
                        width: "130px",
                        transformOrigin: "0 0",
                        transform: `rotate(${midDeg}deg) translateX(30px) translateY(-8px)`,
                        fontSize: `${Math.max(9, Math.min(13, 140 / items.length))}px`,
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                );
              }) : (
                <div className="w-full h-full flex items-center justify-center bg-card">
                  <p className="text-muted-foreground font-display text-sm">No items</p>
                </div>
              )}

              {/* Center hub */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center z-20"
                  style={{
                    background: "linear-gradient(135deg, hsl(320, 80%, 30%), hsl(280, 80%, 20%))",
                    boxShadow: "0 0 20px hsla(320,100%,50%,0.5), inset 0 0 10px hsla(320,100%,50%,0.3)",
                    border: "3px solid hsla(320,100%,60%,0.6)",
                  }}
                >
                  <span className="text-white font-display font-black text-xs tracking-wider">SPIN</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="glass rounded-2xl p-6 border border-border/50">
              <h3 className="font-display text-lg font-bold gradient-text mb-4">KAISE KHELEIN? 🤔</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                {[
                  "₹50 pay karo (Payment QR Discord pe hai)",
                  "Admin se spin code lo Discord pe",
                  "Code aur username enter karo",
                  "Wheel spin karo aur jeeto! 🎉",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">{i + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-primary/30">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-display tracking-wider">MINECRAFT USERNAME</label>
                  <Input placeholder="Tumhara username..." value={username} onChange={(e) => setUsername(e.target.value)} className="bg-card border-border/50" disabled={isSpinning} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-display tracking-wider">SPIN CODE</label>
                  <Input placeholder="Admin se mila code..." value={spinCode} onChange={(e) => setSpinCode(e.target.value)} className="bg-card border-border/50" disabled={isSpinning} />
                </div>
                <Button onClick={spin} disabled={isSpinning || items.length === 0} className="w-full font-display text-lg py-6" variant="default">
                  {isSpinning ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> SPINNING...</>
                  ) : (
                    <><Sparkles className="w-5 h-5 mr-2" /> SPIN THE WHEEL! 🎡</>
                  )}
                </Button>
              </div>
            </div>

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
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResult(false)}
            >
              {/* Confetti particles */}
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                    top: "50%",
                    left: "50%",
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 600,
                    opacity: 0,
                    scale: 0,
                    rotate: Math.random() * 720,
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              ))}

              <motion.div
                className="glass rounded-3xl p-8 max-w-md w-full mx-4 border border-primary/50 text-center relative"
                initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 150 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  boxShadow: "0 0 80px hsla(320, 100%, 50%, 0.3), 0 0 120px hsla(45, 100%, 50%, 0.15)",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: 2 }}
                  className="text-7xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="font-display text-3xl font-black gradient-text mb-2">CONGRATULATIONS!</h2>
                <p className="text-muted-foreground mb-6">Tumne jeeta hai:</p>
                <motion.div
                  className="rounded-2xl p-6 mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${wonItem.color}33, ${wonItem.color}11)`,
                    border: `2px solid ${wonItem.color}`,
                    boxShadow: `0 0 30px ${wonItem.color}33`,
                  }}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.05, 1] }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h3 className="font-display text-2xl font-bold text-foreground mb-1">{wonItem.name}</h3>
                  {wonItem.value_label && <p className="text-sm text-muted-foreground">{wonItem.value_label}</p>}
                  {wonItem.description && <p className="text-xs text-muted-foreground mt-2">{wonItem.description}</p>}
                </motion.div>
                <p className="text-xs text-muted-foreground mb-4">
                  Result Discord pe bhi bhej diya gaya hai! Admin tumhe item dega. 🎁
                </p>
                <Button onClick={() => setShowResult(false)} className="w-full font-display text-lg py-5">
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
