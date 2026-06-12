import React, { useState, useRef, useCallback } from "react";
import { Upload, Link2, Newspaper, ScanSearch, XCircle, Loader2, Film, ImageIcon, X } from "lucide-react";
import { analyseUpload, analyseUrl, factCheck } from "../../api/Scanner";
import type { ScanMode, MediaScanResult, NewsResult } from "../../types";
import MediaResultPanel from './MediaResult';
import NewsResultPanel from './NewsResult';

export default function ScanConsole() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaResult, setMediaResult] = useState<MediaScanResult | null>(null);
  const [newsResult, setNewsResult] = useState<NewsResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => { setMediaResult(null); setNewsResult(null); setError(null); };

  const handleFile = (f: File) => {
    reset(); setFile(f); setText("");
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const isUrl = (s: string) => /^https?:\/\//i.test(s.trim());
  const detectUrlType = (url: string) => /\.(mp4|mov|webm|avi)(\?|$)/i.test(url) || /youtube|youtu\.be|tiktok|vimeo/i.test(url) ? "video" : "image";

  const handleSubmit = async () => {
    reset(); setLoading(true);
    try {
      if (file) {
        setMediaResult(await analyseUpload(file));
      } else if (isUrl(text)) {
        setMediaResult(await analyseUrl(text.trim(), detectUrlType(text)));
      } else if (text.trim()) {
        setNewsResult(await factCheck(text.trim()));
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An error occurred during analysis.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputKind: ScanMode = file ? "media" : isUrl(text) ? "url" : "news";
  const canSubmit = !loading && (!!file || text.trim().length > 0);

  return (
    <div className="relative z-10 w-full max-w-2xl flex flex-col gap-4">
      <div 
        className={`bg-bgRaised border rounded-xl p-4 md:p-6 transition-colors relative ${dragOver ? 'border-accentAmber border-dashed' : 'border-line'}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <div className="flex items-center gap-2 mb-3 text-inkDim">
          <ScanSearch size={16} className="text-accentAmber" />
          <span className="font-mono text-xs tracking-widest">SENTINEL://scan-input</span>
          <span className={`ml-auto font-mono text-[10px] tracking-widest px-2 py-0.5 rounded-full border ${inputKind === 'media' ? 'text-accentAmber border-accentAmber' : inputKind === 'url' ? 'text-accentCyan border-accentCyan' : 'text-inkDim border-line'}`}>
            {inputKind.toUpperCase()}
          </span>
        </div>

        {file ? (
          <div className="flex items-center gap-3 bg-bgMain border border-line rounded-lg p-3 font-mono text-sm mb-2">
            {file.type.startsWith("video") ? <Film size={16} /> : <ImageIcon size={16} />}
            <span className="flex-1 truncate">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-inkDim hover:text-accentAmber transition-colors">
              <X size={18} />
            </button>
          </div>
        ) : (
          <textarea
            className="w-full bg-transparent border-none text-ink font-display text-base md:text-lg resize-none outline-none min-h-[80px] placeholder:text-inkDim"
            placeholder="Paste an image/video link, drop a file, or type a headline…"
            value={text}
            onChange={(e) => { setText(e.target.value); reset(); }}
          />
        )}

        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center md:justify-start gap-2 bg-transparent border border-line text-inkDim font-mono text-xs px-4 py-2.5 rounded-lg hover:text-ink hover:border-ink transition-colors w-full md:w-auto">
            <Upload size={14} /> Upload file
          </button>
          <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) handleFile(e.target.files[0]) }} />

          <div className="flex items-center justify-center gap-2 text-inkDim font-mono text-[11px] flex-1">
            <Link2 size={12} /> <span>link</span> <span className="text-line">·</span>
            <Newspaper size={12} /> <span>headline</span>
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit} className="flex items-center justify-center gap-2 bg-accentAmber text-bgMain font-mono font-bold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity w-full md:w-auto cursor-pointer disabled:cursor-not-allowed">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Scanning</> : <><ScanSearch size={16} /> Analyse</>}
          </button>
        </div>

        {dragOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bgMain/90 rounded-xl text-accentAmber font-mono text-sm pointer-events-none">
            <Upload size={28} /> Drop to scan
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 font-mono text-xs p-3 rounded-lg border text-errorRed border-errorBg bg-errorRed/10">
          <XCircle size={16} /> {error}
        </div>
      )}

      {loading && (
        <div className="w-full flex flex-col gap-3 px-2 mt-2">
          <div className="w-full h-1 bg-line rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-accentAmber animate-[slide_1.5s_ease-in-out_infinite]" style={{ animationName: 'slide' }}></div>
          </div>
          <style>{`@keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
          <p className="font-mono text-xs text-center text-inkDim">Running detection pipeline...</p>
        </div>
      )}

      {mediaResult && !loading && <MediaResultPanel data={mediaResult} />}
      {newsResult && !loading && <NewsResultPanel data={newsResult} />}
    </div>
  );
}