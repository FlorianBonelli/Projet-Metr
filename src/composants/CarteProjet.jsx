import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./CarteProjet.css";
import Icon3Points from "../assets/images/3points.svg";
import IconOuvrir from "../assets/images/Ouvrir.svg";
import IconDossier from "../assets/images/Dossier.svg";
import { projectService } from '../db/database';

export default function CarteProjet({
  id,
  title = "Résidence Les Ormes",
  subtitle = "Bouygues Immobilier",
  date = "Créé le 02/03/2025",
  statusText = "En cours",
  statusType = "active",
  phase = "ESQ",
  onDelete,
  onEdit,
  onArchive,
  onStatusChange,
  onPhaseChange,
  isShared = false,
  userRole = null
}) {
  // Déterminer si l'utilisateur peut éditer ce projet
  const canEdit = !isShared || userRole === 'edition';
  const canDelete = !isShared; // Seul le propriétaire peut supprimer
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPhaseMenu, setShowPhaseMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const isArchived = statusText?.toLowerCase().includes('archiv');

  // Fermer le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleArchive = async () => {
    try {
      const newStatus = isArchived ? 'En cours' : 'Archivé';
      
      // Récupérer l'ID utilisateur pour les notifications
      const userInfo = localStorage.getItem('userInfo');
      let userId = null;
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        userId = userData.id_utilisateur || userData.id;
      }
      
      await projectService.updateProject(id, { status: newStatus }, userId);
      setShowMenu(false);
      if (onArchive) {
        onArchive(id, { status: newStatus });
      }
    } catch (error) {
      console.error('Erreur lors de l\'archivage du projet:', error);
      alert('Erreur lors de l\'archivage du projet');
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${title}" ?`)) {
      try {
        await projectService.deleteProject(id);
        setShowMenu(false);
        if (onDelete) {
          onDelete(id);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error);
        alert('Erreur lors de la suppression du projet');
      }
    }
  };

  const handleDossierClick = () => {
    navigate(`/info-projet/${id}`);
  };

  const handleOuvrirClick = () => {
    window.open('https://app.metr-plan.com/project/dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXV0b2Rlc2tfdmlld2VyX2ZpbGVzXzEvMTc2MTA2MzE0NDI2NS1SZXN0YXVyYW50LmR3Zw', '_blank');
  };

  const toggleStatusMenu = (e) => {
    e.stopPropagation();
    setShowStatusMenu((prev) => !prev);
    setShowPhaseMenu(false);
  };

  const togglePhaseMenu = (e) => {
    e.stopPropagation();
    setShowPhaseMenu((prev) => !prev);
    setShowStatusMenu(false);
  };

  // Changement d'état via menu personnalisé
  const handleStatusChange = async (newStatus) => {
    try {
      // Récupérer l'ID utilisateur pour les notifications
      const userInfo = localStorage.getItem('userInfo');
      let userId = null;
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        userId = userData.id_utilisateur || userData.id;
      }

      await projectService.updateProject(id, { status: newStatus }, userId);

      // Prévenir le parent pour mettre à jour la liste locale
      if (onStatusChange) {
        onStatusChange(id, newStatus);
      }

      // Si on vient de passer en archivé, on peut aussi utiliser le callback d'archivage existant
      if (newStatus.toLowerCase().includes('archiv') && onArchive) {
        onArchive(id, { status: newStatus });
      }

      setShowStatusMenu(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état du projet:", error);
      alert("Erreur lors de la mise à jour de l'état du projet");
    }
  };

  // Changement de phase
  const handlePhaseChange = async (newPhase) => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      let userId = null;
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        userId = userData.id_utilisateur || userData.id;
      }

      await projectService.updateProject(id, { phase: newPhase }, userId);

      if (onPhaseChange) {
        onPhaseChange(id, newPhase);
      }

      setShowPhaseMenu(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la phase du projet:", error);
      alert("Erreur lors de la mise à jour de la phase du projet");
    }
  };
  return (
    <div className={`carte-projet ${isShared ? 'carte-projet-shared' : ''}`}>
      <div className="carte-header">
        <span className="carte-title">
          {title}
          {isShared && (
            <span className={`shared-badge ${userRole}`}>
              {userRole === 'edition' ? '✏️ Éditeur' : '👁️ Lecteur'}
            </span>
          )}
        </span>
        {canEdit && (
          <div className="carte-menu" ref={menuRef}>
            <img 
              src={Icon3Points} 
              alt="Options" 
              className="icon-3points" 
              onClick={handleMenuToggle}
            />
            {showMenu && (
              <div className="menu-popup">
                <button className="menu-item" onClick={handleArchive}>
                  <span className="menu-icon">📦</span>
                  {isArchived ? 'Restaurer' : 'Archivé'}
                </button>
                <button className="menu-item" onClick={handleEdit}>
                  <span className="menu-icon">📝</span>
                  Modifier
                </button>
                {canDelete && (
                  <button className="menu-item menu-item-delete" onClick={handleDelete}>
                    <span className="menu-icon">🗑️</span>
                    Supprimer
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="carte-subtitle">{subtitle}</div>
      <div className="carte-date">{date}</div>
      <div className="carte-status-row">
        <div className="carte-status">
          {canEdit ? (
            <button
              type="button"
              className={`status status-${statusType} status-toggle`}
              onClick={toggleStatusMenu}
            >
              {statusText || 'En cours'}
            </button>
          ) : (
            <span className={`status status-${statusType}`}>
              {statusText || 'En cours'}
            </span>
          )}
          {showStatusMenu && canEdit && (
            <div className="status-menu">
              <button
                type="button"
                className="status-option status-option-en-cours"
                onClick={() => handleStatusChange('En cours')}
              >
                En cours
              </button>
              <button
                type="button"
                className="status-option status-option-termine"
                onClick={() => handleStatusChange('Terminé')}
              >
                Terminé
              </button>
              <button
                type="button"
                className="status-option status-option-archive"
                onClick={() => handleStatusChange('Archivé')}
              >
                Archivé
              </button>
            </div>
          )}
        </div>
        
        <div className="carte-phase">
          {canEdit ? (
            <button
              type="button"
              className="phase phase-toggle"
              onClick={togglePhaseMenu}
            >
              {phase || 'ESQ'}
            </button>
          ) : (
            <span className="phase">
              {phase || 'ESQ'}
            </span>
          )}
          {showPhaseMenu && canEdit && (
            <div className="phase-menu">
              <button
                type="button"
                className="phase-option"
                onClick={() => handlePhaseChange('ESQ')}
              >
                ESQ
              </button>
              <button
                type="button"
                className="phase-option"
                onClick={() => handlePhaseChange('APS')}
              >
                APS
              </button>
              <button
                type="button"
                className="phase-option"
                onClick={() => handlePhaseChange('APD')}
              >
                APD
              </button>
              <button
                type="button"
                className="phase-option"
                onClick={() => handlePhaseChange('DCE')}
              >
                DCE
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="carte-actions">
        <button className="btn-primary" onClick={handleOuvrirClick}>
          <img src={IconOuvrir} alt="Ouvrir" className="icon-action" />
          Ouvrir
        </button>
        <button className="btn-secondary" onClick={handleDossierClick}>
          <img src={IconDossier} alt="Dossier" className="icon-action" />
          Dossier
        </button>
      </div>
    </div>
  );
}
