import { useState } from "react";
import { motion } from "framer-motion";
import { Users, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const AdvocacyLoop = () => {
  const [optedIn, setOptedIn] = useState(false);

  return (
    <section className="py-16 px-4 surface-gradient">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-xl p-6 sm:p-8 card-shadow"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-foreground mb-1">
                ACS CAN Integration
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your experience matters—especially to the people who write the rules.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 bg-accent/60 rounded-lg p-4">
            <div className="flex-1">
              <p className="text-foreground font-medium text-sm">
                Yes, help prevent this from happening again.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Share anonymized case data with the American Cancer Society Cancer Action Network
              </p>
            </div>
            <Switch
              checked={optedIn}
              onCheckedChange={setOptedIn}
            />
          </div>

          {optedIn && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 bg-accent/40 rounded-lg border border-primary/10"
            >
              <p className="text-sm text-accent-foreground mb-2">
                Thank you, Maria. Your case will be anonymized and shared to support biomarker testing legislation nationwide.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
              >
                Learn more about ACS CAN
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AdvocacyLoop;
