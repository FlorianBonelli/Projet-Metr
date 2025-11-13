import React from 'react';
import FormulaireConnexion from '../composants/FormulaireConnexion';
import './Connexion.css';

function Connexion() {
  return (
    <div className="connexion-page">
      {/* Logo */}
      <div className="logo-container">
        <div className="logo">
          <span className="logo-text">Metr</span>
          <span className="logo-dot">.</span>
        </div>
      </div>

      {/* Image décorative gauche */}
      <div className="decoration-left">
        <div className="plan-image">
          {/* Vous pouvez remplacer par une vraie image */}
          <img src="/images/plan-left.png" alt="Plan architectural" />
        </div>
      </div>

      {/* Image décorative droite */}
      <div className="decoration-right">
        <div className="plan-image">
          {/* Vous pouvez remplacer par une vraie image */}
          <img src="/images/plan-right.png" alt="Plan architectural" />
        </div>
      </div>

      {/* Formulaire centré */}
      <div className="formulaire-wrapper">
        <FormulaireConnexion />
      </div>

      {/* Éléments d'animation de fond */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
}

export default Connexion;