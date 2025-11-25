import React from 'react';
import './Statistique.css';
import Cartable from '../assets/images/cartable.svg';
import Regle from '../assets/images/regle.svg';
import Bibliotheque from '../assets/images/bibliothèque.svg';

function Statistique({ variant = 'profil' }) {
  const isDashboard = variant === 'dashboard';

  return (
    <section className="profil-stat-section">
      {!isDashboard && (
        <h3 className="profil-stat-title">MES STATISTIQUES</h3>
      )}

      <div className={`stats-cards-grid ${isDashboard ? 'stats-grid-dashboard' : 'stats-grid-profil'}`}>
        <div className="stat-card projects-card">
          <div className="stat-icon projects-icon">
            <img src={Cartable} alt="Projets actifs" className="stat-icon-img" />
          </div>
          <div className="stat-content">
            <h4 className="stat-title">Projets actifs</h4>
            <div className="stat-number">2</div>
            <p className="stat-subtitle">↑ +1 ce mois-ci</p>
          </div>
        </div>

        <div className="stat-card time-card">
          <div className="stat-icon time-icon">
            <img src={Regle} alt="m² mesurés" className="stat-icon-img" />
          </div>
          <div className="stat-content">
            <h4 className="stat-title">m² mesurés ce mois</h4>
            <div className="stat-number">1254</div>
            <p className="stat-subtitle">↑ +326 vs mois dernier</p>
          </div>
        </div>

        <div className="stat-card library-card">
          <div className="stat-icon library-icon">
            <img src={Bibliotheque} alt="Bibliothèques" className="stat-icon-img" />
          </div>
          <div className="stat-content">
            <h4 className="stat-title">Nombre de bibliothèques</h4>
            <div className="stat-number">5</div>
            <p className="stat-subtitle">↑ +2 ce mois-ci</p>
          </div>
        </div>

        {!isDashboard && (
          <div className="stat-card total-projects-card">
            <div className="stat-icon total-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h4 className="stat-title">Nombre total de projets</h4>
              <div className="stat-number">6</div>
              <p className="stat-subtitle">↑ +3 ce mois-ci</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Statistique;