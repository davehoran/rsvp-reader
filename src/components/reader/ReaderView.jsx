import { useState, useEffect, useCallback } from 'react';
import { useReader } from '../../contexts/ReaderContext.jsx';
import { useRSVP } from '../../hooks/useRSVP.js';
import { useBookmarks } from '../../hooks/useBookmarks.js';
import RSVPDisplay from './RSVPDisplay.jsx';
import ProgressBar from './ProgressBar.jsx';
import ReaderControls from './ReaderControls.jsx';
import SettingsPanel from '../settings/SettingsPanel.jsx';

export default function ReaderView() {
  const { readerState, closeBook } = useReader();
  const { title, bookId } = readerState || {};
  const {
    isPlaying, toggle, seek,
    skipForward, skipBack,
    currentIndex, totalWords,
  } = useRSVP();
  const { bookmarks, add: addBookmark } = useBookmarks(bookId);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarkLabel, setBookmarkLabel] = useState('');

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Don't fire when typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          toggle();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward(e.shiftKey ? 50 : 10);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBack(e.shiftKey ? 50 : 10);
          break;
        case '+':
        case '=':
          // WPM increase handled in controls via context
          break;
        case 'b':
          addBookmark(currentIndex, `Bookmark at ${currentIndex}`);
          break;
        case 'Escape':
          closeBook();
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, skipForward, skipBack, closeBook, addBookmark, currentIndex]);

  const handleClose = useCallback(() => {
    closeBook();
  }, [closeBook]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:opacity-70 transition-opacity flex-shrink-0"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          aria-label="Back to library"
        >
          ←
        </button>
        <h1 className="font-semibold truncate flex-1">{title}</h1>
        <button
          onClick={() => addBookmark(currentIndex, `Bookmark ${bookmarks.length + 1}`)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:opacity-70 transition-opacity flex-shrink-0"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          aria-label="Add bookmark"
          title="Add bookmark (B)"
        >
          🔖
        </button>
      </header>

      {/* Main RSVP display */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
        <RSVPDisplay />
      </main>

      {/* Bottom controls */}
      <footer className="flex flex-col gap-4 pb-8 px-0 flex-shrink-0">
        <ProgressBar
          current={currentIndex}
          total={totalWords}
          onSeek={seek}
        />
        <ReaderControls
          isPlaying={isPlaying}
          onToggle={toggle}
          onSkipBack={() => skipBack(10)}
          onSkipForward={() => skipForward(10)}
          onOpenSettings={() => setShowSettings(true)}
        />
        {/* Keyboard hint */}
        <p className="text-center text-xs px-4" style={{ color: 'var(--muted)' }}>
          Space: play/pause · ← →: skip · B: bookmark · Esc: library
        </p>
      </footer>

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
