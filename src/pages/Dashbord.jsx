import React, { useState, useEffect } from 'react';
import './Dashbord.css';
import Sidebar from '../composants/Sidebar';
import CarteProjet from '../composants/CarteProjet';
import { Link } from 'react-router-dom';
import Taches from '../composants/Taches';
import Stat from '../composants/Stat';
import { projectService } from '../db/database';

function Dashbord() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les projets depuis la base de données
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await projectService.getRecentProjects(4); // Limiter à 4 projets pour le dashboard
        setProjects(projectsData);
      } catch (err) {
        console.error('Erreur lors du chargement des projets:', err);
        setError('Erreur lors du chargement des projets');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return `Créé le ${date.toLocaleDateString('fr-FR')}`;
  };

  // Fonction pour déterminer le type de statut pour le CSS
  const getStatusType = (status) => {
    switch (status?.toLowerCase()) {
      case 'en cours':
        return 'active';
      case 'terminé':
      case 'termine':
        return 'termine';
      case 'brouillon':
        return 'brouillon';
      default:
        return 'active';
    }
  };

  return (
    <div className="dashbord">
      <Sidebar />
      <div className="main-content page-padding">
      <div className="dashbord-content">
          <h2 className="page-title">MES PROJETS RÉCENTS</h2>

          <div className="cards-grid">
            {loading ? (
              <div className="loading-message">Chargement des projets...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : projects.length > 0 ? (
              <>
                {projects.map((project) => (
                  <CarteProjet
                    key={project.id}
                    title={project.nom}
                    subtitle={project.client}
                    date={formatDate(project.dateCreation)}
                    statusText={project.status}
                    statusType={getStatusType(project.status)}
                  />
                ))}
                {/* Bouton "Voir plus" placé après les cartes */}
                <div className="cards-grid-more">
                  <Link to="/projet" className="projects-voir-more-grid">+ Voir plus</Link>
                </div>
              </>
            ) : (
              <div className="no-projects-message">
                <p>Aucun projet créé pour le moment.</p>
                <Link to="/creation-projet" className="create-first-project-btn">
                  Créer votre premier projet
                </Link>
              </div>
            )}
          </div>

          <Taches />
          <Stat />
        </div>
      </div>
    </div>
  );
}

export default Dashbord;