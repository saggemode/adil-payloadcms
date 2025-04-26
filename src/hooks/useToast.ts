/**
 * Simple toast notification hook
 */
export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // For simplicity, use console.log in this example
    // In a real app, you'd use a proper toast notification library
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    if (typeof window !== 'undefined') {
      // Create temporary toast element
      const toast = document.createElement('div');
      toast.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
      } text-white`;
      toast.innerText = message;
      
      // Add to document
      document.body.appendChild(toast);
      
      // Remove after 3 seconds
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
    }
  };
  
  return {
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
  };
}; 