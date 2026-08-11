import { useCallback, useState } from 'react';

import HandCanvas from './components/HandCanvas';
import HandControls from './components/HandControls';
import { useFilterChange } from './hooks/useFilterChange';
import { FILTER_COUNT } from './utils/filterEffect';

const App = () => {
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [filterIndex, setFilterIndex] = useState(0);

  const handleFilter = useCallback(() => {
    setFilterEnabled(true);
  }, []);

  const handleClose = useCallback(() => {
    setFilterEnabled(false);
    setFilterIndex(0);
  }, []);

  const handleFilterChange = useCallback(() => {
    setFilterIndex((current) => (current + 1) % FILTER_COUNT);
  }, []);

  useFilterChange(filterEnabled, handleFilterChange);

  return (
    <div className='video-container'>
      <HandCanvas filterEnabled={filterEnabled} filterIndex={filterIndex} />

      <HandControls
        filterEnabled={filterEnabled}
        onFilter={handleFilter}
        onClose={handleClose}
      />
    </div>
  );
};

export default App;
