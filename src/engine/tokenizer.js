/**
 * WordToken shape:
 * {
 *   word: string,          // display text
 *   isSentenceEnd: bool,   // ends with . ! ?
 *   isClauseEnd: bool,     // ends with , ; :
 *   isParagraphEnd: bool,  // followed by paragraph break
 * }
 *
 * Returns { words: WordToken[], sentenceStarts: number[] }
 */
export function tokenize(text) {
  // Split into paragraphs
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 0);
  const words = [];

  for (let pi = 0; pi < paragraphs.length; pi++) {
    const para = paragraphs[pi].trim();
    const rawWords = para.split(/\s+/).filter(w => w.length > 0);

    for (let wi = 0; wi < rawWords.length; wi++) {
      const raw = rawWords[wi];
      const isLast = wi === rawWords.length - 1;

      const isSentenceEnd = /[.!?]['"""»)]*$/.test(raw);
      const isClauseEnd = /[,;:]$/.test(raw);
      const isParagraphEnd = isLast && pi < paragraphs.length - 1;

      words.push({ word: raw, isSentenceEnd, isClauseEnd, isParagraphEnd });
    }
  }

  // Build sentence start indices (index of the first word in each sentence)
  const sentenceStarts = [0];
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].isSentenceEnd || words[i].isParagraphEnd) {
      sentenceStarts.push(i + 1);
    }
  }

  return { words, sentenceStarts };
}
