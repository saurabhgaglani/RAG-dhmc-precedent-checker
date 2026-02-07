import { motion } from "framer-motion";
import { Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onCTAClick: () => void;
}

const HeroSection = ({ onCTAClick }: HeroSectionProps) => {
  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <Shield className="w-4 h-4 text-teal-glow" />
            <span className="text-sm text-secondary-foreground/80 font-medium">DMHC Precedent Checker</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-secondary-foreground leading-tight mb-6"
        >
          Something didn't feel right about your care.{" "}
          <span className="text-teal-glow">Let's figure it out—together.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-secondary-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Insurance and policy rules are complicated on purpose. You don't have to understand them—we do.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            variant="hero"
            size="xl"
            onClick={onCTAClick}
            className="group"
          >
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Show me what happened
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-8 text-sm text-secondary-foreground/40"
        >
          Powered by California DMHC Independent Medical Review precedent database
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
