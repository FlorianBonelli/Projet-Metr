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
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      return (
        <div className="profil-component loading">
          <p>Veuillez vous connecter pour voir votre profil</p>
          <button onClick={() => navigate('/connexion')} style={{marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
            Aller à la connexion
          </button>
        </div>
      );
    }
    return <div className="profil-component loading">Chargement des données...</div>;
  }

  const userInitial = userData.prenom ? userData.prenom.charAt(0).toUpperCase() : 'U';
  const fullName = `${userData.prenom || ''} ${userData.nom || ''}`.trim();
  const displayPassword = passwordVisible ? userData.mot_de_passe : '●'.repeat(userData.mot_de_passe?.length || 8);

  return (
    <div className={`profil-component ${isVisible ? 'visible' : ''}`}>
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
                  {passwordVisible ? '👁️' : '�'}
                </button>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="change-password-btn"
              onClick={() => setShowChangePasswordModal(true)}
            >
              <span>Changer le mot de passe</span>
              <span className="btn-icon">✏️</span>
            </button>
            <button className="disconnect-btn" onClick={handleDisconnect}>
              <span>Se déconnecter</span>
              <span className="btn-icon">↗️</span>
            </button>
          </div>
        </div>

        {/* Statistiques à droite */}
        <div className="stats-cards-grid">
          <div className="stat-card projects-card">
            <div className="stat-icon projects-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <h4 className="stat-title">Projets actifs</h4>
              <div className="stat-number">2</div>
              <p className="stat-subtitle">↑ +1 ce mois-ci</p>
            </div>
          </div>

          <div className="stat-card time-card">
            <div className="stat-icon time-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h4 className="stat-title">m² mesurés ce mois</h4>
              <div className="stat-number">1254</div>
              <p className="stat-subtitle">↑ +326 vs mois dernier</p>
            </div>
          </div>

          <div className="stat-card library-card">
            <div className="stat-icon library-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h4 className="stat-title">Nombre de bibliothèques</h4>
              <div className="stat-number">5</div>
              <p className="stat-subtitle">↑ +2 ce mois-ci</p>
            </div>
          </div>

          <div className="stat-card total-projects-card">
            <div className="stat-icon total-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h4 className="stat-title">Nombre total de projets</h4>
              <div className="stat-number">6</div>
              <p className="stat-subtitle">↑ +3 ce mois-ci</p>
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