import React, { useState, useEffect } from 'react';
import { tacheService, projectService } from '../db/database';
import AjoutTache from './AjoutTache';
import './Taches.css';

export default function Taches() {
  const [taches, setTaches] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Charger les tâches et projets
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [allTaches, allProjets] = await Promise.all([
          tacheService.getAllTaches(),
          projectService.getAllProjects()
        ]);
        
        setTaches(allTaches);
        setProjets(allProjets);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Erreur lors du chargement des tâches');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fonction pour obtenir le nom du projet
  const getProjectName = (projetId) => {
    if (!projetId) return 'Aucun projet';
    
    // Debug: afficher les informations pour diagnostiquer
    console.log('Recherche projet avec ID:', projetId, 'Type:', typeof projetId);
    console.log('Projets disponibles:', projets.map(p => ({ id: p.id, nom: p.nom, type: typeof p.id })));
    
    const projet = projets.find(p => p.id == projetId); // Utiliser == pour comparer différents types
    console.log('Projet trouvé:', projet);
    
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

  // Fonction pour ouvrir la modal d'ajout de tâche
  const handleAjouterTache = () => {
    setIsModalOpen(true);
  };

  // Fonction pour fermer la modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Fonction appelée quand une tâche est ajoutée
  const handleTacheAdded = async () => {
    try {
      // Recharger les tâches
      const updatedTaches = await tacheService.getAllTaches();
      setTaches(updatedTaches);
    } catch (error) {
      console.error('Erreur lors du rechargement des tâches:', error);
    }
  };

  // Fonction pour mettre à jour l'état d'une tâche
  const handleUpdateEtat = async (tacheId, nouvelEtat) => {
    try {
      await tacheService.updateTache(tacheId, { etat: nouvelEtat });
      // Recharger les tâches
      const updatedTaches = await tacheService.getAllTaches();
      setTaches(updatedTaches);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  };

  // Fonction pour mettre à jour la priorité d'une tâche
  const handleUpdatePriorite = async (tacheId, nouvellePriorite) => {
    try {
      await tacheService.updateTache(tacheId, { priorite: nouvellePriorite });
      // Recharger les tâches
      const updatedTaches = await tacheService.getAllTaches();
      setTaches(updatedTaches);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  };

  // Fonction pour supprimer une tâche
  const handleDeleteTache = async (tacheId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await tacheService.deleteTache(tacheId);
        // Recharger les tâches
        const updatedTaches = await tacheService.getAllTaches();
        setTaches(updatedTaches);
      } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
      }
    }
  };

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
                {taches.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-tasks">
                      Aucune tâche trouvée. Cliquez sur "Ajouter une tâche" pour commencer.
                    </td>
                  </tr>
                ) : (
                  taches.map((tache) => (
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
                      <td className={tache.date_echeance && new Date(tache.date_echeance) < new Date() ? 'date-late' : ''}>
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
