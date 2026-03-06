import { useReader } from '../../contexts/ReaderContext.jsx';
import { useSettings } from '../../contexts/SettingsContext.jsx';
import ORPWord from './ORPWord.jsx';

export default function RSVPDisplay() {
  const { readerState } = useReader();
  const { settings } = useSettings();
  const { words, currentIndex } = readerState || {};
  const { chunkSize } = settings;

  // Collect the current chunk of words
  const chunk = words
    ? words.slice(currentIndex, currentIndex + chunkSize).map(t => t.word)
    : [];

  const isSingleWord = chunkSize === 1;

  return (
    <div
      className="flex items-center justify-center w-full px-4"
      style={{ minHeight: '8rem' }}
    >
      <div className="relative w-full max-w-sm">
        {/* Top tick — only shown for single-word ORP mode */}
        {isSingleWord && (
          <div
            className="absolute left-1/2 -top-3 w-0.5 h-3"
            style={{ backgroundColor: 'var(--orp-color)', transform: 'translateX(-50%)' }}
            aria-hidden="true"
          />
        )}

        {/* Word display box */}
        <div
          className="rounded-lg px-4 py-6 overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          {isSingleWord ? (
            <ORPWord word={chunk[0] || null} />
          ) : (
            <div
              className="text-center"
              style={{
                fontFamily: 'monospace',
                fontSize: 'clamp(1.2rem, 4vw, 2rem)',
              }}
              aria-label={chunk.join(' ')}
              role="text"
            >
              {chunk.join(' ') || '·'}
            </div>
          )}
        </div>

        {/* Bottom tick — only shown for single-word ORP mode */}
        {isSingleWord && (
          <div
            className="absolute left-1/2 -bottom-3 w-0.5 h-3"
            style={{ backgroundColor: 'var(--orp-color)', transform: 'translateX(-50%)' }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
