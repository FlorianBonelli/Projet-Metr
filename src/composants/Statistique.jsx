import React, { useEffect, useState } from 'react';
import './Statistique.css';
import Cartable from '../assets/images/cartable.svg';
import Regle from '../assets/images/regle.svg';
import Bibliotheque from '../assets/images/projetRouge.svg';
import { projectService, libraryService } from '../db/database';

function Statistique({ variant = 'profil' }) {
  const isDashboard = variant === 'dashboard';

  const [stats, setStats] = useState({
    activeProjects: 0,
    totalProjects: 0,
    totalLibraries: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const userInfo = window.localStorage.getItem('userInfo');
        let userId = null;

        if (userInfo) {
          try {
            const parsed = JSON.parse(userInfo);
            userId = parsed.id_utilisateur || parsed.id || null;
          } catch (e) {
            console.error('Erreur de parsing userInfo pour les stats profil:', e);
          }
        }

        let projects = [];
        if (userId) {
          projects = await projectService.getProjectsByUser(userId);
        } else {
          projects = await projectService.getAllProjects();
        }

        const libraries = await libraryService.getAllLibraries();

        const activeProjects = projects.filter((p) => (p.status || '').toLowerCase() === 'en cours').length;
        const totalProjects = projects.length;
        const totalLibraries = libraries.length;

        setStats({ activeProjects, totalProjects, totalLibraries });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques du profil:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="profil-stat-section">
      {!isDashboard && (
        <h3 className="profil-stat-title">MES STATISTIQUES</h3>
      )}

      <div className={`stats-cards-grid ${isDashboard ? 'stats-grid-dashboard' : 'stats-grid-profil'}`}>
        <div className="stat-card projects-card">
          <div className="stat-icon projects-icon">
            <img src={Cartable} alt="Projets actifs" className="stat-icon-img" />
          </div>
          <div className="stat-content">
            <h4 className="stat-title">Projets actifs</h4>
            <div className="stat-number">{stats.activeProjects}</div>
            <p className="stat-subtitle">Projets avec l'état "En cours"</p>
          </div>
        </div>

        <div className="stat-card time-card">
          <div className="stat-icon time-icon">
            <img src={Regle} alt="m² mesurés" className="stat-icon-img" />
          </div>
          <div className="stat-content">
            <h4 className="stat-title">m² mesurés ce mois</h4>
            <div className="stat-number">1254</div>
            <p className="stat-subtitle">↑ +326 vs mois dernier</p>
          </div>
        </div>

        <div className="stat-card library-card">
          <div className="stat-icon library-icon">
            <img src={Bibliotheque} alt="Bibliothèques" className="stat-icon-img" />
          </div>
          <div className="stat-content">
            <h4 className="stat-title">Nombre de bibliothèques</h4>
            <div className="stat-number">{stats.totalLibraries}</div>
            <p className="stat-subtitle">Bibliothèques dans votre espace</p>
          </div>
        </div>

        {!isDashboard && (
          <div className="stat-card total-projects-card">
            <div className="stat-icon total-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <div className="stat-content">
              <h4 className="stat-title">Nombre total de projets</h4>
              <div className="stat-number">{stats.totalProjects}</div>
              <p className="stat-subtitle">Tous vos projets créés</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Statistique;