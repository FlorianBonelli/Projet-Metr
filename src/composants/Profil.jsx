import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../db/database';
import './Profil.css';

function Profil() {
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const user = await userService.getUserByEmail(userEmail);
        if (user) {
          setUserData(user);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPassword || !confirmPassword) {
      setPasswordError('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await userService.updateUserPassword(userData.id_utilisateur, newPassword);
      setPasswordSuccess('Mot de passe changé avec succès!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setPasswordSuccess('');
        loadUserData();
      }, 2000);
    } catch (error) {
      setPasswordError('Erreur lors de la mise à jour du mot de passe');
      console.error('Erreur:', error);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('userEmail');
    navigate('/connexion');
  };

  if (!userData) {
    return <div className="profil-component loading">Chargement des données...</div>;
  }

  const userInitial = userData.prenom ? userData.prenom.charAt(0).toUpperCase() : 'U';
  const fullName = `${userData.prenom || ''} ${userData.nom || ''}`.trim();
  const displayPassword = passwordVisible ? userData.mot_de_passe : '••••••••';

  return (
    <div className={`profil-component ${isVisible ? 'visible' : ''}`}>
      <div className="profil-header-section">
        <h2 className="section-title">PROFIL</h2>
        <p className="section-subtitle">Bonjour {userData.prenom || 'Utilisateur'}</p>
      </div>

      <div className="profil-main-grid">
        {/* Carte Profil à gauche */}
        <div className="profil-info-card">
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar-image">
                <span className="avatar-initial">{userInitial}</span>
              </div>
              <div className="status-indicator"></div>
            </div>
          </div>

          <div className="user-info-center">
            <h3 className="user-name">{fullName}</h3>
            <p className="user-email">{userData.email}</p>
          </div>

          <div className="user-details">
            <div className="detail-row">
              <span className="detail-label">Profession :</span>
              <span className="detail-value">{userData.profession || 'Non spécifiée'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Entreprise :</span>
              <span className="detail-value">{userData.entreprise || 'Non spécifiée'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Mot de passe :</span>
              <div className="password-row">
                <span className="detail-value">{displayPassword}</span>
                <button 
                  className="eye-btn"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  type="button"
                  title={passwordVisible ? 'Masquer' : 'Afficher'}
                >
                  {passwordVisible ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="change-password-btn"
              onClick={() => setShowChangePasswordModal(true)}
            >
              Changer le mot de passe
            </button>
            <button className="disconnect-btn" onClick={handleDisconnect}>
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Statistiques à droite */}
        <div className="stats-cards-grid">
          <div className="stat-card projects-card">
            <div className="stat-icon projects-icon">📊</div>
            <div className="stat-content">
              <h4 className="stat-title">Projets actifs</h4>
              <div className="stat-number">2</div>
              <p className="stat-subtitle">+1 ce mois-ci</p>
            </div>
          </div>

          <div className="stat-card time-card">
            <div className="stat-icon time-icon">📏</div>
            <div className="stat-content">
              <h4 className="stat-title">m² mesurés ce mois</h4>
              <div className="stat-number">1254</div>
              <p className="stat-subtitle">+326 vs mois dernier</p>
            </div>
          </div>

          <div className="stat-card library-card">
            <div className="stat-icon library-icon">📚</div>
            <div className="stat-content">
              <h4 className="stat-title">Nombre de bibliothèques</h4>
              <div className="stat-number">5</div>
              <p className="stat-subtitle">+2 ce mois-ci</p>
            </div>
          </div>

          <div className="stat-card total-projects-card">
            <div className="stat-icon total-icon">🔧</div>
            <div className="stat-content">
              <h4 className="stat-title">Nombre total de projets</h4>
              <div className="stat-number">6</div>
              <p className="stat-subtitle">+3 ce mois-ci</p>
            </div>
          </div>
        </div>
      </div>

      {showChangePasswordModal && (
        <div className="modal-overlay" onClick={() => setShowChangePasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Changer le mot de passe</h3>
              <button 
                className="modal-close"
                onClick={() => setShowChangePasswordModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Entrez le nouveau mot de passe"
                />
              </div>
              
              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez le mot de passe"
                />
              </div>

              {passwordError && <div className="error-message">{passwordError}</div>}
              {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowChangePasswordModal(false)}
              >
                Annuler
              </button>
              <button 
                className="btn-confirm"
                onClick={handleChangePassword}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profil;