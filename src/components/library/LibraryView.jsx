import { useCallback } from 'react';
import { useLibrary } from '../../hooks/useLibrary.js';
import { useReader } from '../../contexts/ReaderContext.jsx';
import { useSettings } from '../../contexts/SettingsContext.jsx';
import BookCard from './BookCard.jsx';
import FileUploader from './FileUploader.jsx';

export default function LibraryView() {
  const { books, deleteBook, getBookWords } = useLibrary();
  const { openBook } = useReader();
  const { settings, update } = useSettings();

  const handleOpen = useCallback(async (book, startIndex) => {
    try {
      const { words } = await getBookWords(book.id);
      openBook(book.id, book.title, words, startIndex);
    } catch (err) {
      alert('Failed to load book: ' + err.message);
    }
  }, [getBookWords, openBook]);

  const handleDelete = useCallback(async (id) => {
    if (!confirm('Delete this book?')) return;
    await deleteBook(id);
  }, [deleteBook]);

  const toggleTheme = () => {
    update({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">RSVP Reader</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
              Speed reading, locally
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl hover:opacity-70 transition-opacity"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* File uploader */}
        <div className="mb-6">
          <FileUploader />
        </div>

        {/* Library list */}
        {books === undefined ? (
          <div className="text-center py-12" style={{ color: 'var(--muted)' }}>Loading…</div>
        ) : books.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
            <p className="text-lg mb-1">No books yet</p>
            <p className="text-sm">Upload a file above to get started</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onOpen={handleOpen}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
