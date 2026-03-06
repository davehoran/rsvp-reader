import { lsGet, lsSet } from './localStorage.js';

const KEY = 'bookmarks';

export function getBookmarks(bookId) {
  const all = lsGet(KEY, {});
  return all[bookId] || [];
}

export function addBookmark(bookId, index, label) {
  const all = lsGet(KEY, {});
  const list = all[bookId] || [];
  list.push({ index, label: label || `Position ${index}`, createdAt: Date.now() });
  all[bookId] = list;
  lsSet(KEY, all);
  return list;
}

export function removeBookmark(bookId, createdAt) {
  const all = lsGet(KEY, {});
  all[bookId] = (all[bookId] || []).filter(b => b.createdAt !== createdAt);
  lsSet(KEY, all);
  return all[bookId];
}

export function exportBookmarks() {
  const all = lsGet('bookmarks', {});
  const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rsvp-bookmarks.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importBookmarks(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        lsSet('bookmarks', data);
        resolve(data);
      } catch {
        reject(new Error('Invalid bookmark file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
