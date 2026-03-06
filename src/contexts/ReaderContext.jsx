import { createContext, useContext, useState, useCallback } from 'react';

const ReaderContext = createContext(null);

export function ReaderProvider({ children }) {
  const [readerState, setReaderState] = useState(null);
  // readerState: { bookId, title, words: WordToken[], currentIndex }

  const openBook = useCallback((bookId, title, words, startIndex = 0) => {
    setReaderState({ bookId, title, words, currentIndex: startIndex });
  }, []);

  const closeBook = useCallback(() => {
    setReaderState(null);
  }, []);

  const setCurrentIndex = useCallback((indexOrUpdater) => {
    setReaderState(prev => {
      if (!prev) return prev;
      const next = typeof indexOrUpdater === 'function'
        ? indexOrUpdater(prev.currentIndex)
        : indexOrUpdater;
      return { ...prev, currentIndex: Math.max(0, Math.min(next, prev.words.length - 1)) };
    });
  }, []);

  return (
    <ReaderContext.Provider value={{ readerState, openBook, closeBook, setCurrentIndex }}>
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error('useReader must be inside ReaderProvider');
  return ctx;
}
