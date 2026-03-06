export default function ProgressBar({ current, total, onSeek }) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(Math.round(ratio * total));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') onSeek(Math.min(current + 50, total - 1));
    if (e.key === 'ArrowLeft')  onSeek(Math.max(current - 50, 0));
  };

  return (
    <div className="w-full px-4">
      <div
        className="relative h-3 rounded-full cursor-pointer group"
        style={{ backgroundColor: 'var(--border)' }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Reading progress"
        tabIndex={0}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all pointer-events-none"
          style={{ width: `${pct}%`, backgroundColor: 'var(--accent)' }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full -translate-y-1/2 -translate-x-1/2 shadow transition-transform group-hover:scale-125"
          style={{
            left: `${pct}%`,
            backgroundColor: 'var(--accent)',
            border: '2px solid var(--bg)',
          }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
        <span>{current.toLocaleString()} / {total.toLocaleString()} words</span>
        <span>{pct.toFixed(1)}%</span>
      </div>
    </div>
  );
}
