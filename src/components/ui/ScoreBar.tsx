export default function ScoreBar({
  label,
  value,
  isFake,
}: {
  label: string;
  value: number;
  isFake: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between font-mono text-xs text-inkDim">
        <span>{label}</span>
        <span className="text-ink font-bold">{value.toFixed(2)}%</span>
      </div>
      <div className="h-2 bg-bgMain rounded-full border border-line overflow-hidden w-full">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isFake ? "bg-errorRed" : "bg-accentCyan"
          }`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}