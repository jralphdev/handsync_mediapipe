import { useRef } from 'react';
import { Music2Icon, SparkleIcon, XIcon } from 'lucide-react';
import { useHandInteraction } from '../hooks/useHandInteraction';
import type { HandControlsProps } from '../types';

const HandControls = ({
  filterEnabled,
  pianoEnabled,
  onFilter,
  onPiano,
  onClose,
}: HandControlsProps) => {
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const pianoButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const active = filterEnabled || pianoEnabled;

  const closeHover = useHandInteraction(closeButtonRef, onClose);
  const filterHover = useHandInteraction(filterButtonRef, onFilter);
  const pianoHover = useHandInteraction(pianoButtonRef, onPiano);

  return (
    <div className='controls'>
      {active ? (
        <button
          ref={closeButtonRef}
          className={`close-btn ${closeHover ? 'hover' : ''}`}
          aria-label='Close'
        >
          <XIcon className='size-7' />
        </button>
      ) : (
        <>
          <button
            ref={filterButtonRef}
            className={`control-btn ${filterHover ? 'hover' : ''}`}
          >
            <SparkleIcon className='size-4.5' />
            <span>Filter Effects</span>
          </button>

          <button ref={pianoButtonRef} className={`control-btn ${pianoHover ? 'hover' : ''}`}>
            <Music2Icon className='size-4.5' />
            <span>Piano</span>
          </button>
        </>
      )}
    </div>
  );
};

export default HandControls;
