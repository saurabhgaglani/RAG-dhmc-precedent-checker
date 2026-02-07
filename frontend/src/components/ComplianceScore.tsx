import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ComplianceScoreProps {
  score: number;
  violatedSection: string;
  insurerName: string;
}

const ComplianceScore = ({ score, violatedSection, insurerName }: ComplianceScoreProps) => {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 70) return "text-primary";
    if (score >= 40) return "text-yellow-500";
    return "text-destructive";
  };

  const getStrokeColor = () => {
    if (score >= 70) return "hsl(173, 58%, 39%)";
    if (score >= 40) return "hsl(45, 93%, 47%)";
    return "hsl(12, 76%, 61%)";
  };

  const getStatusMessage = () => {
    if (score >= 70) {
      return {
        icon: "check",
        color: "text-primary",
        bg: "bg-primary/10",
        text: "Denial appears legally compliant",
        description: `This insurer's denial meets ${violatedSection} requirements. The denial reasoning aligns with legal standards.`
      };
    }
    if (score >= 40) {
      return {
        icon: "warning",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        text: "Questionable compliance",
        description: `This denial has some compliance concerns regarding ${violatedSection}. Further review recommended.`
      };
    }
    return {
      icon: "alert",
      color: "text-destructive",
      bg: "bg-destructive/10",
      text: "Below legal compliance threshold",
      description: `This insurer is ignoring ${violatedSection} of the applicable state code. Their denial does not meet the legal standard for this diagnosis.`
    };
  };

  const status = getStatusMessage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-card rounded-xl p-6 sm:p-8 card-shadow border border-border mb-10"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        {/* Circular Gauge */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={getStrokeColor()}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={`text-3xl font-bold ${getScoreColor()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {score}%
            </motion.span>
            <span className="text-xs text-muted-foreground font-medium">Validity</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-serif font-bold text-lg sm:text-xl text-foreground mb-2">
            {insurerName} Denial Validity Score
          </h3>
          <div className="flex items-start gap-2 justify-center sm:justify-start mb-3">
            <AlertTriangle className={`w-4 h-4 ${status.color} mt-0.5 shrink-0`} />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {status.description}
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 ${status.bg} rounded-full px-3 py-1.5`}>
            <span className={`w-2 h-2 rounded-full ${status.color.replace('text-', 'bg-')} ${score < 40 ? 'animate-pulse' : ''}`} />
            <span className={`text-xs font-medium ${status.color}`}>
              {status.text}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComplianceScore;
