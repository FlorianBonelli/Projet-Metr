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
      <div className="profil-content page-padding">
        <div className="profil-header" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="header-logo">
            <img src={logoMetr} alt="Logo Metr" className="logo-image" />
          </div>
        </div>
        
        <div className="profil-main">
          <div className="profil-sections">
            {/* Première ligne: Profil et Statistiques côte à côte */}
            <div className="profil-stats-row">
              <div className="profil-wrapper">
                <ProfilComponent />
              </div>
              <div className="stats-wrapper">
                <Statistique />
              </div>
            </div>
            
            {/* Deuxième ligne: Tâches */}
            <div className="section-wrapper">
              <Taches />
            </div>
            
            {/* Troisième ligne: Historique */}
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