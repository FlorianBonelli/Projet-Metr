import React, { useState } from 'react';
import './InfoProjet.css';

const InfoProjet = ({ onDataChange }) => {
    const [formData, setFormData] = useState({
        nomProjet: '',
        client: '',
        referenceInterne: '',
        typologieProjet: '',
        adresseProjet: '',
        dateLivraison: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFormData = {
            ...formData,
            [name]: value
        };
        setFormData(newFormData);
        
        // Transmettre les données au composant parent
        if (onDataChange) {
            onDataChange(newFormData);
        }
    };

    return (
        <div className="info-projet-container">
            <h2 className="info-projet-title">Informations du projet</h2>
            <p className="info-projet-subtitle">Complétez les informations principales pour créer votre nouveau projet</p>
            
            <form className="info-projet-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nomProjet">Nom du projet*</label>
                        <input
                            type="text"
                            id="nomProjet"
                            name="nomProjet"
                            placeholder="Ex: Villa Méditerranée"
                            value={formData.nomProjet}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="client">Client*</label>
                        <input
                            type="text"
                            id="client"
                            name="client"
                            placeholder="Ex: Dupont Immobilier"
                            value={formData.client}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="referenceInterne">Référence interne</label>
                        <input
                            type="text"
                            id="referenceInterne"
                            name="referenceInterne"
                            placeholder="Ex: PRJ-2025-042"
                            value={formData.referenceInterne}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="typologieProjet">Typologie projet*</label>
                        <select
                            id="typologieProjet"
                            name="typologieProjet"
                            value={formData.typologieProjet}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Sélectionnez une typologie</option>
                            <option value="residentiel">Résidentiel</option>
                            <option value="commercial">Commercial</option>
                            <option value="industriel">Industriel</option>
                            <option value="public">Public</option>
                            <option value="renovation">Rénovation</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="adresseProjet">Adresse du projet</label>
                        <input
                            type="text"
                            id="adresseProjet"
                            name="adresseProjet"
                            placeholder="Ex: 12 Avenue des Plats, 75001 Paris"
                            value={formData.adresseProjet}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateLivraison">Date prévisionnelle de livraison</label>
                        <input
                            type="date"
                            id="dateLivraison"
                            name="dateLivraison"
                            value={formData.dateLivraison}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default InfoProjet;