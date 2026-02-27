import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flame, Coins, Box, Sparkles } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import tokenLogo from "@/assets/token-logo.png";
import oneblockLogo from "@/assets/oneblock-logo.png";
import { supabase } from "@/integrations/supabase/client";

interface ServerConfig {
  key: string;
  route: string;
  name: string;
  description: string;
  gradient: string;
  hue: number;
  icon?: React.ReactNode;
  logo?: string;
  settingKey: string;
}

const servers: ServerConfig[] = [
  {
    key: "spicy",
    route: "/spicy",
    name: "SPICY SMP",
    description: "Ranks, Survival Keys, Lifesteal Keys, Coins & more",
    gradient: "from-orange-500 to-red-600",
    hue: 20,
    icon: <Flame className="w-12 h-12 text-orange-400" />,
    settingKey: "server_spicy_enabled",
  },
  {
    key: "token",
    route: "/token",
    name: "TOKEN SMP",
    description: "Ranks, Mob Tokens & more",
    gradient: "from-yellow-500 to-amber-600",
    hue: 45,
    logo: tokenLogo,
    settingKey: "server_token_enabled",
  },
  {
    key: "oneblock",
    route: "/oneblock",
    name: "ONE BLOCK",
    description: "Ranks, Keys, Team Names, Keep Inventory & more",
    gradient: "from-emerald-400 to-green-600",
    hue: 160,
    logo: oneblockLogo,
    settingKey: "server_oneblock_enabled",
  },
];

const ServerSelect = () => {
  const navigate = useNavigate();
  const [enabledServers, setEnabledServers] = useState<string[]>(["server_spicy_enabled"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("key, value")
        .in("key", ["server_token_enabled", "server_oneblock_enabled"]);
      if (data) {
        const extra = data.filter(s => s.value === true).map(s => s.key);
        setEnabledServers(["server_spicy_enabled", ...extra]);
      }
    };
    fetchSettings();
  }, []);

  const visibleServers = servers.filter(s => enabledServers.includes(s.settingKey));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <ParticleBackground />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, hsl(320 100% 50%), transparent 70%)", top: "-200px", right: "-200px" }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(45 100% 50%), transparent 70%)", bottom: "-150px", left: "-150px" }}
          animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsl(185 100% 50%), transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            PREMIUM MINECRAFT STORE
            <Sparkles className="w-4 h-4 text-secondary" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="gradient-text-hero text-glow-primary">SPICY NETWORK</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Choose your server to browse the store
          </motion.p>
        </motion.div>

        {/* Server Cards */}
        {loading ? (
          <div className="text-center text-muted-foreground font-display tracking-wider animate-pulse">
            Loading...
          </div>
        ) : visibleServers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-16"
          >
            <p className="font-display text-xl">No servers available right now</p>
            <p className="text-sm mt-2">Check back later!</p>
          </motion.div>
        ) : (
          <div className={`grid grid-cols-1 ${visibleServers.length === 1 ? "max-w-lg" : visibleServers.length === 2 ? "md:grid-cols-2 max-w-4xl" : "md:grid-cols-3 max-w-6xl"} gap-6 mx-auto`}>
            {visibleServers.map((server, i) => (
              <motion.div
                key={server.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => navigate(server.route)}
              >
                <div
                  className="relative rounded-3xl bg-card border border-border/50 overflow-hidden transition-all duration-500 p-8 text-center h-full"
                  style={{ boxShadow: `0 0 60px hsla(${server.hue}, 100%, 50%, 0.15)` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 80px hsla(${server.hue}, 100%, 50%, 0.1)` }}
                  />
                  <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center overflow-hidden ${server.logo ? "" : "bg-gradient-to-br"}`}
                    style={server.logo ? {} : { background: `linear-gradient(135deg, hsla(${server.hue}, 100%, 50%, 0.2), hsla(${server.hue}, 80%, 40%, 0.2))` }}
                  >
                    {server.logo ? (
                      <img src={server.logo} alt={server.name} className="w-full h-full object-cover" />
                    ) : (
                      server.icon
                    )}
                  </div>
                  <h2 className={`font-display text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r ${server.gradient} bg-clip-text text-transparent`}>
                    {server.name}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {server.description}
                  </p>
                  <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${server.gradient} font-display font-bold text-white transition-all group-hover:shadow-[0_0_30px_hsla(${server.hue},100%,50%,0.5)]`}>
                    Enter Store →
                  </div>
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r ${server.gradient} [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Discord link */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <a
            href="https://discord.gg/bBNsdzVfdB"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-display text-sm tracking-wider group"
          >
            <span className="group-hover:text-primary transition-colors">Discord</span>
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ServerSelect;
