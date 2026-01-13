import { motion } from "framer-motion";
import { Zap, Shield, Clock, Users, Gift, Headphones } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Get your items within seconds after purchase",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "All transactions are encrypted and safe",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Shop anytime, our store never closes",
  },
  {
    icon: Users,
    title: "Active Community",
    description: "Join thousands of active players",
  },
  {
    icon: Gift,
    title: "Regular Deals",
    description: "Frequent sales and special offers",
  },
  {
    icon: Headphones,
    title: "Quick Support",
    description: "Our team is always ready to help",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-4">
            ✨ WHY CHOOSE US
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
            <span className="gradient-text">Premium Experience</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="relative p-6 rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_hsla(320,100%,50%,0.15)]">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-bold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
