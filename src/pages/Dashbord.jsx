import React from 'react';
import './Dashbord.css';
import Sidebar from '../composants/Sidebar';
import CarteProjet from '../composants/CarteProjet';


function Dashbord() {
  return (
    <div className="dashbord">
      <Sidebar />
      <div className="dashbord-content">
          <h2 className="page-title">MES PROJETS RÉCENTS</h2>

          <div className="cards-grid">
            <CarteProjet
              title="Résidence Les Ormes"
              subtitle="Bouygues Immobilier"
              date="Créé le 02/03/2025"
              statusText="En cours"
              statusType="active"
            />

            <CarteProjet
              title="Villa Méditerranée"
              subtitle="Costa Architectes"
              date="Créé le 28/03/2025"
              statusText="En cours"
              statusType="active"
            />

            <CarteProjet
              title="Centre Commercial Nord"
              subtitle="Groupe Carrefour"
              date="Créé le 15/03/2025"
              statusText="Brouillon"
              statusType="brouillon"
            />

            <CarteProjet
              title="Résidence Les Ormes"
              subtitle="Bouygues Immobilier"
              date="Créé le 02/03/2025"
              statusText="Terminé"
              statusType="termine"
            />
          </div>
      </div>
    </div>
  );
}


export default Dashbord;
 