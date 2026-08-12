import { createContext, useContext } from 'react';
import { useHandLandmarker } from '../hooks/useHandLandMarker';
import type { HandTrackingContextValue } from '../types';

const HandTrackingContext = createContext<HandTrackingContextValue | null>(null);

export const HandTrackingProvider = ({ children }: { children: React.ReactNode }) => {
  const tracking = useHandLandmarker();

  return (
    <HandTrackingContext.Provider value={tracking}>{children}</HandTrackingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useHandTracking = () => {
  const context = useContext(HandTrackingContext);

  if (!context) {
    throw new Error('useHandTracking must be used inside HandTrackingProvider');
  }

  return context;
};
