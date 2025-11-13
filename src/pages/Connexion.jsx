import React from 'react';
import FormulaireConnexion from '../composants/FormulaireConnexion';
import './Connexion.css';
import logoMetr from '../assets/images/Logo_Metr.png';
import imageFond1 from '../assets/images/Image_fond_1.jpg';
import imageFond2 from '../assets/images/Image_fond_2.jpg';

function Connexion() {
  return (
    <div className="connexion-page">
      {/* Logo */}
      <div className="logo-container">
        <div className="logo">
          <img src={logoMetr} alt="Logo Metr" className="logo-image" />
        </div>
      </div>

      {/* Image décorative gauche */}
      <div className="decoration-left">
        <div className="plan-image">
          <img src={imageFond1} alt="Image de fond décorative" />
        </div>
      </div>

      {/* Image décorative droite */}
      <div className="decoration-right">
        <div className="plan-image">
          <img src={imageFond2} alt="Image de fond décorative" />
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