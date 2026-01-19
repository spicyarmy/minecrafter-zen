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
          className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="Website Guide"
        >
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[92%] max-w-md mx-auto px-2 sm:px-0"
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
                <div className="p-4 pt-6 sm:p-6 sm:pt-8">
                  {/* Icon */}
                  <motion.div
                    key={currentStep}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary"
                  >
                    <span className="[&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-8 sm:[&>svg]:h-8">
                      {step.icon}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    key={`title-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-lg sm:text-xl font-bold text-center text-foreground mb-2 sm:mb-3"
                  >
                    {step.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    key={`desc-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-center text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6"
                  >
                    {step.description}
                  </motion.p>

                  {/* Progress dots */}
                  <div className="flex justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                    {tourSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                          index === currentStep
                            ? "w-4 sm:w-6 bg-gradient-to-r from-primary to-secondary"
                            : index < currentStep
                            ? "w-1.5 sm:w-2 bg-primary/50"
                            : "w-1.5 sm:w-2 bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex gap-2 sm:gap-3">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={handlePrev}
                        className="flex-1 gap-1 sm:gap-2 text-xs sm:text-sm h-9 sm:h-10"
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      className="flex-1 gap-1 sm:gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-xs sm:text-sm h-9 sm:h-10"
                    >
                      {currentStep < tourSteps.length - 1 ? (
                        <>
                          Next
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
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
                      className="w-full text-center text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4 hover:text-foreground transition-colors"
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
