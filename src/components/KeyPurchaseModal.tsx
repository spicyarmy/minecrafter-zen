import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Key, Gift, ExternalLink, Zap, Shield, Sparkles, Package } from "lucide-react";

interface KeyPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  description: string;
  price: string;
  buyLink: string;
  isFree?: boolean;
}

const KeyPurchaseModal = ({
  isOpen,
  onClose,
  name,
  description,
  price,
  buyLink,
  isFree = false,
}: KeyPurchaseModalProps) => {
  const gradient = isFree ? "from-accent to-cyan-400" : "from-secondary to-amber-400";
  const bgGradient = isFree ? "from-accent/20 to-cyan-400/20" : "from-secondary/20 to-amber-400/20";
  const glow = isFree ? "0 0 60px hsla(185, 100%, 50%, 0.3)" : "0 0 60px hsla(45, 100%, 50%, 0.3)";
  const accentColor = isFree ? "text-accent" : "text-secondary";
  const borderColor = isFree ? "border-accent/30" : "border-secondary/30";

  const rewards = [
    { icon: Package, text: "Random Loot" },
    { icon: Sparkles, text: "Enchanted Items" },
    { icon: Gift, text: "Bonus Rewards" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-card border-border/50" style={{ boxShadow: glow }}>
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${bgGradient} blur-[60px]`} />
          <div className={`absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-br ${bgGradient} blur-[60px]`} />
        </div>

        <div className="relative z-10 p-6">
          {/* Animated key icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                {isFree ? (
                  <Gift className="w-12 h-12 text-white" />
                ) : (
                  <Key className="w-12 h-12 text-white" />
                )}
              </motion.div>
              
              {/* Sparkle effects */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className={`w-6 h-6 ${accentColor}`} />
              </motion.div>
            </div>
          </motion.div>

          <DialogHeader className="text-center space-y-2 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isFree && (
                <span className={`inline-block px-3 py-1 rounded-full bg-accent/20 ${accentColor} text-xs font-display font-semibold mb-2`}>
                  FREE KEY
                </span>
              )}
              <DialogTitle className={`font-display text-2xl font-black ${accentColor}`}>
                {name}
              </DialogTitle>
            </motion.div>
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>

          {/* Rewards preview */}
          <motion.div
            className="space-y-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-display text-center">
              Possible Rewards
            </p>
            <div className="flex justify-center gap-4">
              {rewards.map((reward, index) => (
                <motion.div
                  key={reward.text}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl glass ${borderColor} border`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <reward.icon className={`w-5 h-5 ${accentColor}`} />
                  <span className="text-xs text-muted-foreground">{reward.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Description details */}
          <motion.div
            className={`p-4 rounded-xl glass ${borderColor} border mb-6`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-center text-muted-foreground">
              <span className="font-semibold text-foreground">💡 How it works:</span> Use this key in-game at the crate to unlock random items based on your luck!
            </p>
          </motion.div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 py-4 border-y border-border/50 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-xs">Instant</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-xs">Secure</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex flex-col items-center gap-4">
            <motion.span
              className={`font-display text-3xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.6 }}
            >
              {price}
            </motion.span>

            <Button 
              variant={isFree ? "accent" : "hero"} 
              size="lg" 
              className="w-full group"
              asChild
            >
              <a href={buyLink} target="_blank" rel="noopener noreferrer">
                <span>{isFree ? "Get Free Key" : "Purchase Key"}</span>
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyPurchaseModal;
