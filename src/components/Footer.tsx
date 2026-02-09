import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const Footer = () => {
  const links = [
    { name: "Discord", href: "https://discord.gg/bBNsdzVfdB" },
    { name: "Vote", href: "https://minecraft-mp.com/server-s351315" },
    { name: "Store", href: "#store" },
  ];

  return (
    <footer id="contact" className="relative py-16 border-t border-border/50">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[150px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <span className="font-display text-2xl font-bold gradient-text">
                SPICY SMP
              </span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Your ultimate destination for premium Minecraft items. Join the adventure today!
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-6 mb-8"
          >
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-display text-sm tracking-wider"
              >
                {link.name}
                {link.href.startsWith("http") && <ExternalLink className="w-3 h-3" />}
              </a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            <p>© {new Date().getFullYear()} SPICY NETWORK. All rights reserved.</p>
            <p className="mt-1 text-xs">
              Not affiliated with Mojang or Microsoft.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
