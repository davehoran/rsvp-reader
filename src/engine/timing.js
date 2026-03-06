/**
 * Returns the delay in milliseconds for a given word token.
 * Longer pauses at sentence/paragraph boundaries improve comprehension.
 */
export function getWordDelay(token, chunkSize, wpm) {
  let delay = (60000 / wpm) * chunkSize;
  if (!token) return Math.round(delay);

  if (token.isParagraphEnd) delay *= 2.5;
  else if (token.isSentenceEnd) delay *= 2.0;
  else if (token.isClauseEnd)   delay *= 1.4;

  return Math.round(delay);
}
