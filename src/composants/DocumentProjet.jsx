import React, { useState } from 'react';
import './DocumentProjet.css';

const DocumentProjet = () => {
    const [activeTab, setActiveTab] = useState('plans');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const validFiles = files.filter(file => {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            return validTypes.includes(file.type);
        });
        
        setUploadedFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="document-projet-container">
            <h2 className="document-projet-title">Documents du projet</h2>
            <p className="document-projet-subtitle">Vous pourrez ajouter des plans et documents à tout moment</p>
            
            <div className="tabs-container">
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'plans' ? 'active' : ''}`}
                        onClick={() => handleTabChange('plans')}
                    >
                        Plans
                    </button>
                    <button 
                        className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
                        onClick={() => handleTabChange('documents')}
                    >
                        Documents
                    </button>
                </div>
            </div>

            <div className="upload-section">
                <div 
                    className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="upload-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </div>
                    <h3 className="upload-title">
                        Déposer vos {activeTab} ici
                    </h3>
                    <p className="upload-subtitle">
                        Formats recommandés: DWG, PDF
                    </p>
                    
                    <input 
                        type="file" 
                        id="file-input" 
                        multiple 
                        accept=".pdf,.dwg,.jpg,.jpeg,.png,.xlsx,.xls"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                    />
                    
                    <button 
                        className="browse-button"
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        <span className="browse-icon">📁</span>
                        Parcourir les {activeTab}
                    </button>
                </div>

                {uploadedFiles.length > 0 && (
                    <div className="uploaded-files">
                        <h4>Fichiers ajoutés:</h4>
                        <ul className="file-list">
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className="file-item">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">({Math.round(file.size / 1024)} KB)</span>
                                    <button 
                                        className="remove-file"
                                        onClick={() => removeFile(index)}
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button className="add-more-button">
                    <span className="add-icon">+</span>
                    Ajouter un autre {activeTab.slice(0, -1)}
                </button>
            </div>

            <p className="upload-note">
                Vous pourrez ajouter d'autres documents après la création du projet
            </p>
        </div>
    );
};

export default DocumentProjet;