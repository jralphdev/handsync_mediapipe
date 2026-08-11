import { useCallback, useState } from 'react';

import HandCanvas from './components/HandCanvas';
import HandControls from './components/HandControls';

const App = () => {
  const [filterEnabled, setFilterEnabled] = useState(false);

  const handleFilter = useCallback(() => {
    setFilterEnabled(true);
  }, []);

  const handleClose = useCallback(() => {
    setFilterEnabled(false);
  }, []);

  return (
    <div className='video-container'>
      <HandCanvas filterEnabled={filterEnabled} />

      <HandControls
        filterEnabled={filterEnabled}
        onFilter={handleFilter}
        onClose={handleClose}
      />
    </div>
  );
};

export default App;
