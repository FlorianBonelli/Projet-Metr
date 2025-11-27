import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../db/database';
import './Profil.css';
import EyeOpen from '../assets/images/EyeOpen.svg';
import EyeSlash from '../assets/images/EyeSlash.svg';
import Modif from '../assets/images/Modif.svg';
import Deconnexion from '../assets/images/deconnexion.svg';
import Statistique from './Statistique';

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
    // Nettoyer complètement le localStorage pour éviter les fuites de session
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userInfo');
    localStorage.clear(); // Nettoie tout le localStorage pour une déconnexion complète
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
                  <img
                    src={passwordVisible ? EyeOpen : EyeSlash}
                    alt={passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="icon-eye"
                  />
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
              <span className="btn-icon">
                <img src={Modif} alt="Changer le mot de passe" className="icon-btn" />
              </span>
            </button>
            <button className="disconnect-btn" onClick={handleDisconnect}>
              <span>Se déconnecter</span>
              <span className="btn-icon">
                <img src={Deconnexion} alt="Se déconnecter" className="icon-btn" />
              </span>
            </button>
          </div>
        </div>

        {/* Statistiques à droite */}
        <Statistique variant="profil" />
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