import React from 'react';
import Sidebar from '../composants/Sidebar';
import ProfilComponent from '../composants/Profil';
import Statistique from '../composants/Statistique';
import Taches from '../composants/Taches';
import Historique from '../composants/Historique';
import logoMetr from '../assets/images/Logo_Metr.png';
import './Profil.css';

function Profil() {
  return (
    <div className="profil-page">
      <Sidebar />
      <div className="profil-content">
        <div className="profil-header" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="header-logo">
            <img src={logoMetr} alt="Logo Metr" className="logo-image" />
          </div>
        </div>
        
        <div className="profil-main">
          <div className="profil-sections">
            <div className="section-wrapper">
              <ProfilComponent />
            </div>
            
            <div className="section-wrapper">
              <Statistique />
            </div>
            
            <div className="section-wrapper">
              <Taches />
            </div>
            
            <div className="section-wrapper">
              <Historique />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil;