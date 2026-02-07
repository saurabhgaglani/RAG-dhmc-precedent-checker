import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";
import GuidedEntry from "@/components/GuidedEntry";
import ScanningAnimation from "@/components/ScanningAnimation";
import AnalysisView from "@/components/AnalysisView";
import EmpowermentActions from "@/components/EmpowermentActions";
import CommunityImpact from "@/components/CommunityImpact";
import AdvocacyLoop from "@/components/AdvocacyLoop";
import AppFooter from "@/components/AppFooter";
import AppealLetter from "@/components/AppealLetter";

type AppStep = "hero" | "entry" | "scanning" | "results" | "appeal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

const Index = () => {
  const [step, setStep] = useState<AppStep>("hero");
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleCTAClick = useCallback(() => {
    setStep("entry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(async (file: File | null, text: string) => {
    setStep("scanning");
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else {
        const blob = new Blob([text], { type: "text/plain" });
        formData.append("file", blob, "denial_letter.txt");
      }

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setAnalysisData(data);
      setStep("results");
    } catch (error) {
      toast.error("Failed to analyze denial. Please try again.");
      setStep("entry");
    }
  }, []);



  const handleCreateAppeal = useCallback(() => {
    setStep("appeal");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBackToResults = useCallback(() => {
    setStep("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {step === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HeroSection onCTAClick={handleCTAClick} />
          </motion.div>
        )}

        {step === "entry" && (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GuidedEntry onSubmit={handleSubmit} />
          </motion.div>
        )}

        {step === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ScanningAnimation onComplete={() => {}} />
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnalysisView data={analysisData} />
            <EmpowermentActions onCreateAppeal={handleCreateAppeal} />
            <CommunityImpact />
            <AdvocacyLoop />
            <AppFooter />
          </motion.div>
        )}

        {step === "appeal" && (
          <motion.div
            key="appeal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AppealLetter onBack={handleBackToResults} />
            <AppFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
