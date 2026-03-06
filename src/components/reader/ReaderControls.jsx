import { useSettings } from '../../contexts/SettingsContext.jsx';

const WPM_STEP = 25;
const WPM_MIN = 50;
const WPM_MAX = 1500;

export default function ReaderControls({
  isPlaying,
  onToggle,
  onSkipBack,
  onSkipForward,
  onOpenSettings,
}) {
  const { settings, update } = useSettings();
  const { wpm } = settings;

  const changeWpm = (delta) => {
    update({ wpm: Math.min(WPM_MAX, Math.max(WPM_MIN, wpm + delta)) });
  };

  const btnBase = "flex items-center justify-center rounded-xl font-medium transition-opacity hover:opacity-80 active:opacity-60 select-none";
  const iconBtn = `${btnBase} w-12 h-12 text-xl`;
  const primaryBtn = `${btnBase} w-16 h-16 text-2xl`;

  return (
    <div className="w-full px-4">
      {/* WPM display */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => changeWpm(-WPM_STEP)}
          className={iconBtn}
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          aria-label="Decrease WPM"
        >
          −
        </button>
        <div className="text-center min-w-[80px]">
          <div className="text-2xl font-bold tabular-nums">{wpm}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>WPM</div>
        </div>
        <button
          onClick={() => changeWpm(WPM_STEP)}
          className={iconBtn}
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          aria-label="Increase WPM"
        >
          +
        </button>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onOpenSettings}
          className={iconBtn}
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          aria-label="Settings"
        >
          ⚙
        </button>
        <button
          onClick={onSkipBack}
          className={iconBtn}
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          aria-label="Skip back 10 words"
        >
          ⏮
        </button>
        <button
          onClick={onToggle}
          className={primaryBtn}
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={onSkipForward}
          className={iconBtn}
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          aria-label="Skip forward 10 words"
        >
          ⏭
        </button>
        <div className="w-12" /> {/* spacer for balance */}
      </div>
    </div>
  );
}
