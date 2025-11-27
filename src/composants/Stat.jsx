import React, { useEffect, useState } from 'react';
import './Stat.css';
import Cartable from '../assets/images/cartable.svg';
import Regle from '../assets/images/regle.svg';
import Bibliotheque from '../assets/images/projetRouge.svg';
import { projectService, libraryService } from '../db/database';

function StatCard({ title, value, sub, icon, iconClass }) {
  return (
    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-sub">{sub}</div>
      </div>
      <div className="stat-right">
        <div className={`stat-icon-box ${iconClass || ''}`}>{icon}</div>
      </div>
    </div>
  );
}

export default function Stat() {
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalProjects: 0,
    totalLibraries: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Récupérer l'utilisateur connecté
        const userInfo = window.localStorage.getItem('userInfo');
        let userId = null;

        if (userInfo) {
          try {
            const parsed = JSON.parse(userInfo);
            userId = parsed.id_utilisateur || parsed.id || null;
          } catch (e) {
            console.error('Erreur de parsing userInfo pour les stats du dashboard:', e);
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
        console.error('Erreur lors du chargement des statistiques du dashboard:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="stat-section">
      <div className="stat-grid">
        <StatCard
          title="Projets actifs"
          value={stats.activeProjects}
          sub={"Projets avec l'état \"En cours\""}
          icon={<img src={Cartable} alt="Projets actifs" />}
          iconClass="icon-blue"
        />
        <StatCard
          title="m² mesurés ce mois"
          value="1254"
          sub="↑ +326 vs mois dernier"
          icon={<img src={Regle} alt="m² mesurés" />}
          iconClass="icon-green"
        />
        <StatCard
          title="Nombre de bibliothèques"
          value={stats.totalLibraries}
          sub="Bibliothèques dans votre espace"
          icon={<img src={Bibliotheque} alt="Bibliothèques" />}
          iconClass="icon-red"
        />
      </div>
    </section>
  );
}
