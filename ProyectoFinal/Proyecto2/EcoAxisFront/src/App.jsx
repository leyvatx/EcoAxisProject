import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './components/UI/NavBar';
import Footer from './components/landing/Footer';

// No mover este componente
const App = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App
