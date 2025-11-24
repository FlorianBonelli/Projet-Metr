import React from 'react';
import './Taches.css';

export default function Taches() {
  return (
    <section className="taches-section">
      <div className="taches-card">
        <div className="taches-card-inner">
          <div className="taches-card-header">
            <h4 className="taches-card-title">Gestion des tâches</h4>
            <button className="taches-ajouter-btn">+ Ajouter une tâche</button>
          </div>

          <div className="taches-table-wrap">
            <table className="taches-table">
              <thead>
                <tr>
                  <th>Tâche</th>
                  <th>Projet</th>
                  <th>Description</th>
                  <th>Collaborateur</th>
                  <th>Priorité</th>
                  <th>Date</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lorem Ipsum</td>
                  <td>
                    <span className="proj-pill">Les Ormes <span className="pill-caret">▾</span></span>
                  </td>
                  <td>Lorem ipsum...</td>
                  <td>Mr. Martin</td>
                  <td>
                    <span className="prio prio-high">Haute <span className="pill-caret">▾</span></span>
                  </td>
                  <td>26/11/2025</td>
                  <td>
                    <span className="etat etat-en-cours">En cours <span className="pill-caret">▾</span></span>
                  </td>
                </tr>
                <tr>
                  <td>Lorem Ipsum</td>
                  <td>
                    <span className="proj-pill">Les Ormes <span className="pill-caret">▾</span></span>
                  </td>
                  <td>Lorem ipsum...</td>
                  <td>Mr. Martin</td>
                  <td>
                    <span className="prio prio-medium">Modéré <span className="pill-caret">▾</span></span>
                  </td>
                  <td className="date-late">31/10/2025</td>
                  <td>
                    <span className="etat etat-a-faire">À faire <span className="pill-caret">▾</span></span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
