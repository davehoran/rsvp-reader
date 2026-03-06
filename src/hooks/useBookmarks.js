import { useState, useCallback } from 'react';
import { getBookmarks, addBookmark, removeBookmark } from '../utils/bookmarkIO.js';

export function useBookmarks(bookId) {
  const [bookmarks, setBookmarks] = useState(() =>
    bookId ? getBookmarks(bookId) : []
  );

  const add = useCallback((index, label) => {
    if (!bookId) return;
    const updated = addBookmark(bookId, index, label);
    setBookmarks([...updated]);
  }, [bookId]);

  const remove = useCallback((createdAt) => {
    if (!bookId) return;
    const updated = removeBookmark(bookId, createdAt);
    setBookmarks([...updated]);
  }, [bookId]);

  const refresh = useCallback(() => {
    if (bookId) setBookmarks(getBookmarks(bookId));
  }, [bookId]);

  return { bookmarks, add, remove, refresh };
}
