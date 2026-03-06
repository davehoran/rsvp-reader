import { loadPosition } from '../../utils/localStorage.js';

const TYPE_ICONS = { txt: '📄', md: '📝', pdf: '📕', epub: '📗' };

export default function BookCard({ book, onOpen, onDelete }) {
  const saved = loadPosition(book.id);
  const progress = saved && book.wordCount > 0
    ? Math.round((saved.index / book.wordCount) * 100)
    : 0;

  const formatDate = (ts) => new Date(ts).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{TYPE_ICONS[book.fileType] || '📄'}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate" title={book.title}>{book.title}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {book.wordCount.toLocaleString()} words · {formatDate(book.addedAt)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted)' }}>
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: 'var(--accent)' }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onOpen(book, saved?.index || 0)}
          className="flex-1 py-3 rounded-lg font-medium text-sm transition-opacity hover:opacity-80 active:opacity-60"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          {progress > 0 ? 'Resume' : 'Read'}
        </button>
        {progress > 0 && (
          <button
            onClick={() => onOpen(book, 0)}
            className="px-3 py-3 rounded-lg text-sm transition-opacity hover:opacity-80 active:opacity-60"
            style={{ backgroundColor: 'var(--border)', color: 'var(--fg)' }}
            title="Start from beginning"
          >
            ↺
          </button>
        )}
        <button
          onClick={() => onDelete(book.id)}
          className="px-3 py-3 rounded-lg text-sm transition-opacity hover:opacity-80 active:opacity-60"
          style={{ backgroundColor: 'var(--border)', color: 'var(--muted)' }}
          title="Delete book"
          aria-label="Delete book"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
