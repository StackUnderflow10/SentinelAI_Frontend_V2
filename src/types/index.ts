export type ScanMode = "media" | "url" | "news";

export interface MediaScanResult {
  type: "image" | "video";
  result: "real" | "fake" | "unknown";
  confidence: string;
  raw_score: number | null;
  low_confidence: boolean;
  frames_analysed?: number;
  fake_frame_ratio?: number;
  fake_probability?: number;
  real_probability?: number;
  confidence_band?: "HIGH" | "MEDIUM" | "LOW";
  threshold_used?: number;
  original_url?: string;
  error?: string;
}

export interface NewsResult {
  verdict: "True" | "False" | "Misleading" | "Partially True" | "Unverified" | "Disputed";
  summary: string;
  nuance: string | null;
  sources: {
    title: string;
    domain: string;
    stance: "Supports" | "Refutes" | "Neutral" | "Partial";
    snippet: string;
  }[];
  metadata: {
    search_query: string;
    confidence: "High" | "Medium" | "Low";
    sources_found: number;
    trusted_sources_used: number;
  };
  error?: string;
}