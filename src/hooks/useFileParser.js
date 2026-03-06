import { useState, useCallback } from 'react';
import { parseTxt } from '../parsers/parseTxt.js';
import { parseMd } from '../parsers/parseMd.js';
import { parsePdf } from '../parsers/parsePdf.js';
import { parseEpub } from '../parsers/parseEpub.js';

export function useFileParser() {
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState(null);

  const parseFile = useCallback(async (file) => {
    setParsing(true);
    setError(null);
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      let text;
      if (ext === 'txt') {
        text = await parseTxt(file);
      } else if (ext === 'md') {
        text = await parseMd(file);
      } else if (ext === 'pdf') {
        text = await parsePdf(file);
      } else if (ext === 'epub') {
        text = await parseEpub(file);
      } else {
        throw new Error(`Unsupported file type: .${ext}`);
      }
      return text;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setParsing(false);
    }
  }, []);

  return { parseFile, parsing, error };
}
