import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { HandTrackingProvider } from './context/HandTrackingContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HandTrackingProvider>
      <App />
    </HandTrackingProvider>
  </StrictMode>,
);
