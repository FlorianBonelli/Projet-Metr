import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../db/database';
import './FormulaireInscription.css';

function FormulaireInscription() {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profession, setProfession] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Créer l'utilisateur avec le service Dexie
      await userService.createUser({
        nom,
        prenom,
        email,
        mot_de_passe: password,
        profession,
        entreprise,
        role: 'utilisateur'
      });
      
      // Récupérer l'utilisateur créé pour stocker ses informations
      const createdUser = await userService.getUserByEmail(email);
      
      setSuccess('Compte créé avec succès ! Redirection...');
      
      // Redirection vers le dashboard après 1 seconde
      setTimeout(() => {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userInfo', JSON.stringify({
          id_utilisateur: createdUser.id_utilisateur,
          id: createdUser.id_utilisateur, // Pour compatibilité
          nom: createdUser.nom,
          prenom: createdUser.prenom,
          email: createdUser.email,
          role: createdUser.role,
          profession: createdUser.profession,
          entreprise: createdUser.entreprise
        }));
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Inscription avec Google');
  };

  const handleLoginRedirect = () => {
    navigate('/connexion');
  };

  return (
    <div className="formulaire-inscription">
      <div className="formulaire-header">
        <h1>Inscription</h1>
      </div>

      <form onSubmit={handleSubmit} className="formulaire-form">
        <div className="form-field">
          <label htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Adresse mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="profession">Profession</label>
          <input
            type="text"
            id="profession"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="entreprise">Entreprise</label>
          <input
            type="text"
            id="entreprise"
            value={entreprise}
            onChange={(e) => setEntreprise(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className={`btn-submit ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loader"></span>
          ) : (
            "S'inscrire"
          )}
        </button>

        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="message success-message">
            {success}
          </div>
        )}

        <button 
          type="button" 
          className="btn-google"
          onClick={handleGoogleSignup}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        <div className="formulaire-footer">
          <p>Vous avez déjà un compte ? <button type="button" className="link-button" onClick={() => navigate('/connexion')}>Connectez-vous !</button></p>
        </div>
      </form>
    </div>
  );
}

export default FormulaireInscription;