import React from "react";
import "./CarteProjet.css";
import Icon3Points from "../assets/images/3points.svg";
import IconOuvrir from "../assets/images/Ouvrir.svg";
import IconDossier from "../assets/images/Dossier.svg";

export default function CarteProjet({
  title = "Résidence Les Ormes",
  subtitle = "Bouygues Immobilier",
  date = "Créé le 02/03/2025",
  statusText = "En cours",
  statusType = "active",
}) {
  return (
    <div className="carte-projet">
      <div className="carte-header">
        <span className="carte-title">{title}</span>
        <span className="carte-menu">
          <img src={Icon3Points} alt="Options" className="icon-3points" />
        </span>
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
        <button className="btn-secondary">
          <img src={IconDossier} alt="Dossier" className="icon-action" />
          Dossier
        </button>
      </div>
    </div>
  );
}
