import { SettingsProvider } from './contexts/SettingsContext.jsx';
import { ReaderProvider, useReader } from './contexts/ReaderContext.jsx';
import LibraryView from './components/library/LibraryView.jsx';
import ReaderView from './components/reader/ReaderView.jsx';

function AppInner() {
  const { readerState } = useReader();
  return readerState ? <ReaderView /> : <LibraryView />;
}

export default function App() {
  return (
    <SettingsProvider>
      <ReaderProvider>
        <AppInner />
      </ReaderProvider>
    </SettingsProvider>
  );
}
