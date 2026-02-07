import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuidedEntryProps {
  onSubmit: (file: File | null, text: string) => void;
}

const GuidedEntry = ({ onSubmit }: GuidedEntryProps) => {
  const [letterText, setLetterText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setUploadedFile(file);
      setLetterText("");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploadedFile(file);
      setLetterText("");
    }
  };

  return (
    <section className="min-h-screen surface-gradient py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Tell us what got in the way of your care.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            Upload a denial letter or paste the text below. We'll take it from there.
          </p>
        </motion.div>

        {/* File Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`
            border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer
            transition-all duration-300 mb-6
            ${isDragging
              ? "border-primary bg-accent scale-[1.02]"
              : fileName
                ? "border-primary/50 bg-accent/50"
                : "border-border hover:border-primary/50 hover:bg-accent/30"
            }
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          {fileName ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">{fileName}</p>
                <p className="text-sm text-muted-foreground">File loaded successfully</p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium text-foreground mb-1">
                Drop your denial letter here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse • PDF, image, or document
              </p>
            </>
          )}
        </motion.div>

        {/* Text Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium text-foreground mb-2">
            Or paste the letter text
          </label>
          <textarea
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            placeholder="Paste the denial letter or any correspondence here..."
            className="w-full h-48 rounded-xl border border-border bg-card p-4 text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        </motion.div>

        {/* Reassurance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-start gap-3 bg-accent/60 rounded-lg p-4 mb-8"
        >
          <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-accent-foreground leading-relaxed">
            No medical or policy knowledge needed. We'll translate everything into plain language.
          </p>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="hero"
            size="lg"
            onClick={() => onSubmit(uploadedFile, letterText)}
            disabled={!uploadedFile && !letterText.trim()}
            className="group"
          >
            Analyze my letter
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GuidedEntry;
