const MARQUEE_ITEMS = [
  "FAKE", "REAL", "DEEPFAKE", "FIND THE TRUTH", "SYNTHETIC", 
  "AUTHENTIC", "VERIFY", "ALTERED", "ORIGINAL", "MANIPULATED"
];

export default function Marquee({ reverse = false, offsetClass = "" }: { reverse?: boolean; offsetClass?: string }) {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]; // Double it up for smooth infinite scrolling

  return (
    <div className={`overflow-hidden whitespace-nowrap ${offsetClass}`}>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee-scroll 38s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-scroll 46s linear infinite reverse;
        }
      `}</style>
      
      <div className={`inline-flex gap-10 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {items.map((item, i) => (
          <span 
            key={i} 
            className="inline-flex items-center gap-10 font-mono font-bold text-4xl md:text-6xl tracking-wider text-bgMain"
            style={{ WebkitTextStroke: '1px var(--tw-colors-inkDim, #8b9a98)' }}
          >
            {item}
            <span className="text-accentAmber text-[0.4em] mb-1" aria-hidden="true">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}