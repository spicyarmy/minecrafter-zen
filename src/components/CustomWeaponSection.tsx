import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomWeaponSectionProps {
  serverParam?: string;
}

const PREVIEW_WEAPONS = [
  { icon: "⚔️", name: "Sword", color: "from-cyan-500 to-blue-600" },
  { icon: "🔨", name: "Mace", color: "from-amber-500 to-orange-600" },
  { icon: "🪓", name: "Axe", color: "from-red-500 to-rose-600" },
  { icon: "⛏️", name: "Pickaxe", color: "from-emerald-500 to-teal-600" },
  { icon: "🔱", name: "Trident", color: "from-blue-500 to-indigo-600" },
  { icon: "🏹", name: "Bow", color: "from-yellow-500 to-amber-600" },
];

const CustomWeaponSection = ({ serverParam = "gem" }: CustomWeaponSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-display tracking-wider text-muted-foreground">WEAPON FORGE</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-display font-black mb-3">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              CUSTOM WEAPONS
            </span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Build your dream weapon with custom enchantments & levels. Prices start at ₹20!
          </p>
        </motion.div>

        {/* Weapon Preview Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl mx-auto mb-8">
          {PREVIEW_WEAPONS.map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.08 }}
              className="glass rounded-xl p-3 text-center border border-border/30 hover:border-primary/40 transition-all cursor-pointer"
              onClick={() => navigate(`/custom-weapon?server=${serverParam}`)}
            >
              <motion.div 
                className="text-3xl mb-1"
                whileHover={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.4 }}
              >
                {w.icon}
              </motion.div>
              <div className="text-xs font-display font-bold text-muted-foreground">{w.name}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="gaming"
            size="lg"
            onClick={() => navigate(`/custom-weapon?server=${serverParam}`)}
            className="group"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Open Weapon Forge
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomWeaponSection;
