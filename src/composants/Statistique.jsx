import React, { useState, useEffect } from 'react';
import './Statistique.css';

function Statistique() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeMetric, setActiveMetric] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({
    efficiency: 0,
    completion: 0,
    quality: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animation des valeurs
    const timer = setTimeout(() => {
      setAnimatedValues({
        efficiency: 87,
        completion: 94,
        quality: 91
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleMetricHover = (metric) => {
    setActiveMetric(metric);
  };

  const handleMetricLeave = () => {
    setActiveMetric(null);
  };

  const CircularProgress = ({ value, color, size = 120 }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="circular-progress" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="progress-svg">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="progress-circle"
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%'
            }}
          />
        </svg>
        <div className="progress-text">
          <span className="progress-value">{value}%</span>
        </div>
      </div>
    );
  };

  const chartData = [
    { month: 'Jan', value: 65 },
    { month: 'Fév', value: 78 },
    { month: 'Mar', value: 82 },
    { month: 'Avr', value: 88 },
    { month: 'Mai', value: 94 },
    { month: 'Jun', value: 87 }
  ];

  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className={`statistique-component ${isVisible ? 'visible' : ''}`}>
      <div className="statistique-header">
        <h2 className="section-title">STATISTIQUES</h2>
        <p className="section-subtitle">Aperçu de vos performances</p>
      </div>

      <div className="stats-grid">
        <div className="performance-metrics">
          <h3 className="metrics-title">Métriques de Performance</h3>
          
          <div className="metrics-grid">
            <div 
              className={`metric-card efficiency ${activeMetric === 'efficiency' ? 'active' : ''}`}
              onMouseEnter={() => handleMetricHover('efficiency')}
              onMouseLeave={handleMetricLeave}
            >
              <CircularProgress 
                value={animatedValues.efficiency} 
                color="#667eea" 
                size={100}
              />
              <div className="metric-info">
                <h4>Efficacité</h4>
                <p>Taux de productivité</p>
              </div>
            </div>

            <div 
              className={`metric-card completion ${activeMetric === 'completion' ? 'active' : ''}`}
              onMouseEnter={() => handleMetricHover('completion')}
              onMouseLeave={handleMetricLeave}
            >
              <CircularProgress 
                value={animatedValues.completion} 
                color="#48bb78" 
                size={100}
              />
              <div className="metric-info">
                <h4>Achèvement</h4>
                <p>Projets terminés</p>
              </div>
            </div>

            <div 
              className={`metric-card quality ${activeMetric === 'quality' ? 'active' : ''}`}
              onMouseEnter={() => handleMetricHover('quality')}
              onMouseLeave={handleMetricLeave}
            >
              <CircularProgress 
                value={animatedValues.quality} 
                color="#f093fb" 
                size={100}
              />
              <div className="metric-info">
                <h4>Qualité</h4>
                <p>Score de satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3 className="chart-title">Évolution Mensuelle</h3>
          <div className="bar-chart">
            {chartData.map((item, index) => (
              <div key={item.month} className="bar-container">
                <div 
                  className="bar"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="bar-value">{item.value}%</div>
                </div>
                <div className="bar-label">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-stats">
        <div className="quick-stat-item">
          <div className="stat-icon">📈</div>
          <div className="stat-details">
            <span className="stat-number">+12%</span>
            <span className="stat-label">Croissance ce mois</span>
          </div>
        </div>
        
        <div className="quick-stat-item">
          <div className="stat-icon">⏰</div>
          <div className="stat-details">
            <span className="stat-number">2.4h</span>
            <span className="stat-label">Temps moyen par tâche</span>
          </div>
        </div>
        
        <div className="quick-stat-item">
          <div className="stat-icon">🎯</div>
          <div className="stat-details">
            <span className="stat-number">98%</span>
            <span className="stat-label">Objectifs atteints</span>
          </div>
        </div>
        
        <div className="quick-stat-item">
          <div className="stat-icon">⭐</div>
          <div className="stat-details">
            <span className="stat-number">4.8/5</span>
            <span className="stat-label">Note moyenne</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistique;