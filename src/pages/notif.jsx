import React, { useState, useEffect } from 'react';
import './notif.css';
import Sidebar from '../composants/Sidebar';
import { modificationService, userService } from '../db/database';
import { useNavigate } from 'react-router-dom';

function Notif() {
  const [projectsWithMods, setProjectsWithMods] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCache, setUserCache] = useState({});
  const navigate = useNavigate();

  // Charger les projets avec modifications au démarrage
  useEffect(() => {
    loadProjectsWithModifications();
  }, []);

  const loadProjectsWithModifications = async () => {
    try {
      setLoading(true);

      // Récupérer l'utilisateur connecté depuis localStorage
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        console.error('Aucune information utilisateur trouvée');
        navigate('/connexion');
        return;
      }

      const userData = JSON.parse(userInfo);
      const userId = userData.id_utilisateur || userData.id;

      if (!userId) {
        console.error('ID utilisateur manquant');
        navigate('/connexion');
        return;
      }

      // Ne charger que les projets (et notifications) appartenant à cet utilisateur
      const projects = await modificationService.getProjectsWithModificationsByUser(userId);
      setProjectsWithMods(projects);
      
      // Pré-charger les utilisateurs pour les modifications
      const users = await userService.getAllUsers();
      const cache = {};
      users.forEach(user => {
        cache[user.id_utilisateur] = user;
      });
      setUserCache(cache);
    } catch (err) {
      console.error('Erreur lors du chargement des projets:', err);
      setError('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const toggleProjectExpand = (projectId) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'en cours':
        return { text: 'En cours', className: 'status-active' };
      case 'terminé':
      case 'termine':
        return { text: 'Terminé', className: 'status-completed' };
      case 'brouillon':
        return { text: 'Brouillon', className: 'status-draft' };
      default:
        return { text: status || 'En cours', className: 'status-active' };
    }
  };

  const toggleNotificationStatus = async (modificationId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'à voir' ? 'vu' : 'à voir';
      await modificationService.updateModificationStatus(modificationId, newStatus);
      
      // Recharger les projets pour mettre à jour l'affichage
      loadProjectsWithModifications();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
    }
  };

  const hasUnseenNotifications = (project) => {
    return project.modifications?.some(mod => mod.status === 'à voir');
  };

  const getNotificationDescription = (changeType) => {
    const descriptions = {
      'nom': 'A changé le nom',
      'client': 'A changé le client',
      'referenceInterne': 'A changé la référence',
      'typologieProjet': 'A changé la typologie',
      'adresseProjet': 'A changé l\'adresse',
      'dateLivraison': 'A changé la date prévisionnelle',
      'plan': 'A ajouté un nouveau plan',
      'fichier': 'A modifié les fichiers',
      'export': 'A exporté le projet',
      // Changement d'état d'avancement d'un projet
      'status': 'A modifié l\'état',
      // Modification d'une priorité de tâche
      'tache_priorite': 'A modifié la priorité de la tâche',
      // Modification de l'état d'une tâche
      'tache_etat': 'A modifié l\'état de la tâche',
      // Création d'une nouvelle tâche liée au projet
      'tache_creation': 'A ajouté une tâche',
      // Invitation à collaborer sur un projet
      'invitation_projet': 'Vous a invité à collaborer'
    };
    return descriptions[changeType] || 'Modification effectuée';
  };

  if (loading) {
    return (
      <div className="notif-page">
        <Sidebar />
        <div className="notif-content">
          <div className="loading-message">Chargement des notifications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notif-page">
        <Sidebar />
        <div className="notif-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="notif-page">
      <Sidebar />
      <div className="notif-content">
        <h2 className="page-title">NOTIFICATIONS</h2>

        <div className="projects-list">
          {projectsWithMods.length > 0 ? (
            projectsWithMods.map((project) => (
              <div key={project.id} className="project-notification-item">
                {hasUnseenNotifications(project) && (
                  <div className="unseen-badge"></div>
                )}
                <div
                  className="project-header"
                  onClick={() => toggleProjectExpand(project.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-info">
                    <h3 className="project-name">{project.nom}</h3>
                    <span className="project-icon">↗</span>
                  </div>

                  <div className="project-meta">
                    <span className={`status-badge ${getStatusBadge(project.status).className}`}>
                      {getStatusBadge(project.status).text}
                    </span>
                    <span className="project-date">{formatDate(project.dateCreation)}</span>
                    <span
                      className={`expand-btn ${expandedProjectId === project.id ? 'expanded' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProjectExpand(project.id);
                      }}
                    >
                      {expandedProjectId === project.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {expandedProjectId === project.id && (
                  <div className="modifications-list">
                    {project.modifications && project.modifications.length > 0 ? (
                      <>
                        <div className="modifications-header">
                          <div className="header-cell profile">Profil</div>
                          <div className="header-cell profession">Profession</div>
                          <div className="header-cell notification">Notification</div>
                          <div className="header-cell date">Date</div>
                          <div className="header-cell status">État</div>
                        </div>

                        {[...(project.modifications || [])]
                          .sort((a, b) => new Date(b.dateModification || 0) - new Date(a.dateModification || 0))
                          .map((mod) => {
                          // Utiliser l'auteur de la modification (celui qui a fait le changement)
                          const author = mod.authorId ? userCache[mod.authorId] : null;
                          const authorName = mod.authorName || (author ? `${author.prenom} ${author.nom}` : 'Utilisateur');
                          const authorInitials = author ? `${author.prenom?.[0] || ''}${author.nom?.[0] || ''}` : (mod.authorName ? mod.authorName.split(' ').map(n => n[0]).join('') : '?');
                          const isUnseen = mod.status === 'à voir';
                          
                          return (
                            <div key={mod.id} className="modification-row">
                              <div className="cell profile">
                                <div className="user-profile">
                                  <div className="avatar">
                                    {authorInitials}
                                  </div>
                                  <span className="user-name">
                                    {authorName}
                                  </span>
                                </div>
                              </div>
                              <div className="cell profession">
                                {author?.profession || 'Non spécifié'}
                              </div>
                              <div className="cell notification">
                                {getNotificationDescription(mod.changeType)}
                              </div>
                              <div className="cell date">
                                {formatDate(mod.dateModification)}
                              </div>
                              <div className="cell status">
                                <button
                                  className={`status-button ${isUnseen ? 'unseen' : 'seen'}`}
                                  onClick={() => toggleNotificationStatus(mod.id, mod.status)}
                                >
                                  {isUnseen ? 'À voir' : 'Vu !'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="no-modifications-message">
                        <p>Aucune notification pour ce projet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <p>Aucune notification pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notif;
