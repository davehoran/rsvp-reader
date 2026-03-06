import Dexie from 'dexie';

const db = new Dexie('rsvp-reader');

db.version(1).stores({
  // text and sentenceStarts are NOT indexed (too large, never queried by value)
  books: '++id, title, fileType, addedAt, wordCount',
});

export default db;
