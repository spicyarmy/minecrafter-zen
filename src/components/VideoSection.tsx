import { motion } from "framer-motion";
import { useState } from "react";
import { Play, X } from "lucide-react";

const VideoSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Minecraft trailer/gameplay video placeholder
  const videoId = "MmB9b5njVbA"; // Popular Minecraft trailer

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/10 blur-[200px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-display tracking-wider text-muted-foreground mb-4">
            🎥 SEE IT IN ACTION
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
            <span className="gradient-text">Epic Gameplay</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the thrill of SPICYSMP
          </p>
        </motion.div>

        {/* Video thumbnail with play button */}
        <motion.div
          className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden group cursor-pointer"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onClick={() => setIsVideoOpen(true)}
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-card">
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="Minecraft Gameplay Video"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-300" />
            
            {/* Play button */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_50px_hsla(320,100%,50%,0.5)] group-hover:shadow-[0_0_80px_hsla(320,100%,50%,0.7)] transition-shadow">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
              </div>
            </motion.div>

            {/* Glowing border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 group-hover:border-primary/60 transition-colors" />
          </div>
        </motion.div>
      </div>

      {/* Video modal */}
      {isVideoOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsVideoOpen(false)}
        >
          <div className="relative w-full max-w-5xl mx-4 aspect-video">
            <button
              className="absolute -top-12 right-0 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsVideoOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              className="w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default VideoSection;
