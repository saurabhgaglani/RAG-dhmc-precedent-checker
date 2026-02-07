import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Scale, BookOpen } from "lucide-react";

interface ScanningAnimationProps {
  onComplete: () => void;
}

const steps = [
  { icon: FileSearch, text: "Reading your denial letter...", duration: 1500 },
  { icon: Scale, text: "Searching California DMHC precedents...", duration: 1500 },
  { icon: BookOpen, text: "Analyzing Independent Medical Review decisions...", duration: 1500 },
];

const ScanningAnimation = ({ onComplete }: ScanningAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(onComplete, 400);
      }
    }, 50);

    let stepTimeout: ReturnType<typeof setTimeout>;
    const advanceStep = (index: number) => {
      if (index < steps.length - 1) {
        stepTimeout = setTimeout(() => {
          setCurrentStep(index + 1);
          advanceStep(index + 1);
        }, steps[index].duration);
      }
    };
    advanceStep(0);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [onComplete]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <section className="min-h-screen flex items-center justify-center surface-gradient px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Document visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-48 h-64 mx-auto mb-10 rounded-xl bg-card card-shadow overflow-hidden"
        >
          {/* Mock document lines */}
          <div className="p-4 space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-2 bg-muted rounded-full"
                style={{ width: `${60 + Math.random() * 35}%` }}
              />
            ))}
          </div>

          {/* Scan line */}
          <div className="absolute inset-x-0 top-0 scan-line-anim">
            <div className="h-1 teal-gradient opacity-80" />
            <div className="h-8 bg-gradient-to-b from-primary/10 to-transparent" />
          </div>
        </motion.div>

        {/* Step indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <CurrentIcon className="w-5 h-5 text-primary pulse-glow rounded-full" />
            <p className="text-foreground font-medium">{steps[currentStep].text}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full teal-gradient rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Analyzing your case against California DMHC IMR precedents...
        </p>
      </div>
    </section>
  );
};

export default ScanningAnimation;
