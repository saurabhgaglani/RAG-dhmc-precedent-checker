import { motion } from "framer-motion";
import { FileEdit, HandHeart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmpowermentActionsProps {
  onCreateAppeal: () => void;
}

const EmpowermentActions = ({ onCreateAppeal }: EmpowermentActionsProps) => {
  const actions = [
    {
      icon: FileEdit,
      label: "Create my appeal",
      description: "We'll draft a legally-grounded appeal letter citing Michigan HB 565 and NCCN guidelines.",
      onClick: onCreateAppeal,
    },
    {
      icon: HandHeart,
      label: "Ask for a hardship exception",
      description: "Request an exception based on medical necessity and financial hardship provisions.",
      onClick: () => {},
    },
    {
      icon: Share2,
      label: "Share my story to fix this for others",
      description: "Anonymously contribute your case to help change unfair policies for future patients.",
      onClick: () => {},
    },
  ];

  return (
    <section className="py-16 px-4 bg-trust-surface">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-2">
            You shouldn't have to fight this alone.
          </h3>
          <p className="text-muted-foreground">Choose your next step—we'll guide you through it.</p>
        </motion.div>

        <div className="space-y-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Button
                variant="empowerment"
                className="w-full h-auto py-5 px-6 flex items-start gap-4 text-left justify-start"
                onClick={action.onClick}
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-foreground text-base mb-1">{action.label}</span>
                  <span className="block text-sm text-muted-foreground font-normal leading-relaxed">
                    {action.description}
                  </span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmpowermentActions;
