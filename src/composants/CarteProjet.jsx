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
  onDelete,
  onEdit,
  onArchive,
  onStatusChange
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
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

  const toggleStatusMenu = (e) => {
    e.stopPropagation();
    setShowStatusMenu((prev) => !prev);
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
  return (
    <div className="carte-projet">
      <div className="carte-header">
        <span className="carte-title">{title}</span>
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
              <button className="menu-item menu-item-delete" onClick={handleDelete}>
                <span className="menu-icon">🗑️</span>
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="carte-subtitle">{subtitle}</div>
      <div className="carte-date">{date}</div>
      <div className="carte-status">
        <button
          type="button"
          className={`status status-${statusType} status-toggle`}
          onClick={toggleStatusMenu}
        >
          {statusText || 'En cours'}
        </button>
        {showStatusMenu && (
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
      <div className="carte-actions">
        <button className="btn-primary">
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
