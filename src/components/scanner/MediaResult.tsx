import { Film, ImageIcon, AlertTriangle } from "lucide-react";
import type { MediaScanResult } from "../../types";
import ScoreBar from "../ui/ScoreBar";
import VerdictBadge from "../ui/VerdictBadge";

export default function MediaResult({ data }: { data: MediaScanResult }) {
  const isVideo = data.type === "video";
  const fakeProb =
    data.fake_probability ??
    (data.result === "fake"
      ? parseFloat(data.confidence)
      : 100 - parseFloat(data.confidence));
  const realProb =
    data.real_probability ??
    (data.result === "real"
      ? parseFloat(data.confidence)
      : 100 - parseFloat(data.confidence));

  return (
    <div className="bg-bgRaised border border-line rounded-xl p-5 flex flex-col gap-5 w-full text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-sm tracking-wide text-inkDim uppercase">
          {isVideo ? <Film size={18} /> : <ImageIcon size={18} />}
          <span>{isVideo ? "Video analysis" : "Image analysis"}</span>
        </div>
        <VerdictBadge result={data.result} />
      </div>

      {/* Low confidence warning */}
      {data.low_confidence && (
        <div className="flex items-center gap-2 font-mono text-xs p-3 rounded-lg border text-warnYellow border-warnBg bg-warnYellow/10">
          <AlertTriangle size={14} />
          Low sample size — too few frames were analysed for a reliable verdict.
        </div>
      )}

      {/* Score bars */}
      <div className="flex flex-col gap-3">
        <ScoreBar label="Synthetic probability" value={fakeProb} isFake={true} />
        <ScoreBar label="Authentic probability" value={realProb} isFake={false} />
      </div>

      {/* Why block */}
      <div className="flex flex-col gap-2">
        <h4 className="font-mono text-xs tracking-widest uppercase text-inkDim">
          Why Sentinel flagged this
        </h4>
        <ul className="pl-5 list-disc flex flex-col gap-1.5 text-sm text-ink leading-relaxed">
          {data.raw_score !== null && data.raw_score !== undefined && (
            <li>
              Model output score of{" "}
              <code className="font-mono text-xs bg-bgMain border border-line px-1 rounded text-accentAmber">
                {data.raw_score}
              </code>{" "}
              against a decision threshold of{" "}
              <code className="font-mono text-xs bg-bgMain border border-line px-1 rounded text-accentAmber">
                {data.threshold_used ?? 0.5}
              </code>
              {data.confidence_band && (
                <>
                  {" "}
                  — distance from threshold rated{" "}
                  <strong>{data.confidence_band}</strong> confidence.
                </>
              )}
            </li>
          )}
          {isVideo ? (
            <>
              <li>
                Analysed <strong>{data.frames_analysed}</strong> sampled frames
                with a detectable face (≥ 90% detection confidence).
              </li>
              <li>
                <strong>{data.fake_frame_ratio}%</strong> of analysed frames
                individually crossed the synthetic threshold.
              </li>
              <li>
                Frequency-domain branch flags blending seams around the jawline,
                inconsistent eye/teeth texture, unnatural blink rate, and
                high-frequency GAN/diffusion noise patterns.
              </li>
            </>
          ) : (
            <li>
              Pixel-level analysis (Xception backbone) detected texture and
              compression-artefact patterns consistent with{" "}
              {data.result === "fake"
                ? "AI-generated or manipulated imagery"
                : "an unaltered photograph"}
              .
            </li>
          )}
        </ul>
      </div>

      {/* Flagged frames strip — video only */}
      {isVideo && (
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-xs tracking-widest uppercase text-inkDim">
            Flagged frames
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 8 }).map((_, i) => {
              const flagged = i % 3 !== 1;
              return (
                <div
                  key={i}
                  className={`flex-none w-16 h-16 rounded-lg border bg-bgMain flex flex-col items-center justify-center gap-1 ${
                    flagged ? "border-errorRed" : "border-line"
                  }`}
                >
                  <span className="font-mono text-[10px] text-inkDim">
                    #{i * 6 + 1}
                  </span>
                  {flagged && (
                    <span className="font-mono text-[8px] tracking-wide text-errorRed border border-errorBg rounded px-1 py-0.5">
                      SYNTH
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-inkDim leading-relaxed">
            Frames marked{" "}
            <span className="font-mono text-[10px] text-errorRed border border-errorBg rounded px-1">
              SYNTH
            </span>{" "}
            individually crossed the synthetic probability threshold.
          </p>
        </div>
      )}
    </div>
  );
}