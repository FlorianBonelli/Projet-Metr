import React, { useState, useEffect } from 'react';
import { projectService, db } from '../db/database';
import './CollaborateursModal.css';

const CollaborateursModal = ({ isOpen, onClose, projectId, currentUserId, isOwner }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('lecture');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) {
      loadCollaborators();
      loadOwner();
    }
  }, [isOpen, projectId]);

  const loadCollaborators = async () => {
    try {
      const collabs = await projectService.getProjectCollaborators(projectId);
      setCollaborators(collabs);
    } catch (err) {
      console.error('Erreur lors du chargement des collaborateurs:', err);
    }
  };

  const loadOwner = async () => {
    try {
      const project = await projectService.getProjectById(projectId);
      if (project && project.user_id) {
        const ownerUser = await db.utilisateur.get(project.user_id);
        if (ownerUser) {
          setOwner(ownerUser);
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement du propriétaire du projet:', err);
    }
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email.trim()) {
      setError('Veuillez entrer une adresse email');
      return;
    }

    setLoading(true);
    try {
      await projectService.addCollaborator(projectId, email.trim(), role);
      setSuccess(`${email} a été ajouté comme ${role === 'edition' ? 'éditeur' : 'lecteur'}`);
      setEmail('');
      setRole('lecture');
      await loadCollaborators();
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout du collaborateur');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    try {
      await projectService.removeCollaborator(projectId, userId);
      await loadCollaborators();
    } catch (err) {
      console.error('Erreur lors de la suppression du collaborateur:', err);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      // Trouver l'email du collaborateur pour le réajouter avec le nouveau rôle
      const collab = collaborators.find(c => (c.id_utilisateur || c.id) === userId);
      if (collab) {
        await projectService.addCollaborator(projectId, collab.email, newRole);
        await loadCollaborators();
      }
    } catch (err) {
      console.error('Erreur lors du changement de rôle:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="collaborateurs-modal-overlay" onClick={onClose}>
      <div className="collaborateurs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="collaborateurs-modal-header">
          <h2>Gérer les collaborateurs</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="collaborateurs-modal-content">
          <div className="owner-section">
            <h3>Propriétaire du projet</h3>
            {owner ? (
              <p className="owner-name">{owner.prenom} {owner.nom}</p>
            ) : (
              <p className="owner-name owner-name-empty">Non défini</p>
            )}
          </div>

          {/* Formulaire d'ajout */}
          {isOwner && (
            <form onSubmit={handleAddCollaborator} className="add-collaborator-form">
              <h3>Ajouter un collaborateur</h3>
              <div className="form-row">
                <input
                  type="email"
                  placeholder="Adresse email du collaborateur"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="role-select"
                >
                  <option value="lecture">Lecteur</option>
                  <option value="edition">Éditeur</option>
                </select>
                <button type="submit" disabled={loading} className="add-btn">
                  {loading ? '...' : 'Ajouter'}
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <p className="role-info">
                <strong>Lecteur :</strong> peut voir le projet mais ne peut rien modifier.<br/>
                <strong>Éditeur :</strong> peut modifier le projet (sauf le supprimer).
              </p>
            </form>
          )}

          {/* Liste des collaborateurs */}
          <div className="collaborators-list">
            <h3>Collaborateurs actuels</h3>
            {collaborators.length === 0 ? (
              <p className="no-collaborators">Aucun collaborateur pour ce projet</p>
            ) : (
              <ul>
                {collaborators.map((collab) => {
                  const collabId = collab.id_utilisateur || collab.id;
                  return (
                    <li key={collabId} className="collaborator-item">
                      <div className="collaborator-info">
                        <span className="collaborator-name">
                          {collab.prenom} {collab.nom}
                        </span>
                        <span className="collaborator-email">{collab.email}</span>
                      </div>
                      <div className="collaborator-actions">
                        {isOwner ? (
                          <>
                            <select
                              value={collab.role}
                              onChange={(e) => handleChangeRole(collabId, e.target.value)}
                              className="role-select-small"
                            >
                              <option value="lecture">Lecteur</option>
                              <option value="edition">Éditeur</option>
                            </select>
                            <button
                              onClick={() => handleRemoveCollaborator(collabId)}
                              className="remove-btn"
                              title="Retirer ce collaborateur"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <span className={`role-badge ${collab.role}`}>
                            {collab.role === 'edition' ? 'Éditeur' : 'Lecteur'}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborateursModal;
