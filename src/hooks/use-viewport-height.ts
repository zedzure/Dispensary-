'use client';

import { useState, useEffect } from 'react';

export function useViewportHeight() {
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const setViewportHeight = () => {
      // We are using a CSS variable --vh which is set to window.innerHeight * 0.01
      // in the global CSS file. This hook just triggers a re-render when it changes.
      // The actual height calculation happens in CSS via `calc(var(--vh, 1vh) * 100)`.
      setVh(window.innerHeight);
    };

    // Set the initial value
    setViewportHeight();

    // Add event listeners
    window.addEventListener('resize', setViewportHeight);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setViewportHeight);
    }
    
    // Cleanup
    return () => {
        window.removeEventListener('resize', setViewportHeight);
        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', setViewportHeight);
        }
    };
  }, []);

  return vh;
}
