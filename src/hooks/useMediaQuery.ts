'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    const media = window.matchMedia(query);
    
    // Update the state with the match
    const updateMatch = () => {
      setMatches(media.matches);
    };
    
    // Set initial value
    updateMatch();
    
    // Add listener for subsequent updates
    media.addEventListener('change', updateMatch);
    
    // Clean up the listener on unmount
    return () => {
      media.removeEventListener('change', updateMatch);
    };
  }, [query]);
  
  return matches;
}