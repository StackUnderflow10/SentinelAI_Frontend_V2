import { Newspaper, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { NewsResult } from "../../types";

export default function NewsResultPanel({ data }: { data: NewsResult }) {
  const v = data.verdict;
  const isFake = v === "False";
  const isReal = v === "True";

  return (
    <div className="bg-bgRaised border border-line rounded-xl p-5 flex flex-col gap-5 w-full text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-sm tracking-wide text-inkDim uppercase">
          <Newspaper size={18} />
          <span>Claim analysis</span>
        </div>

        <div
          className={`flex items-center gap-2 font-mono font-bold text-sm tracking-wide px-4 py-2 rounded-full border
          ${
            isFake
              ? "text-errorRed border-errorBg bg-errorRed/10"
              : isReal
              ? "text-accentCyan border-successBg bg-accentCyan/10"
              : "text-warnYellow border-warnBg bg-warnYellow/10"
          }`}
        >
          {isFake ? (
            <XCircle size={18} />
          ) : isReal ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          {v.toUpperCase()}
        </div>
      </div>

      {/* Confidence notice */}
      <div className="flex items-center gap-2 font-mono text-xs p-3 rounded-lg border text-accentCyan border-successBg bg-accentCyan/10">
        Pipeline confidence:{" "}
        <strong className="ml-1">{data.metadata.confidence}</strong>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-2">
        <h4 className="font-mono text-xs tracking-widest uppercase text-inkDim">
          Summary
        </h4>
        <p className="text-sm text-ink leading-relaxed">{data.summary}</p>
        {data.nuance && (
          <p className="text-sm text-inkDim mt-1">
            <strong>Context:</strong> {data.nuance}
          </p>
        )}
      </div>

      {/* Sources */}
      <div className="flex flex-col gap-3">
        <h4 className="font-mono text-xs tracking-widest uppercase text-inkDim">
          Sources checked
        </h4>
        <div className="flex flex-col gap-3">
          {data.sources.map((s, i) => (
            <div
              key={i}
              className="bg-bgMain border border-line rounded-lg p-3 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full border
                  ${
                    s.stance === "Supports"
                      ? "text-accentCyan border-successBg"
                      : s.stance === "Refutes"
                      ? "text-errorRed border-errorBg"
                      : s.stance === "Partial"
                      ? "text-warnYellow border-warnBg"
                      : "text-inkDim border-line"
                  }`}
                >
                  {s.stance}
                </span>
                <span className="font-mono text-xs text-inkDim">{s.domain}</span>
              </div>
              <p className="text-sm font-bold text-ink">{s.title}</p>
              <p className="text-xs text-inkDim leading-relaxed">{s.snippet}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}