import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Copy, Check, ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AppealLetterProps {
  onBack: () => void;
}

const appealContent = `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

Grievances & Appeals Department
InsurCo Health Plans
P.O. Box 14092
Lansing, MI 48901

RE: Appeal of Denial — Claim #MCH-2026-44891
Member: Maria G. | Member ID: INS-4478221
Service: Comprehensive Biomarker Panel Testing (CPT 81455)
Date of Service: January 15, 2026

Dear Appeals Review Board,

I am writing to formally appeal the denial of coverage for comprehensive biomarker panel testing issued on January 22, 2026, under the classification "Experimental/Investigational." This denial is factually incorrect and legally non-compliant.

LEGAL BASIS FOR APPEAL

1. Michigan House Bill 565 — Biomarker Testing Coverage Act (effective January 1, 2026)
   Section 15-142 of the Michigan Insurance Code now REQUIRES all state-regulated health plans to cover biomarker testing for patients diagnosed with Stage III or Stage IV cancer when the test is:
   • FDA-approved or cleared
   • Recommended by NCCN Clinical Practice Guidelines
   • Ordered by the treating oncologist

   All three criteria are met in this case.

2. Prohibition on "Experimental" Classification
   HB 565 explicitly prohibits insurers from classifying FDA-approved biomarker diagnostics as "Experimental" or "Investigational" when they meet the above criteria. Your denial letter violates this provision.

3. NCCN Guidelines Support
   The National Comprehensive Cancer Network (NCCN) recommends comprehensive biomarker testing for all Stage IV cancer patients to guide treatment selection. This is standard-of-care, not experimental.

CLINICAL JUSTIFICATION

Patient Maria G. has been diagnosed with Stage IV adenocarcinoma. Her treating oncologist, Dr. [Oncologist Name], has ordered comprehensive biomarker panel testing to identify actionable mutations that would determine the appropriate targeted therapy or immunotherapy regimen. Without this testing, treatment selection would be empirical rather than evidence-based, potentially resulting in:

   • Delayed effective treatment
   • Unnecessary exposure to ineffective therapies and their side effects
   • Increased overall cost of care due to trial-and-error treatment approaches

REQUEST

I respectfully request that InsurCo:
1. Reverse the denial of Claim #MCH-2026-44891
2. Authorize coverage for comprehensive biomarker panel testing immediately
3. Confirm compliance with Michigan HB 565 going forward

Please be advised that if this appeal is not resolved within 30 days, I intend to file a complaint with the Michigan Department of Insurance and Financial Services (DIFS) citing violation of HB 565, Section 15-142.

I have attached supporting documentation including the denial letter, oncology records, and a copy of the relevant statute for your reference.

Sincerely,

_______________________________
Maria G.
Member ID: INS-4478221

CC: Michigan Department of Insurance and Financial Services
CC: ACS Cancer Action Network — Michigan Chapter
CC: Dr. [Oncologist Name], Treating Physician`;

const AppealLetter = ({ onBack }: AppealLetterProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(appealContent);
    setCopied(true);
    toast.success("Appeal letter copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([appealContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Appeal_Letter_Maria_G_MCH-2026-44891.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Appeal letter downloaded");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Appeal Letter — Maria G.</title>
            <style>
              body { font-family: 'Times New Roman', serif; max-width: 700px; margin: 40px auto; line-height: 1.6; white-space: pre-wrap; font-size: 13px; }
            </style>
          </head>
          <body>${appealContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <section className="py-16 px-4 surface-gradient min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to results
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Generated Appeal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-2">
              Your Appeal Letter is Ready
            </h2>
            <p className="text-muted-foreground">
              This letter cites Michigan HB 565 and NCCN guidelines to challenge Maria's denial.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <Button variant="hero" size="lg" onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download Letter
            </Button>
            <Button variant="outline" size="lg" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </Button>
            <Button variant="outline" size="lg" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>

          {/* Letter Preview */}
          <div className="bg-card rounded-xl card-shadow border border-border overflow-hidden">
            <div className="bg-muted/50 px-6 py-3 border-b border-border flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Appeal_Letter_Maria_G_MCH-2026-44891.txt
              </span>
            </div>
            <div className="p-6 sm:p-8 max-h-[600px] overflow-y-auto">
              <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                {appealContent}
              </pre>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-6 max-w-lg mx-auto leading-relaxed">
            This letter was generated based on publicly available policy data and is not legal advice.
            Please review with your healthcare provider or legal counsel before submitting.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AppealLetter;
