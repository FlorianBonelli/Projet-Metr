import React from 'react';
import './Stat.css';
import IconCartable from '../assets/images/cartable.svg';
import IconRegle from '../assets/images/regle.svg';
import IconExport from '../assets/images/export.svg';

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
      <h3 className="stat-section-title">MES STATISTIQUES</h3>

      <div className="stat-grid">
        <StatCard title="Projets actifs" value="2" sub="+1 ce mois-ci" icon={<img src={IconCartable} alt="cartable" />} iconClass="icon-blue" />
        <StatCard title="m² mesurés ce mois" value="1254" sub="+326 vs mois dernier" icon={<img src={IconRegle} alt="regle" />} iconClass="icon-green" />
        <StatCard title="Exports récents" value="8" sub="Dernier: 2 jours" icon={<img src={IconExport} alt="export" />} iconClass="icon-blue" />
      </div>
    </section>
  );
}
