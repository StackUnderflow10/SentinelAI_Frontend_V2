import { Film, ImageIcon, AlertTriangle } from 'lucide-react';
import type { MediaScanResult } from '../../types';
import ScoreBar from '../ui/ScoreBar';
import VerdictBadge from '../ui/VerdictBadge';

export default function MediaResult({ data }: { data: MediaScanResult }) {
  const isVideo = data.type === "video";
  const fakeProb = data.fake_probability ?? (data.result === "fake" ? parseFloat(data.confidence) : 100 - parseFloat(data.confidence));
  const realProb = data.real_probability ?? (data.result === "real" ? parseFloat(data.confidence) : 100 - parseFloat(data.confidence));

  return (
    <div className="bg-bgRaised border border-line rounded-xl p-5 flex flex-col gap-5 w-full text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-sm tracking-wide text-inkDim uppercase">
          {isVideo ? <Film size={18} /> : <ImageIcon size={18} />}
          <span>{isVideo ? "Video analysis" : "Image analysis"}</span>
        </div>
        
        <VerdictBadge result={data.result} />
      </div>

      {data.low_confidence && (
        <div className="flex items-center gap-2 font-mono text-xs p-3 rounded-lg border text-warnYellow border-warnBg bg-warnYellow/10">
          <AlertTriangle size={14} /> Low sample size — too few frames were analysed.
        </div>
      )}

      <div className="flex flex-col gap-3">
        <ScoreBar label="Synthetic probability" value={fakeProb} isFake={true} />
        <ScoreBar label="Authentic probability" value={realProb} isFake={false} />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-mono text-xs tracking-widest uppercase text-inkDim">Analysis Details</h4>
        <ul className="pl-5 list-disc flex flex-col gap-1 text-sm text-ink leading-relaxed">
          {data.raw_score !== null && (
            <li>
              Model output score of <code className="font-mono text-xs bg-bgMain border border-line px-1 rounded text-accentAmber">{data.raw_score}</code> 
              against a threshold of <code className="font-mono text-xs bg-bgMain border border-line px-1 rounded text-accentAmber">{data.threshold_used ?? 0.5}</code>.
              {data.confidence_band && ` Distance rated as ${data.confidence_band} confidence.`}
            </li>
          )}
          {isVideo ? (
            <>
              <li>Analysed <strong>{data.frames_analysed}</strong> frames with detectable faces.</li>
              <li><strong>{data.fake_frame_ratio}%</strong> of frames crossed the synthetic threshold.</li>
              <li>Frequency-domain branch flags blending seams, unnatural blinks, and high-frequency GAN noise.</li>
            </>
          ) : (
            <li>Pixel-level analysis detected patterns consistent with {data.result === "fake" ? "AI-generated imagery" : "an unaltered photograph"}.</li>
          )}
        </ul>
      </div>
    </div>
  );
}