import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';

// Define the context type
interface ToastContextType {
  showToast: (message: string) => void;
  closeToast: () => void;
}

// Create the context with the defined type
const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastState, setToastState] = useState({
    open: false,
    message: '',
  });

  const showToast = useCallback((message: string) => {
    setToastState({ open: true, message });
  }, []);

  const closeToast = useCallback(() => {
    setToastState({ open: false, message: '' });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      <Snackbar
        open={toastState.open}
        onClose={closeToast}
        autoHideDuration={3000}
        message={toastState.message}
      />
    </ToastContext.Provider>
  );
};
