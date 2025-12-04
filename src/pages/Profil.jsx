import React from 'react';
import '../styles/common.css';
import './Profil.css';
import Sidebar from '../composants/Sidebar';
import ProfilComponent from '../composants/Profil';
import Taches from '../composants/Taches';

function Profil() {
  return (
    <div className="profil-page">
      <Sidebar />
      <div className="profil-content page-padding">
        <div className="profil-header-top">
          <h2 className="page-title">PROFIL</h2>
        </div>
        <div className="profil-main">
          <div className="profil-sections">
            <ProfilComponent />
          </div>
        </div>

        <div className="profil-taches-section">
          <Taches />
        </div>
      </div>
    </div>
  );
}

export default Profil;