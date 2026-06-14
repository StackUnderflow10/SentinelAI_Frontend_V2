import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  Link2,
  Newspaper,
  ScanSearch,
  XCircle,
  Loader2,
  Film,
  ImageIcon,
  X,
} from "lucide-react";
import { analyseUpload, analyseUrl, factCheck } from "../../api/scanner";
import type { ScanMode, MediaScanResult, NewsResult } from "../../types";
import MediaResult from "./MediaResult";
import NewsResultPanel from "./NewsResult";

function detectUrlType(url: string): "image" | "video" {
  const lower = url.toLowerCase();
  if (/\.(mp4|mov|webm|avi|mkv)(\?|$)/.test(lower)) return "video";
  if (/youtube\.com|youtu\.be|tiktok\.com|vimeo\.com/.test(lower))
    return "video";
  return "image";
}

export default function ScanConsole() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaResult, setMediaResult] = useState<MediaScanResult | null>(null);
  const [newsResult, setNewsResult] = useState<NewsResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setMediaResult(null);
    setNewsResult(null);
    setError(null);
  };

  const handleFile = (f: File) => {
    reset();
    setFile(f);
    setText("");
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const isUrl = (s: string) => /^https?:\/\//i.test(s.trim());

  const handleSubmit = async () => {
    reset();
    setLoading(true);
    try {
      if (file) {
        setMediaResult(await analyseUpload(file));
      } else if (isUrl(text)) {
        setMediaResult(await analyseUrl(text.trim(), detectUrlType(text)));
      } else if (text.trim()) {
        setNewsResult(await factCheck(text.trim()));
      }
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputKind: ScanMode = file ? "media" : isUrl(text) ? "url" : "news";
  const canSubmit = !loading && (!!file || text.trim().length > 0);

  return (
    <div className="relative z-10 w-full max-w-2xl flex flex-col gap-4">
      {/* Input box */}
      <div
        className={`bg-bgRaised border rounded-xl p-4 md:p-5 transition-colors relative ${
          dragOver ? "border-accentAmber border-dashed" : "border-line"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {/* Console header */}
        <div className="flex items-center gap-2 mb-3 text-inkDim">
          <ScanSearch size={16} className="text-accentAmber" />
          <span className="font-mono text-xs tracking-widest">
            SENTINEL://scan-input
          </span>
          <span
            className={`ml-auto font-mono text-[10px] tracking-widest px-2 py-0.5 rounded-full border ${
              inputKind === "media"
                ? "text-accentAmber border-accentAmber"
                : inputKind === "url"
                ? "text-accentCyan border-accentCyan"
                : "text-inkDim border-line"
            }`}
          >
            {inputKind === "media"
              ? "FILE"
              : inputKind === "url"
              ? "URL"
              : "CLAIM"}
          </span>
        </div>

        {/* File chip or textarea */}
        {file ? (
          <div className="flex items-center gap-3 bg-bgMain border border-line rounded-lg p-3 font-mono text-sm mb-1">
            {file.type.startsWith("video") ? (
              <Film size={16} />
            ) : (
              <ImageIcon size={16} />
            )}
            <span className="flex-1 truncate text-ink">{file.name}</span>
            <button
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                reset();
              }}
              className="text-inkDim hover:text-accentAmber transition-colors"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <textarea
            className="w-full bg-transparent border-none text-ink font-display text-base resize-none outline-none min-h-[48px] placeholder:text-inkDim leading-relaxed"
            placeholder="Paste an image/video link, drop a file, or type a headline to fact-check…"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              reset();
            }}
            rows={2}
          />
        )}

        {/* Actions row */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center md:justify-start gap-2 bg-transparent border border-line text-inkDim font-mono text-xs px-4 py-2.5 rounded-lg hover:text-ink hover:border-inkDim transition-colors w-full md:w-auto"
          >
            <Upload size={14} /> Upload file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          <div className="flex items-center justify-center gap-2 text-inkDim font-mono text-[11px] flex-1">
            <Link2 size={12} />
            <span>image / video link</span>
            <span className="text-line">·</span>
            <Newspaper size={12} />
            <span>headline text</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center justify-center gap-2 bg-accentAmber text-bgMain font-mono font-bold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity w-full md:w-auto cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Scanning…
              </>
            ) : (
              <>
                <ScanSearch size={16} /> Analyse
              </>
            )}
          </button>
        </div>

        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bgMain/90 rounded-xl text-accentAmber font-mono text-sm pointer-events-none">
            <Upload size={28} />
            <span>Drop to scan</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 font-mono text-xs p-3 rounded-lg border text-errorRed border-errorBg bg-errorRed/10">
          <XCircle size={14} />
          {error}
        </div>
      )}

      {/* Loading bar */}
      {loading && (
        <div className="w-full flex flex-col gap-3 px-1 mt-1">
          <div className="w-full h-[3px] bg-line rounded-full overflow-hidden">
            <div
              className="w-2/5 h-full bg-accentAmber rounded-full"
              style={{ animation: "loading-slide 1.2s ease-in-out infinite" }}
            />
          </div>
          <style>{`
            @keyframes loading-slide {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(250%); }
            }
          `}</style>
          <p className="font-mono text-xs text-center text-inkDim">
            Running detection pipeline — this may take a moment for video.
          </p>
        </div>
      )}

      {/* Results */}
      {mediaResult && !loading && <MediaResult data={mediaResult} />}
      {newsResult && !loading && <NewsResultPanel data={newsResult} />}
    </div>
  );
}