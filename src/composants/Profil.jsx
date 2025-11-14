import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profil.css';

function Profil() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCardHover = (cardId) => {
    setActiveCard(cardId);
  };

  const handleCardLeave = () => {
    setActiveCard(null);
  };

  const handleDisconnect = () => {
    // Simulation de la déconnexion
    console.log('Déconnexion en cours...');
    navigate('/connexion');
  };

  return (
    <div className={`profil-component ${isVisible ? 'visible' : ''}`}>
      <div className="profil-header-section">
        <h2 className="section-title">PROFIL</h2>
        <p className="section-subtitle">Bonjour Antoine</p>
      </div>

      <div className="profil-content-grid">
        <div className="profil-info-card">
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar-image">
                <span className="avatar-initial">A</span>
              </div>
              <div className="status-indicator"></div>
            </div>
            <div className="user-info">
              <h3 className="user-name">Antoine Brosseau</h3>
              <p className="user-title">INGÉNIEUR ÉCONOMISTE DE LA CONSTRUCTION</p>
            </div>
          </div>

          <div className="user-details">
            <div className="detail-row">
              <span className="detail-label">Profession :</span>
              <span className="detail-value">Économiste</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Entreprise :</span>
              <span className="detail-value">Bouygues Immobilier</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Mot de passe :</span>
              <span className="detail-value">••••••••</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="change-password-btn">
              <span className="btn-icon">🔒</span>
              Changer le mot de passe
            </button>
            <button className="disconnect-btn" onClick={handleDisconnect}>
              <span className="btn-icon">🚪</span>
              Se déconnecter
            </button>
          </div>
        </div>

        <div className="stats-cards-grid">
          <div 
            className={`stat-card projects-card ${activeCard === 'projects' ? 'active' : ''}`}
            onMouseEnter={() => handleCardHover('projects')}
            onMouseLeave={handleCardLeave}
          >
            <div className="stat-icon projects-icon">
              <span>📊</span>
            </div>
            <div className="stat-content">
              <h4 className="stat-title">Projets actifs</h4>
              <div className="stat-number">2</div>
              <p className="stat-subtitle">+2 ce mois-ci</p>
            </div>
          </div>

          <div 
            className={`stat-card time-card ${activeCard === 'time' ? 'active' : ''}`}
            onMouseEnter={() => handleCardHover('time')}
            onMouseLeave={handleCardLeave}
          >
            <div className="stat-icon time-icon">
              <span>⏱️</span>
            </div>
            <div className="stat-content">
              <h4 className="stat-title">Hrs travaillées ce mois</h4>
              <div className="stat-number">1254</div>
              <p className="stat-subtitle">+5 hrs cette semaine</p>
            </div>
          </div>

          <div 
            className={`stat-card library-card ${activeCard === 'library' ? 'active' : ''}`}
            onMouseEnter={() => handleCardHover('library')}
            onMouseLeave={handleCardLeave}
          >
            <div className="stat-icon library-icon">
              <span>📚</span>
            </div>
            <div className="stat-content">
              <h4 className="stat-title">Nombre de bibliothèques</h4>
              <div className="stat-number">5</div>
              <p className="stat-subtitle">+1 ce mois-ci</p>
            </div>
          </div>

          <div 
            className={`stat-card total-projects-card ${activeCard === 'total' ? 'active' : ''}`}
            onMouseEnter={() => handleCardHover('total')}
            onMouseLeave={handleCardLeave}
          >
            <div className="stat-icon total-icon">
              <span>🎯</span>
            </div>
            <div className="stat-content">
              <h4 className="stat-title">Nombre total de projets</h4>
              <div className="stat-number">6</div>
              <p className="stat-subtitle">+1 ce mois-ci</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil;