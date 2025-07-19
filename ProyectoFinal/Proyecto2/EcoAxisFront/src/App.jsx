import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './components/UI/NavBar';
import Footer from './components/landing/Footer';
import { ErrorProvider } from './contexts/ErrorContext';

// No mover este componente
const App = () => {
  return (
    <ErrorProvider>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </ErrorProvider>
  );
}

export default App
