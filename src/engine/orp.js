/**
 * Returns the 0-based index of the ORP (Optimal Recognition Point) pivot character.
 * Based on Spritz-style lookup table.
 */
export function getOrpIndex(word) {
  const len = word.length;
  if (len === 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}
