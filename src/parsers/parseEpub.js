export async function parseEpub(file) {
  const arrayBuffer = await file.arrayBuffer();
  // Dynamic import avoids Vite global/window.zip errors at module load time
  const Epub = (await import('epubjs')).default;
  const book = Epub(arrayBuffer);
  await book.ready;

  const texts = [];
  for (const item of book.spine.spineItems) {
    try {
      const doc = await item.load(book.load.bind(book));
      const body = doc.querySelector('body');
      if (body) {
        texts.push(body.innerText || body.textContent || '');
      }
      item.unload();
    } catch {
      // skip unloadable spine items
    }
  }

  book.destroy();
  return texts.join('\n\n');
}
