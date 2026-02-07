import { Shield } from "lucide-react";

const AppFooter = () => {
  return (
    <footer className="py-12 px-4 bg-secondary">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-teal-glow" />
          <span className="font-serif font-bold text-secondary-foreground">PolicyProof AI</span>
        </div>
        <p className="text-secondary-foreground/60 text-sm leading-relaxed max-w-lg mx-auto mb-6">
          PolicyProof is here to help you take the next step—at your pace.
        </p>
        <div className="border-t border-secondary-foreground/10 pt-6">
          <p className="text-xs text-secondary-foreground/40">
            © 2026 PolicyProof AI. Not legal advice. For informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
