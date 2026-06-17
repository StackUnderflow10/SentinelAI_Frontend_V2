import { useState, useEffect, useRef } from "react";

const PHRASES = [
  { line1: "Is reality", line2: "doubted?", line2Class: "text-accentCyan" },
  { line1: "Verify with", line2: "Sentinel.", line2Class: "text-accentCyan" },
];

export default function AnimatedHeroText() {
  const [index, setIndex] = useState(0);
  const [dispScale, setDispScale] = useState(0);
  const [baseFreq, setBaseFreq] = useState(0);
  const animFrameRef = useRef<number>(0);
  const swappedRef = useRef(false);
  const indexRef = useRef(0); // mirror of index for use inside rAF closure

  useEffect(() => {
    const interval = setInterval(startMorph, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  const startMorph = () => {
    cancelAnimationFrame(animFrameRef.current);
    swappedRef.current = false;
    let start: number | null = null;
    const duration = 700;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);

      // bell curve: 0 → peak at 0.5 → 0
      const t = Math.sin(progress * Math.PI);
      const freq = t * 0.05;
      const scale = t * 50;

      setBaseFreq(freq);
      setDispScale(scale);

      // swap exactly once, at the peak of distortion
      if (progress >= 0.5 && !swappedRef.current) {
        swappedRef.current = true;
        const next = (indexRef.current + 1) % PHRASES.length;
        indexRef.current = next;
        setIndex(next);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setBaseFreq(0);
        setDispScale(0);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const phrase = PHRASES[index];

  return (
    <div className="mb-5 min-h-[110px] md:min-h-[140px] flex justify-center items-center">
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="hero-morph" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="turbulence"
              baseFrequency={baseFreq}
              numOctaves="3"
              seed="8"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={dispScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <h1
        className="font-mono font-display font-extrabold text-[clamp(2.6rem,8vw,4.5rem)] leading-[1.05] tracking-tight w-full text-center select-none"
        style={{ filter: dispScale > 0.5 ? "url(#hero-morph)" : "none" }}
      >
        {phrase.line1}
        <br />
        <span className={phrase.line2Class}>{phrase.line2}</span>
      </h1>
    </div>
  );
}