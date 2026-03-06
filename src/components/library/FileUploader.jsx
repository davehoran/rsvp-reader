import { useRef, useState, useCallback } from 'react';
import { useFileParser } from '../../hooks/useFileParser.js';
import { useLibrary } from '../../hooks/useLibrary.js';

const ACCEPTED = '.txt,.md,.pdf,.epub';

export default function FileUploader() {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState(null); // null | 'parsing' | 'saving' | { error }
  const { parseFile } = useFileParser();
  const { addBook } = useLibrary();

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setStatus('parsing');
    try {
      const text = await parseFile(file);
      setStatus('saving');
      await addBook(file, text);
      setStatus(null);
    } catch (err) {
      setStatus({ error: err.message });
    }
  }, [parseFile, addBook]);

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const isLoading = status === 'parsing' || status === 'saving';

  return (
    <div>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="w-full rounded-xl border-2 border-dashed py-8 px-4 text-center transition-colors cursor-pointer disabled:opacity-50 min-h-[120px] flex flex-col items-center justify-center gap-2"
        style={{
          borderColor: dragging ? 'var(--accent)' : 'var(--border)',
          backgroundColor: dragging ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--surface)',
          color: 'var(--muted)',
        }}
      >
        {isLoading ? (
          <>
            <span className="text-2xl animate-spin">⟳</span>
            <span className="text-sm">{status === 'parsing' ? 'Parsing file…' : 'Saving to library…'}</span>
          </>
        ) : (
          <>
            <span className="text-3xl">📖</span>
            <span className="font-medium" style={{ color: 'var(--fg)' }}>Add a book</span>
            <span className="text-sm">Drop file here or tap to browse</span>
            <span className="text-xs">TXT · MD · PDF · EPUB</span>
          </>
        )}
      </button>
      {status?.error && (
        <p className="mt-2 text-sm text-red-500">{status.error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        onChange={onInputChange}
        className="hidden"
      />
    </div>
  );
}
