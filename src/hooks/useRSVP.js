import { useState, useEffect, useCallback, useRef } from 'react';
import { useReader } from '../contexts/ReaderContext.jsx';
import { useSettings } from '../contexts/SettingsContext.jsx';
import { getWordDelay } from '../engine/timing.js';
import { savePosition } from '../utils/localStorage.js';

export function useRSVP() {
  const { readerState, setCurrentIndex } = useReader();
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const saveRef = useRef(null);

  const { words, currentIndex, bookId } = readerState || {};
  const { wpm, chunkSize } = settings;

  // Auto-save position periodically while playing
  useEffect(() => {
    if (!isPlaying || !bookId) return;
    saveRef.current = setInterval(() => {
      if (currentIndex != null) savePosition(bookId, currentIndex);
    }, 2000);
    return () => clearInterval(saveRef.current);
  }, [isPlaying, bookId, currentIndex]);

  // Save on pause/unmount
  useEffect(() => {
    return () => {
      if (bookId && currentIndex != null) savePosition(bookId, currentIndex);
    };
  }, [bookId, currentIndex]);

  // Core RSVP timer
  useEffect(() => {
    if (!isPlaying || !words || currentIndex >= words.length) {
      if (currentIndex >= (words?.length ?? 0)) setIsPlaying(false);
      return;
    }
    const token = words[currentIndex];
    const delay = getWordDelay(token, chunkSize, wpm);
    const timer = setTimeout(() => {
      setCurrentIndex(i => i + chunkSize);
    }, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, wpm, chunkSize, words, setCurrentIndex]);

  const play = useCallback(() => {
    if (words && currentIndex < words.length) setIsPlaying(true);
  }, [words, currentIndex]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (bookId && currentIndex != null) savePosition(bookId, currentIndex);
  }, [bookId, currentIndex]);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const seek = useCallback((index) => {
    setCurrentIndex(index);
  }, [setCurrentIndex]);

  const skipForward = useCallback((n = 10) => {
    setCurrentIndex(i => i + n);
  }, [setCurrentIndex]);

  const skipBack = useCallback((n = 10) => {
    setCurrentIndex(i => i - n);
  }, [setCurrentIndex]);

  const skipToSentence = useCallback((direction) => {
    if (!readerState) return;
    const { words: w, currentIndex: ci } = readerState;
    if (direction > 0) {
      // find next sentence end
      let next = ci + 1;
      while (next < w.length && !w[next - 1]?.isSentenceEnd) next++;
      setCurrentIndex(Math.min(next, w.length - 1));
    } else {
      // find previous sentence start
      let prev = ci - 1;
      while (prev > 0 && !w[prev - 1]?.isSentenceEnd) prev--;
      setCurrentIndex(Math.max(0, prev));
    }
  }, [readerState, setCurrentIndex]);

  return {
    isPlaying,
    play,
    pause,
    toggle,
    seek,
    skipForward,
    skipBack,
    skipToSentence,
    currentIndex: currentIndex ?? 0,
    totalWords: words?.length ?? 0,
  };
}
