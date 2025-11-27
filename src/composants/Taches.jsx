import React, { useState, useEffect } from 'react';
import { tacheService, projectService } from '../db/database';
import { useNavigate } from 'react-router-dom';
import AjoutTache from './AjoutTache';
import './Taches.css';

export default function Taches({ variant = 'default' }) {
  const [taches, setTaches] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Charger les tâches et projets
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Récupérer l'ID de l'utilisateur connecté depuis localStorage
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
        
        // Récupérer uniquement les tâches et projets de l'utilisateur connecté
        const [userTaches, userProjets] = await Promise.all([
          tacheService.getTachesByUser(userId),
          projectService.getProjectsByUser(userId)
        ]);
        
        setTaches(userTaches);
        setProjets(userProjets);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Erreur lors du chargement des tâches');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Fonction pour obtenir le nom du projet
  const getProjectName = (projetId) => {
    if (!projetId) return 'Aucun projet';
    
    const projet = projets.find(p => p.id == projetId); // Utiliser == pour comparer différents types
    return projet ? projet.nom : `Projet #${projetId}`;
  };

  // Fonction pour obtenir la classe CSS de la priorité
  const getPriorityClass = (priorite) => {
    switch (priorite) {
      case 'Critique': return 'prio-critical';
      case 'Élevée': return 'prio-high';
      case 'Moyenne': return 'prio-medium';
      case 'Faible': return 'prio-low';
      default: return 'prio-medium';
    }
  };

  // Fonction pour obtenir la classe CSS de l'état
  const getEtatClass = (etat) => {
    switch (etat) {
      case 'Terminé': return 'etat-termine';
      case 'En cours': return 'etat-en-cours';
      case 'En attente': return 'etat-en-attente';
      case 'À faire': return 'etat-a-faire';
      default: return 'etat-a-faire';
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Fonction pour savoir si une tâche est prioritaire (pour le dashboard)
  const isPriorityTask = (tache) => {
    if (!tache) return false;

    const highPriority = tache.priorite === 'Élevée' || tache.priorite === 'Critique';

    let dueSoon = false;
    if (tache.date_echeance) {
      const now = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(now.getDate() + 3);

      const dueDate = new Date(tache.date_echeance);
      // tâche avec échéance aujourd'hui ou dans les 3 jours
      dueSoon = dueDate >= now && dueDate <= threeDaysFromNow;
    }

    return highPriority || dueSoon;
  };

  // Classe CSS de la date (en retard ou bientôt échue)
  const getDateClass = (dateString) => {
    if (!dateString) return '';

    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);

    const date = new Date(dateString);

    if (date < now) return 'date-late';
    if (date >= now && date <= threeDaysFromNow) return 'date-soon';
    return '';
  };

  // Fonction pour ouvrir la modal d'ajout de tâche
  const handleAjouterTache = () => {
    setIsModalOpen(true);
  };

  // Fonction pour fermer la modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Fonction helper pour recharger les tâches de l'utilisateur connecté
  const reloadUserTaches = async () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        const userId = userData.id_utilisateur || userData.id;
        if (userId) {
          const updatedTaches = await tacheService.getTachesByUser(userId);
          setTaches(updatedTaches);
        }
      }
    } catch (error) {
      console.error('Erreur lors du rechargement des tâches:', error);
    }
  };

  // Fonction pour recharger les tâches après ajout
  const handleTacheAdded = async () => {
    await reloadUserTaches();
  };

  // Fonction pour mettre à jour l'état d'une tâche
  const handleUpdateEtat = async (tacheId, nouvelEtat) => {
    try {
      await tacheService.updateTache(tacheId, { etat: nouvelEtat });
      // Recharger les tâches de l'utilisateur
      await reloadUserTaches();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  };

  // Fonction pour mettre à jour la priorité d'une tâche
  const handleUpdatePriorite = async (tacheId, nouvellePriorite) => {
    try {
      await tacheService.updateTache(tacheId, { priorite: nouvellePriorite });
      // Recharger les tâches de l'utilisateur
      await reloadUserTaches();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  };

  // Fonction pour supprimer une tâche
  const handleDeleteTache = async (tacheId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await tacheService.deleteTache(tacheId);
        // Recharger les tâches de l'utilisateur
        await reloadUserTaches();
      } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
      }
    }
  };

  const isDashboard = variant === 'dashboard';

  // Tâches affichées : toutes (mode normal) ou seulement les prioritaires (dashboard)
  const displayedTaches = isDashboard ? taches.filter(isPriorityTask) : taches;

  if (loading) {
    return (
      <section className="taches-section">
        <div className="taches-card">
          <div className="loading-message">Chargement des tâches...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="taches-section">
        <div className="taches-card">
          <div className="error-message">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="taches-section">
      <div className="taches-card">
        <div className="taches-card-inner">
          <div className="taches-card-header">
            <h4 className="taches-card-title">Gestion des tâches</h4>
            <button 
              className="taches-ajouter-btn"
              onClick={handleAjouterTache}
            >
              + Ajouter une tâche
            </button>
          </div>

          <div className="taches-table-wrap">
            <table className="taches-table">
              <thead>
                <tr>
                  <th>Tâche</th>
                  <th>Projet</th>
                  <th>Description</th>
                  <th>Priorité</th>
                  <th>Date d'échéance</th>
                  <th>État</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedTaches.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-tasks">
                      Aucune tâche trouvée. Cliquez sur "Ajouter une tâche" pour commencer.
                    </td>
                  </tr>
                ) : (
                  displayedTaches.map((tache) => (
                    <tr key={tache.id}>
                      <td className="task-title">{tache.titre}</td>
                      <td>
                        <span className="proj-pill">
                          {getProjectName(tache.projet_id)}
                        </span>
                      </td>
                      <td className="task-description">
                        {tache.description || 'Aucune description'}
                      </td>
                      <td>
                        <select
                          className={`prio ${getPriorityClass(tache.priorite)}`}
                          value={tache.priorite}
                          onChange={(e) => handleUpdatePriorite(tache.id, e.target.value)}
                        >
                          <option value="Faible">Faible</option>
                          <option value="Moyenne">Moyenne</option>
                          <option value="Élevée">Élevée</option>
                          <option value="Critique">Critique</option>
                        </select>
                      </td>
                      <td className={getDateClass(tache.date_echeance)}>
                        {formatDate(tache.date_echeance)}
                      </td>
                      <td>
                        <select
                          className={`etat ${getEtatClass(tache.etat)}`}
                          value={tache.etat}
                          onChange={(e) => handleUpdateEtat(tache.id, e.target.value)}
                        >
                          <option value="À faire">À faire</option>
                          <option value="En cours">En cours</option>
                          <option value="En attente">En attente</option>
                          <option value="Terminé">Terminé</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteTache(tache.id)}
                          title="Supprimer la tâche"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal d'ajout de tâche */}
      <AjoutTache 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTacheAdded={handleTacheAdded}
      />
    </section>
  );
}
