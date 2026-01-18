import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Sparkles, Crown, Key, ShoppingCart, MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  position: "center" | "top" | "bottom";
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to SpicySMP! 🔥",
    description: "Let me guide you through our store. You can buy ranks, keys, and exclusive items to enhance your Minecraft experience!",
    icon: <Sparkles className="w-8 h-8" />,
    position: "center",
  },
  {
    title: "Browse Premium Ranks 👑",
    description: "Scroll down to see our ranks from PRO to SPICY. Each rank gives you special perks like /fly, /kit, home slots, and more!",
    icon: <Crown className="w-8 h-8" />,
    position: "center",
  },
  {
    title: "Explore Crate Keys 🔑",
    description: "We have various keys with amazing rewards! Vote Keys are FREE, while other keys give better loot like spawners and gear.",
    icon: <Key className="w-8 h-8" />,
    position: "center",
  },
  {
    title: "How to Purchase 🛒",
    description: "Click 'Buy Now' on any item → Select duration/quantity → Scan QR code to pay via UPI → Enter your Minecraft username → Upload payment screenshot → Done!",
    icon: <ShoppingCart className="w-8 h-8" />,
    position: "center",
  },
  {
    title: "10% Discount Active! 🎉",
    description: "Great news! All items have 10% OFF until January 20th. The discounted price is shown automatically at checkout!",
    icon: <Sparkles className="w-8 h-8" />,
    position: "center",
  },
  {
    title: "Need Help? 💬",
    description: "Join our Discord server for support, updates, and to connect with other players. Click the Discord button in the footer!",
    icon: <MessageCircle className="w-8 h-8" />,
    position: "center",
  },
];

const GuidedTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("spicysmp-tour-seen");
    if (!seen) {
      setHasSeenTour(false);
      // Small delay before showing tour
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("spicysmp-tour-seen", "true");
    setHasSeenTour(true);
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Help button to restart tour */}
      {hasSeenTour && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          onClick={handleStartTour}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="Website Guide"
        >
          <HelpCircle className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Tour Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
              onClick={handleClose}
            />

            {/* Tour Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md"
            >
              <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
                {/* Gradient top */}
                <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-6 pt-8">
                  {/* Icon */}
                  <motion.div
                    key={currentStep}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary"
                  >
                    {step.icon}
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    key={`title-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-xl font-bold text-center text-foreground mb-3"
                  >
                    {step.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    key={`desc-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-center text-sm leading-relaxed mb-6"
                  >
                    {step.description}
                  </motion.p>

                  {/* Progress dots */}
                  <div className="flex justify-center gap-2 mb-6">
                    {tourSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentStep
                            ? "w-6 bg-gradient-to-r from-primary to-secondary"
                            : index < currentStep
                            ? "bg-primary/50"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex gap-3">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={handlePrev}
                        className="flex-1 gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      {currentStep < tourSteps.length - 1 ? (
                        <>
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Start Shopping! 🛒
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Skip text */}
                  {currentStep < tourSteps.length - 1 && (
                    <button
                      onClick={handleClose}
                      className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-foreground transition-colors"
                    >
                      Skip tutorial
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GuidedTour;
