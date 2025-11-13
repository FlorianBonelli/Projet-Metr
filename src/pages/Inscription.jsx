import React from 'react';
import FormulaireInscription from '../composants/FormulaireInscription';
import './Inscription.css';
import logoMetr from '../assets/images/Logo_Metr.png';
import imageFond1 from '../assets/images/Image_fond_1.jpg';
import imageFond2 from '../assets/images/Image_fond_2.jpg';

function Inscription() {
  return (
    <div className="inscription-page">
      <div className="logo-container">
        <img src={logoMetr} alt="Logo Metr" className="logo-image" />
      </div>

      <div className="decoration-left">
        <div className="plan-image">
          <img src={imageFond1} alt="Image de fond décorative" />
        </div>
      </div>

      <div className="decoration-right">
        <div className="plan-image">
          <img src={imageFond2} alt="Image de fond décorative" />
        </div>
      </div>

      <div className="formulaire-wrapper">
        <FormulaireInscription />
      </div>
    </div>
  );
}

export default Inscription;