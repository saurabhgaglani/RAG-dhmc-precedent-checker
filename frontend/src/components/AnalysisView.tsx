import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import ComplianceScore from "@/components/ComplianceScore";

interface AnalysisViewProps {
  data: {
    extracted_text: string;
    keywords: string[];
    denial_reasons: string[];
    similar_cases: Array<{ content: string; metadata: any }>;
    validity_score: number;
    legal_basis: string;
  } | null;
}

const AnalysisView = ({ data }: AnalysisViewProps) => {
  if (!data) return null;

  const score = Math.round(data.validity_score);
  const primaryReason = data.denial_reasons[0] || "unspecified reason";

  return (
    <section className="py-16 px-4 surface-gradient">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
            Similar cases that were reviewed by the California DMHC Independent Medical Review in the last 5 years.
          </h2>
          <p className="text-muted-foreground text-lg">
            Analysis Complete • {data.keywords.length} key terms identified
          </p>
        </motion.div>

        <ComplianceScore
          score={score}
          violatedSection="Policy Compliance"
          insurerName="Your Insurer"
        />

        <div className="grid md:grid-cols-2 gap-0 mb-10 rounded-xl overflow-hidden card-shadow border border-border">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card p-6 sm:p-8 border-b md:border-b-0 md:border-r border-border relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-warning" />
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-foreground">Denial Reasons</h3>
                <p className="text-xs text-muted-foreground">What they cited</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              {data.denial_reasons.length > 0 ? (
                data.denial_reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <p className="capitalize">{reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No specific denial reasons identified</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card p-6 sm:p-8 relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1 teal-gradient" />
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-foreground">Legal Analysis</h3>
                <p className="text-xs text-muted-foreground">What the law says</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p>{data.legal_basis}</p>
            </div>
          </motion.div>
        </div>

        {data.similar_cases.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-accent/80 rounded-xl p-6 card-shadow border border-primary/20 mb-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full teal-gradient flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-foreground mb-2">
                    Found {data.similar_cases.length} similar precedent(s) from California DMHC
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    These cases from the <span className="font-semibold text-foreground">California Department of Managed Health Care – Independent Medical Review (IMR)</span> database may support your appeal.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1">
                    <span className="text-xs font-medium text-primary">Official DMHC IMR Decisions</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Similar Cases Details */}
            <div className="space-y-4">
              {data.similar_cases.map((case_item, idx) => {
                const content = case_item.content || "";
                
                // More robust parsing for the actual data format
                const caseMatch = content.match(/([A-Z]{2}\d{2}-\d{5})/);
                const caseNumber = caseMatch ? caseMatch[1] : `IMR-${idx + 1}`;
                
                const yearMatch = content.match(/\b(20\d{2})\b/);
                const year = yearMatch ? yearMatch[1] : "";
                
                const reviewMatch = content.match(/\b(Expedited|Standard)\b/i);
                const reviewType = reviewMatch ? reviewMatch[1] : "";
                
                // Extract Category (Medical Necessity, etc.)
                const categoryMatch = content.match(/(Medical\s+Necessity|Experimental|Investigational|Treatment)/i);
                const category = categoryMatch ? categoryMatch[1] : "";
                
                // Extract Decision (Upheld, Overturned, etc.)
                const decisionMatch = content.match(/(Upheld|Overturned|Reversed|Modified)\s+(Decision\s+of\s+Health\s+Plan)?/i);
                const decision = decisionMatch ? decisionMatch[0].trim() : "";
                
                // Extract Diagnosis - look for Cancer / Type pattern
                const diagnosisMatch = content.match(/Cancer\s*\/\s*([^\n]+?)(?=Cancer\s+Care|$)/i);
                const diagnosis = diagnosisMatch ? `Cancer / ${diagnosisMatch[1].trim()}` : "";
                
                // Extract treatment type
                const treatmentMatch = content.match(/Cancer\s+Care\s*\/\s*([^\n]+)/i);
                const treatment = treatmentMatch ? treatmentMatch[1].trim() : "";
                
                // Extract age/gender
                const ageGenderMatch = content.match(/(\d+\s*[-\/]\s*\d+)\s*[-\/]\s*(Male|Female)/i);
                const ageGender = ageGenderMatch ? `${ageGenderMatch[1]} / ${ageGenderMatch[2]}` : "";

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                    className="bg-card rounded-xl p-5 card-shadow border border-border"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">#{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h5 className="font-bold text-foreground">
                            {caseNumber}
                          </h5>
                          {year && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">
                              {year}
                            </span>
                          )}
                          {reviewType && (
                            <span className="text-xs bg-primary/10 px-2 py-0.5 rounded text-primary font-medium">
                              {reviewType}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          California DMHC Independent Medical Review Decision
                        </p>
                      </div>
                    </div>

                    <div className="pl-11 space-y-2 text-sm">
                      {category && (
                        <div className="flex gap-2">
                          <span className="font-semibold text-foreground min-w-[100px]">Category:</span>
                          <span className="text-muted-foreground">{category}</span>
                        </div>
                      )}
                      {decision && (
                        <div className="flex gap-2">
                          <span className="font-semibold text-foreground min-w-[100px]">Decision:</span>
                          <span className="text-muted-foreground">{decision}</span>
                        </div>
                      )}
                      {ageGender && (
                        <div className="flex gap-2">
                          <span className="font-semibold text-foreground min-w-[100px]">Patient:</span>
                          <span className="text-muted-foreground">{ageGender}</span>
                        </div>
                      )}
                      {diagnosis && (
                        <div className="flex gap-2">
                          <span className="font-semibold text-foreground min-w-[100px]">Diagnosis:</span>
                          <span className="text-muted-foreground">{diagnosis}</span>
                        </div>
                      )}
                      {treatment && (
                        <div className="flex gap-2">
                          <span className="font-semibold text-foreground min-w-[100px]">Treatment:</span>
                          <span className="text-muted-foreground">{treatment}</span>
                        </div>
                      )}
                    </div>

                    {case_item.metadata?.keywords && case_item.metadata.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4 pl-11">
                        {case_item.metadata.keywords.slice(0, 6).map((kw: string, i: number) => (
                          <span key={i} className="text-xs bg-accent px-2 py-0.5 rounded-full text-muted-foreground">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-muted/50 rounded-xl p-6 card-shadow border border-border"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-foreground mb-1">
                  No similar cases found in our database
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unfortunately, we couldn't find precedents matching your specific denial. Our analysis is limited without reference cases.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AnalysisView;
