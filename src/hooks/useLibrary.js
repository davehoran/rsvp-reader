import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db/database.js';
import { tokenize } from '../engine/tokenizer.js';

export function useLibrary() {
  const books = useLiveQuery(() =>
    db.books.orderBy('addedAt').reverse().toArray(),
    [], []
  );

  const addBook = useCallback(async (file, text) => {
    const { words, sentenceStarts } = tokenize(text);
    await db.books.add({
      title: file.name.replace(/\.[^.]+$/, ''),
      fileType: file.name.split('.').pop().toLowerCase(),
      addedAt: Date.now(),
      wordCount: words.length,
      text,
      sentenceStarts: JSON.stringify(sentenceStarts),
    });
  }, []);

  const deleteBook = useCallback(async (id) => {
    await db.books.delete(id);
  }, []);

  const getBook = useCallback(async (id) => {
    return db.books.get(id);
  }, []);

  const getBookWords = useCallback(async (id) => {
    const book = await db.books.get(id);
    if (!book) throw new Error('Book not found');
    const { words, sentenceStarts } = tokenize(book.text);
    return { words, sentenceStarts };
  }, []);

  return { books, addBook, deleteBook, getBook, getBookWords };
}
