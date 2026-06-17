import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Marquee from "./components/ui/Marquee";
import ScanConsole from "./components/scanner/ScanConsole";
import AnimatedHeroText from "./components/ui/AnimatedHeroText";


export default function App() {
  return (
    <div className="min-h-screen bg-bgMain text-ink font-display flex flex-col">
      <Header />

      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 overflow-hidden">
        {/* Marquee background — three rows, masked at edges */}
        <div
          className="absolute inset-0 flex flex-col justify-evenly pointer-events-none select-none"
          aria-hidden="true"
          style={{
            opacity: 0.13,
            maskImage:
              "radial-gradient(ellipse 80% 65% at center, transparent 25%, black 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 65% at center, transparent 25%, black 85%)",
          }}
        >
          <Marquee />
          <Marquee reverse offsetClass="-translate-x-24" />
          <Marquee />
        </div>

        {/* Hero copy */}
        <div className="relative z-10 text-center max-w-xl mb-10">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-accentAmber mb-4">
            Forensic media analysis
          </p>
          <AnimatedHeroText />
          <p className="font-mono text-sm md:text-base text-inkDim leading-relaxed max-w-md mx-auto">
            Drop an image or video, paste a link, or type a headline. Sentinel
            runs it through a deepfake-detection and fact-checking pipeline and
            shows you exactly why it reached its verdict.
          </p>
        </div>

        <ScanConsole />
      </section>

      <Footer />
    </div>
  );
}