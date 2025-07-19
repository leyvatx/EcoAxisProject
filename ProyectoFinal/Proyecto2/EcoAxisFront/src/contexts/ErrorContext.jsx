import React, { createContext, useContext, useState } from 'react';
import ErrorModal from '../components/UI/ErrorModal';
import SuccessModal from '../components/UI/SuccessModal';

const NotificationContext = createContext();

export const useError = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useError debe usarse dentro de NotificationProvider');
  }
  return { showError: context.showError };
};

export const useSuccess = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useSuccess debe usarse dentro de NotificationProvider');
  }
  return { showSuccess: context.showSuccess };
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState({ isOpen: false, message: '' });
  const [success, setSuccess] = useState({ isOpen: false, message: '' });

  const showError = (message) => {
    setError({ isOpen: true, message });
  };

  const hideError = () => {
    setError({ isOpen: false, message: '' });
  };

  const showSuccess = (message) => {
    setSuccess({ isOpen: true, message });
  };

  const hideSuccess = () => {
    setSuccess({ isOpen: false, message: '' });
  };

  return (
    <NotificationContext.Provider value={{ showError, showSuccess }}>
      {children}
      <ErrorModal 
        isOpen={error.isOpen} 
        message={error.message} 
        onClose={hideError} 
      />
      <SuccessModal 
        isOpen={success.isOpen} 
        message={success.message} 
        onClose={hideSuccess} 
      />
    </NotificationContext.Provider>
  );
};
