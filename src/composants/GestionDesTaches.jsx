import React, { useState, useEffect } from 'react';
import './GestionDesTaches.css';

function GestionDesTaches() {
  const [isVisible, setIsVisible] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      tache: 'Lorem Ipsum',
      projet: 'Les Ormes',
      description: 'Lorem ipsum...',
      collaborateur: 'Mr Martin',
      priorite: 'Haute',
      date: '31/10/2025',
      etat: 'Terminé'
    },
    {
      id: 2,
      tache: 'Lorem Ipsum',
      projet: 'Les Ormes',
      description: 'Lorem ipsum...',
      collaborateur: 'Mr Martin',
      priorite: 'Basse',
      date: '31/10/2025',
      etat: 'En cours'
    },
    {
      id: 3,
      tache: 'Lorem Ipsum',
      projet: 'Les Ormes',
      description: 'Lorem ipsum...',
      collaborateur: 'Mr Martin',
      priorite: 'Normale',
      date: '31/10/2025',
      etat: 'À faire'
    },
    {
      id: 4,
      tache: 'Lorem Ipsum',
      projet: 'Les Ormes',
      description: 'Lorem ipsum...',
      collaborateur: 'Mr Martin',
      priorite: 'Haute',
      date: '31/10/2025',
      etat: 'Terminé'
    }
  ]);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'Haute': return '#ef4444';
      case 'Normale': return '#f59e0b';
      case 'Basse': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (etat) => {
    switch (etat) {
      case 'Terminé': return '#10b981';
      case 'En cours': return '#f59e0b';
      case 'À faire': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleAddTask = () => {
    setShowAddModal(true);
  };

  const handleTaskHover = (taskId) => {
    setHoveredTask(taskId);
  };

  const handleTaskLeave = () => {
    setHoveredTask(null);
  };

  return (
    <div className={`gestion-taches-component ${isVisible ? 'visible' : ''}`}>
      <div className="gestion-header">
        <div className="header-content">
          <h2 className="section-title">Gestion des tâches</h2>
          <button className="add-task-btn" onClick={handleAddTask}>
            <span className="add-icon">+</span>
            Ajouter une tâche
          </button>
        </div>
      </div>

      <div className="tasks-table-container">
        <div className="table-wrapper">
          <table className="tasks-table">
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
              {tasks.map((task, index) => (
                <tr 
                  key={task.id} 
                  className={`task-row ${hoveredTask === task.id ? 'hovered' : ''}`}
                  onMouseEnter={() => handleTaskHover(task.id)}
                  onMouseLeave={handleTaskLeave}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="task-name">{task.tache}</td>
                  <td className="project-cell">
                    <span className="project-tag">{task.projet}</span>
                  </td>
                  <td className="description-cell">{task.description}</td>
                  <td className="collaborator-cell">{task.collaborateur}</td>
                  <td className="priority-cell">
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(task.priorite) }}
                    >
                      {task.priorite}
                    </span>
                  </td>
                  <td className="date-cell">{task.date}</td>
                  <td className="status-cell">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(task.etat) }}
                    >
                      {task.etat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tasks-summary">
        <div className="summary-card total-tasks">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <div className="summary-number">{tasks.length}</div>
            <div className="summary-label">Tâches totales</div>
          </div>
        </div>
        
        <div className="summary-card completed-tasks">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <div className="summary-number">{tasks.filter(t => t.etat === 'Terminé').length}</div>
            <div className="summary-label">Tâches terminées</div>
          </div>
        </div>
        
        <div className="summary-card in-progress-tasks">
          <div className="summary-icon">⏳</div>
          <div className="summary-content">
            <div className="summary-number">{tasks.filter(t => t.etat === 'En cours').length}</div>
            <div className="summary-label">En cours</div>
          </div>
        </div>
        
        <div className="summary-card pending-tasks">
          <div className="summary-icon">🗓️</div>
          <div className="summary-content">
            <div className="summary-number">{tasks.filter(t => t.etat === 'À faire').length}</div>
            <div className="summary-label">À faire</div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ajouter une nouvelle tâche</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <p>Formulaire d'ajout de tâche à implémenter...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionDesTaches;