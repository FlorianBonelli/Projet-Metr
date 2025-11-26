import React from 'react';
import './Stat.css';
import Cartable from '../assets/images/cartable.svg';
import Regle from '../assets/images/regle.svg';
import Bibliotheque from '../assets/images/bibliothèque.svg';

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
  return (
    <section className="stat-section">
      <div className="stat-grid">
        <StatCard title="Projets actifs" value="2" sub="↑ +1 ce mois-ci" icon={<img src={Cartable} alt="Projets actifs" />} iconClass="icon-blue" />
        <StatCard title="m² mesurés ce mois" value="1254" sub="↑ +326 vs mois dernier" icon={<img src={Regle} alt="m² mesurés" />} iconClass="icon-green" />
        <StatCard title="Nombre de bibliothèques" value="5" sub="↑ +2 ce mois-ci" icon={<img src={Bibliotheque} alt="Bibliothèques" />} iconClass="icon-red" />
      </div>
    </section>
  );
}
