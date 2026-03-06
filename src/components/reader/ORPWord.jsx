import { getOrpIndex } from '../../engine/orp.js';

export default function ORPWord({ word }) {
  if (!word) return (
    <div className="rsvp-container">
      <span className="rsvp-pre" />
      <span className="rsvp-pivot">·</span>
      <span className="rsvp-post" />
    </div>
  );

  const pivotIdx = getOrpIndex(word);
  const pre = word.slice(0, pivotIdx);
  const pivot = word[pivotIdx] || '';
  const post = word.slice(pivotIdx + 1);

  return (
    <div className="rsvp-container" aria-label={word} role="text">
      <span className="rsvp-pre">{pre}</span>
      <span className="rsvp-pivot">{pivot}</span>
      <span className="rsvp-post">{post}</span>
    </div>
  );
}
