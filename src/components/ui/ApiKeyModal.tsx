import { useState } from "react";
import {
  X,
  Key,
  Wallet,
  CreditCard,
  ChevronRight,
  Loader2,
  Copy,
  CheckCircle2,
} from "lucide-react";

type Step = "project" | "billing" | "complete";

export default function ApiKeyModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("project");
  const [projectName, setProjectName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"solana" | "card" | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const generatedKey = "sk_sentinel_live_8fK3x9P2mNqV4bL1cR5tY7wZ";

  const handleGenerate = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      setStep("complete");
    }, 1500);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bgMain/80 backdrop-blur-sm px-4">
      <div className="bg-bgRaised border border-line rounded-2xl w-full max-w-md p-6 flex flex-col gap-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-inkDim hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-accentAmber mb-2 flex items-center gap-2">
            <Key size={12} /> API Access
          </p>
          <h2 className="font-display font-extrabold text-xl text-ink">
            {step === "project" && "Create new secret key"}
            {step === "billing" && "Select billing method"}
            {step === "complete" && "Key generated successfully"}
          </h2>
          <p className="text-inkDim text-sm mt-1 leading-relaxed">
            {step === "project" && "Keys allow you to authenticate API requests from your backend servers."}
            {step === "billing" && "API usage is billed at $0.001 per scan. Pay-as-you-go."}
            {step === "complete" && "Please copy this key and save it somewhere safe. For security reasons, we cannot show it to you again."}
          </p>
        </div>

        {/* Step 1: Project Name */}
        {step === "project" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-inkDim tracking-widest uppercase">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && projectName.trim() && setStep("billing")}
                placeholder="e.g., Production Backend"
                className="bg-bgMain border border-line rounded-lg px-4 py-3 text-ink text-sm font-mono outline-none focus:border-accentAmber transition-colors placeholder:text-inkDim/50"
                autoFocus
              />
            </div>
            <button
              onClick={() => setStep("billing")}
              disabled={!projectName.trim()}
              className="flex items-center justify-center gap-2 bg-ink text-bgMain font-mono font-bold text-sm px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-30 transition-opacity cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              Continue to billing <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Billing Selection */}
        {step === "billing" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3">
              {/* Solana Option */}
              <button
                onClick={() => setPaymentMethod("solana")}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  paymentMethod === "solana"
                    ? "border-accentCyan bg-accentCyan/5"
                    : "border-line bg-bgMain hover:border-inkDim"
                }`}
              >
                <div className={`mt-0.5 ${paymentMethod === "solana" ? "text-accentCyan" : "text-inkDim"}`}>
                  <Wallet size={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-sm font-bold text-ink">Solana Wallet</span>
                  <span className="text-xs text-inkDim">Pay seamlessly in USDC or SOL via Phantom, Solflare, etc.</span>
                </div>
              </button>

              {/* Fiat Option */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-accentAmber bg-accentAmber/5"
                    : "border-line bg-bgMain hover:border-inkDim"
                }`}
              >
                <div className={`mt-0.5 ${paymentMethod === "card" ? "text-accentAmber" : "text-inkDim"}`}>
                  <CreditCard size={18} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-sm font-bold text-ink">Debit / Credit Card</span>
                  <span className="text-xs text-inkDim">Standard fiat billing via Stripe. Monthly invoicing.</span>
                </div>
              </button>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setStep("project")}
                className="flex items-center justify-center bg-transparent border border-line text-inkDim hover:text-ink font-mono font-bold text-sm px-6 py-3 rounded-lg transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={!paymentMethod || loading}
                className="flex-1 flex items-center justify-center gap-2 bg-accentAmber text-bgMain font-mono font-bold text-sm px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Key size={16} /> Generate API Key
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success & Key Display */}
        {step === "complete" && (
          <div className="flex flex-col gap-5">
            <div className="bg-bgMain border border-line rounded-xl p-4 flex flex-col gap-3">
              <span className="font-mono text-[10px] tracking-widest text-inkDim uppercase">
                Project: {projectName}
              </span>
              <div className="flex items-center gap-3">
                <code className="flex-1 font-mono text-sm text-accentCyan break-all">
                  {generatedKey}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="flex-none p-2 rounded-lg bg-bgRaised border border-line text-inkDim hover:text-ink hover:border-inkDim transition-colors cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCircle2 size={16} className="text-successBg" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex w-full items-center justify-center bg-ink text-bgMain font-mono font-bold text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              I've saved it securely
            </button>
          </div>
        )}
      </div>
    </div>
  );
}