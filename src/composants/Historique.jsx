import React, { useState, useEffect } from 'react';
import './Historique.css';

function Historique() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [historyItems, setHistoryItems] = useState([
    {
      id: 1,
      projet: 'Lorem Ipsum',
      detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '31/10/2025',
      lien: 'Voir plus',
      status: 'completed'
    },
    {
      id: 2,
      projet: 'Lorem Ipsum',
      detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '28/10/2025',
      lien: 'Voir plus',
      status: 'in-progress'
    },
    {
      id: 3,
      projet: 'Lorem Ipsum',
      detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '31/10/2025',
      lien: 'Voir plus',
      status: 'completed'
    },
    {
      id: 4,
      projet: 'Lorem Ipsum',
      detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '31/10/2025',
      lien: 'Voir plus',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleItemHover = (itemId) => {
    setHoveredItem(itemId);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '⏳';
      case 'pending': return '🕰️';
      default: return '📄';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  const filteredItems = filterStatus === 'all' 
    ? historyItems 
    : historyItems.filter(item => item.status === filterStatus);

  return (
    <div className={`historique-component ${isVisible ? 'visible' : ''}`}>
      <div className="historique-header">
        <div className="header-content">
          <h2 className="section-title">Historique</h2>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Tous
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Terminés
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilterStatus('in-progress')}
            >
              En cours
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              En attente
            </button>
          </div>
        </div>
      </div>

      <div className="history-table-container">
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Statut</th>
                <th>Projet</th>
                <th>Détail</th>
                <th>Date</th>
                <th>Lien</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={`history-row ${hoveredItem === item.id ? 'hovered' : ''}`}
                  onMouseEnter={() => handleItemHover(item.id)}
                  onMouseLeave={handleItemLeave}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="status-cell">
                    <div className="status-indicator">
                      <span className="status-icon">{getStatusIcon(item.status)}</span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </td>
                  <td className="project-cell">
                    <span className="project-name">{item.projet}</span>
                  </td>
                  <td className="detail-cell">
                    <div className="detail-content">
                      {item.detail}
                    </div>
                  </td>
                  <td className="date-cell">{item.date}</td>
                  <td className="link-cell">
                    <button className="view-more-btn">
                      {item.lien}
                      <span className="arrow-icon">→</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="history-stats">
        <div className="stat-card total-projects">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-number">{historyItems.length}</div>
            <div className="stat-label">Projets totaux</div>
          </div>
        </div>
        
        <div className="stat-card completed-projects">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{historyItems.filter(item => item.status === 'completed').length}</div>
            <div className="stat-label">Projets terminés</div>
          </div>
        </div>
        
        <div className="stat-card active-projects">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{historyItems.filter(item => item.status === 'in-progress').length}</div>
            <div className="stat-label">Projets actifs</div>
          </div>
        </div>
        
        <div className="stat-card pending-projects">
          <div className="stat-icon">🕰️</div>
          <div className="stat-content">
            <div className="stat-number">{historyItems.filter(item => item.status === 'pending').length}</div>
            <div className="stat-label">En attente</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Historique;