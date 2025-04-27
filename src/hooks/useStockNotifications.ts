// Minimal hook that maintains API compatibility without notifications
export const useStockNotifications = () => {
  // Return dummy functions 
  return {
    setStockThreshold: (threshold: number) => {
      // Store threshold in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('stockThreshold', threshold.toString());
      }
    },
    enableWebSocket: () => {
      // No-op function
      console.log('[Stub] Stock monitoring enabled');
    }
  };
}; 