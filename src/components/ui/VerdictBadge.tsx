import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

type VerdictType = "fake" | "real" | "unknown";

export default function VerdictBadge({ result, labelOverride }: { result: VerdictType, labelOverride?: string }) {
  if (result === "fake") {
    return (
      <div className="flex items-center gap-2 font-mono font-bold text-sm tracking-wide px-4 py-2 rounded-full border text-errorRed border-errorBg bg-errorRed/10">
        <XCircle size={18} strokeWidth={2.5} /> 
        {labelOverride || "SYNTHETIC DETECTED"}
      </div>
    );
  }
  
  if (result === "real") {
    return (
      <div className="flex items-center gap-2 font-mono font-bold text-sm tracking-wide px-4 py-2 rounded-full border text-accentCyan border-successBg bg-accentCyan/10">
        <CheckCircle2 size={18} strokeWidth={2.5} /> 
        {labelOverride || "AUTHENTIC"}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 font-mono font-bold text-sm tracking-wide px-4 py-2 rounded-full border text-warnYellow border-warnBg bg-warnYellow/10">
      <AlertTriangle size={18} strokeWidth={2.5} /> 
      {labelOverride || "INCONCLUSIVE"}
    </div>
  );
}