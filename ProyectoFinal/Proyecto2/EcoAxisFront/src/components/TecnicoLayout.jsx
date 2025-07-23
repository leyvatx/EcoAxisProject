import React from 'react';
import { Outlet } from 'react-router-dom';
import TecnicoSidebar from './TecnicoSidebar';
import TecnicoTopBar from './TecnicoTopBar';
import './TecnicoLayout.css';

const TecnicoLayout = () => {
  return (
    <div className="tecnico-layout">
      <TecnicoSidebar />
      <div className="tecnico-main-content">
        <TecnicoTopBar />
        <div className="tecnico-content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TecnicoLayout;
