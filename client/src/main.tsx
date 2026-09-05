import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';

function ResponsiveToaster() {
  const [position, setPosition] = useState<'bottom-right' | 'top-center'>(() =>
    typeof window !== 'undefined' && window.innerWidth >= 768
      ? 'bottom-right'
      : 'top-center'
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => {
      setPosition(e.matches ? 'bottom-right' : 'top-center');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <Toaster
      position={position}
      toastOptions={{
        style: {
          fontFamily: 'Inter, sans-serif',
        },
      }}
      richColors
    />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ResponsiveToaster />
  </StrictMode>
);
