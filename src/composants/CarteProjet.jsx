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
  onEdit
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
        <span className={`status status-${statusType}`}>{statusText}</span>
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
