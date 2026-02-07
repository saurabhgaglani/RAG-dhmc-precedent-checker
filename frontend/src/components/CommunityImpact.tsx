import { motion } from "framer-motion";
import { MapPin, Users, TrendingUp, Bell } from "lucide-react";

const CommunityImpact = () => {
  const regionData = [
    { city: "Detroit Metro", count: 23, trend: "+8 this month" },
    { city: "Grand Rapids", count: 12, trend: "+3 this month" },
    { city: "Ann Arbor", count: 10, trend: "+5 this month" },
  ];

  return (
    <section className="py-16 px-4 bg-warm">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Community Impact</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-2">
            You're not the only one fighting this.
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Your report just joined others across Michigan identifying a pattern of biomarker test denials.
          </p>
        </motion.div>

        {/* Notification Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-accent/80 border border-primary/20 rounded-xl p-5 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full teal-gradient flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-primary-foreground" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">Maria</span>, your report just joined{" "}
              <span className="font-bold text-primary">45 others</span> in Detroit Metro.
              We've notified the local{" "}
              <span className="font-semibold text-primary">ACS CAN chapter</span>{" "}
              that this insurer is systematically denying biomarker tests in your area.
            </p>
          </div>
        </motion.div>

        {/* Regional Heat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {regionData.map((region, index) => (
            <motion.div
              key={region.city}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="bg-card rounded-xl p-4 card-shadow border border-border"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{region.city}</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-bold text-foreground">{region.count}</span>
                  <span className="text-xs text-muted-foreground ml-1">reports</span>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">{region.trend}</span>
                </div>
              </div>
              {/* Mini heat bar */}
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--teal)) 0%, hsl(var(--red-warning)) 100%)`,
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(region.count / 30) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregate stat */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center justify-center gap-3 text-muted-foreground"
        >
          <Users className="w-4 h-4" />
          <p className="text-sm">
            <span className="font-semibold text-foreground">247 patients</span> across Michigan have reported similar denials this year
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityImpact;
