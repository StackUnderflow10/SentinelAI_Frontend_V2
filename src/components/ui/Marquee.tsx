const MARQUEE_ITEMS = [
  "FAKE",
  "REAL",
  "DEEPFAKE",
  "FIND THE TRUTH",
  "SYNTHETIC",
  "AUTHENTIC",
  "VERIFY",
  "ALTERED",
  "ORIGINAL",
  "MANIPULATED",
];

export default function Marquee({
  reverse = false,
  offsetClass = "",
}: {
  reverse?: boolean;
  offsetClass?: string;
}) {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${offsetClass}`}>
      <div
        className={`inline-flex gap-10 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 font-mono font-bold tracking-wider"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              color: "rgba(255, 255, 255, 0.12)",
            }}
          >
            {item}
            <span
              style={{ fontSize: "0.4em", color: "rgba(255, 107, 53, 0.3)" }}
              aria-hidden="true"
            >
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}