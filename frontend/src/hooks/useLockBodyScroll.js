import { useEffect } from 'react';

const useLockBodyScroll = (lock = true) => {
  useEffect(() => {
    if (!lock) return;

    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
};

export default useLockBodyScroll;
