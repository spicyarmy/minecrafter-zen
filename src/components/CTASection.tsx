import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-secondary/20"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ backgroundSize: "200% 200%" }}
        />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/30 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/30 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Floating stars decoration */}
          <div className="relative">
            <motion.div
              className="absolute -top-8 -left-8 text-secondary"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-8 h-8" fill="currentColor" />
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-4 text-primary"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-6 h-6" fill="currentColor" />
            </motion.div>
          </div>

          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-6">
            🚀 JOIN THE ADVENTURE
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6">
            Ready to <span className="gradient-text">Dominate</span>?
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Get your premium rank today and unlock exclusive perks, kits, and abilities that will set you apart from the competition!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <a href="#ranks">
                Get Your Rank
                <ArrowRight className="ml-2" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="https://discord.gg/bBNsdzVfdB" target="_blank" rel="noopener noreferrer">
                Join Community
              </a>
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {[
              { value: "1000+", label: "Happy Players" },
              { value: "24/7", label: "Online Support" },
              { value: "100%", label: "Secure" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl md:text-4xl font-black gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
