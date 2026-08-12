import { useCallback, useEffect, useState } from 'react';

import HandCanvas from './components/HandCanvas';
import HandControls from './components/HandControls';
import { useFilterChange } from './hooks/useFilterChange';
import { FILTER_COUNT } from './utils/filterEffect';
import { PianoAudio } from './lib/pianoAudio';
import { usePiano } from './hooks/usePiano';

const App = () => {
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [pianoEnabled, setPianoEnabled] = useState(false);
  const [filterIndex, setFilterIndex] = useState(0);

  const [pianoAudio] = useState(() => new PianoAudio());

  useEffect(() => {
    return () => {
      pianoAudio.destroy();
    };
  }, [pianoAudio]);

  const handleFilter = useCallback(() => {
    setFilterEnabled(true);
  }, []);

  const handlePiano = useCallback(async () => {
    await pianoAudio.start();

    setPianoEnabled(true);
    setFilterEnabled(false);
  }, [pianoAudio]);

  const handleClose = useCallback(() => {
    setFilterEnabled(false);
    setPianoEnabled(false);
    setFilterIndex(0);

    pianoAudio.stopAll();
  }, [pianoAudio]);

  const handleFilterChange = useCallback(() => {
    setFilterIndex((current) => (current + 1) % FILTER_COUNT);
  }, []);

  useFilterChange(filterEnabled, handleFilterChange);

  usePiano(pianoEnabled, pianoAudio);

  return (
    <div className='video-container'>
      <HandCanvas filterEnabled={filterEnabled} filterIndex={filterIndex} />

      <HandControls
        filterEnabled={filterEnabled}
        pianoEnabled={pianoEnabled}
        onFilter={handleFilter}
        onPiano={handlePiano}
        onClose={handleClose}
      />
    </div>
  );
};

export default App;
