import ScanConsole from './components/scanner/ScanConsole';
import { ScanSearch } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-bgMain text-ink font-display flex flex-col">
      {/* Header Inline for simplicity */}
      <header className="flex items-center justify-between p-5 border-b border-line bg-bgMain z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-accentAmber text-bgMain rounded-md">
            <ScanSearch size={18} strokeWidth={2.5} />
          </div>
          <span className="font-mono font-bold tracking-widest text-sm">SENTINEL</span>
          <span className="font-mono text-[10px] text-inkDim tracking-widest border border-line rounded px-1.5 py-0.5">AI</span>
        </div>
        {/* Placeholder for Wallet Connect / Login */}
        <button className="font-mono text-xs border border-line bg-bgRaised px-4 py-2 rounded-full hover:border-accentAmber transition-colors">
          Connect
        </button>
      </header>

      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 overflow-x-hidden">
        
        {/* Minimalist Background Design */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
           <div className="w-[800px] h-[800px] rounded-full border border-inkDim absolute"></div>
           <div className="w-[600px] h-[600px] rounded-full border border-inkDim absolute"></div>
           <div className="w-[400px] h-[400px] rounded-full border border-inkDim absolute"></div>
        </div>

        <div className="relative z-10 text-center max-w-xl mb-10">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-accentAmber mb-4">
            Forensic media analysis
          </p>
          <h1 className="font-extrabold text-4xl md:text-5xl leading-[1.1] tracking-tight mb-4">
            Is it real?<br />
            <span className="text-accentCyan">Find out.</span>
          </h1>
          <p className="text-sm md:text-base text-inkDim leading-relaxed">
            Drop an image or video, paste a link, or type a headline. Sentinel evaluates the input and provides a transparent verdict.
          </p>
        </div>

        <ScanConsole />
      </section>

      {/* Footer Inline */}
      <footer className="text-center p-6 border-t border-line font-mono text-[10px] text-inkDim">
        <span>Sentinel AI — automated analysis is a signal, not a verdict.</span>
      </footer>
    </div>
  );
}