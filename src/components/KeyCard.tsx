import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import KeyPurchaseModal from "./KeyPurchaseModal";

interface KeyCardProps {
  name: string;
  description: string;
  price: string;
  buyLink: string;
  isFree?: boolean;
  index: number;
}

const KeyCard = ({
  name,
  description,
  price,
  buyLink,
  isFree = false,
  index,
}: KeyCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group"
      >
        <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_30px_hsla(185,100%,50%,0.2)]">
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          {/* Icon */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              {isFree ? (
                <Gift className="w-6 h-6 text-accent" />
              ) : (
                <Key className="w-6 h-6 text-accent" />
              )}
            </div>
            {isFree && (
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-display font-semibold">
                FREE
              </span>
            )}
          </div>

          {/* Content */}
          <h4 className="font-display text-lg font-bold text-foreground mb-2">
            {name}
          </h4>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <span className={`font-display font-bold ${isFree ? "text-accent" : "text-secondary"}`}>
              {price}
            </span>
            <Button 
              variant={isFree ? "accent" : "secondary"} 
              size="sm" 
              onClick={() => setIsModalOpen(true)}
            >
              {isFree ? "Get Now" : "Buy Now"}
            </Button>
          </div>
        </div>
      </motion.div>

      <KeyPurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        name={name}
        description={description}
        price={price}
        buyLink={buyLink}
        isFree={isFree}
      />
    </>
  );
};

export default KeyCard;
