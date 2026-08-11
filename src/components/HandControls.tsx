import { useRef } from 'react';
import { XIcon } from 'lucide-react';
import { useHandInteraction } from '../hooks/useHandInteraction';

type HandControlsProps = {
  filterEnabled: boolean;
  onFilter: () => void;
  onClose: () => void;
};

const HandControls = ({ filterEnabled, onFilter, onClose }: HandControlsProps) => {
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const buttonRef = filterEnabled ? closeButtonRef : filterButtonRef;

  const handleClick = filterEnabled ? onClose : onFilter;

  const isHovering = useHandInteraction(buttonRef, handleClick);

  return (
    <div className='controls'>
      {filterEnabled ? (
        <button
          ref={closeButtonRef}
          className={`close-btn ${isHovering ? 'hover' : ''}`}
          aria-label='Close filter'
        >
          <XIcon className='size-6' />
        </button>
      ) : (
        <button ref={filterButtonRef} className={`filter-btn ${isHovering ? 'hover' : ''}`}>
          Filter
        </button>
      )}
    </div>
  );
};

export default HandControls;
