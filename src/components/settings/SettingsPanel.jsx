import Modal from '../shared/Modal.jsx';
import { useSettings } from '../../contexts/SettingsContext.jsx';
import { exportBookmarks, importBookmarks } from '../../utils/bookmarkIO.js';
import { useRef } from 'react';

export default function SettingsPanel({ open, onClose }) {
  const { settings, update } = useSettings();
  const importRef = useRef(null);

  const row = "flex items-center justify-between py-3";
  const label = "font-medium";
  const sublabel = "text-xs mt-0.5";

  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="flex flex-col divide-y" style={{ divideColor: 'var(--border)' }}>
        {/* WPM */}
        <div className={row}>
          <div>
            <div className={label}>Words per minute</div>
            <div className={sublabel} style={{ color: 'var(--muted)' }}>{settings.wpm} WPM</div>
          </div>
          <input
            type="range"
            min={50}
            max={1500}
            step={25}
            value={settings.wpm}
            onChange={e => update({ wpm: Number(e.target.value) })}
            className="w-32 accent-[var(--accent)]"
          />
        </div>

        {/* Chunk size */}
        <div className={row}>
          <div>
            <div className={label}>Words per flash</div>
            <div className={sublabel} style={{ color: 'var(--muted)' }}>
              {settings.chunkSize === 1 ? '1 word (default)' : `${settings.chunkSize} words`}
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => update({ chunkSize: n })}
                className="w-9 h-9 rounded-lg font-medium text-sm transition-colors"
                style={{
                  backgroundColor: settings.chunkSize === n ? 'var(--accent)' : 'var(--border)',
                  color: settings.chunkSize === n ? '#fff' : 'var(--fg)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className={row}>
          <div className={label}>Theme</div>
          <div className="flex gap-1">
            {['light', 'dark'].map(t => (
              <button
                key={t}
                onClick={() => update({ theme: t })}
                className="px-3 h-9 rounded-lg text-sm capitalize transition-colors"
                style={{
                  backgroundColor: settings.theme === t ? 'var(--accent)' : 'var(--border)',
                  color: settings.theme === t ? '#fff' : 'var(--fg)',
                }}
              >
                {t === 'light' ? '☀️ Light' : '🌙 Dark'}
              </button>
            ))}
          </div>
        </div>

        {/* Bookmarks */}
        <div className="py-3 flex flex-col gap-2">
          <div className={label}>Bookmarks</div>
          <div className="flex gap-2">
            <button
              onClick={exportBookmarks}
              className="flex-1 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--border)', color: 'var(--fg)' }}
            >
              Export JSON
            </button>
            <button
              onClick={() => importRef.current?.click()}
              className="flex-1 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--border)', color: 'var(--fg)' }}
            >
              Import JSON
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) { await importBookmarks(f); alert('Bookmarks imported!'); }
                e.target.value = '';
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
