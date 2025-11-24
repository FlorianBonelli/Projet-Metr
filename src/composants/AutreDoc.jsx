import React, { useState } from 'react';
import './AutreDoc.css';

const AutreDoc = ({ projectId }) => {
    const [documents] = useState([
        {
            id: 1,
            nom: 'Cahier des charges',
            date: '02/11/2025'
        },
        {
            id: 2,
            nom: 'Photo 1',
            date: '27/11/2025'
        },
        {
            id: 3,
            nom: 'Photo 2',
            date: '22/09/2025'
        }
    ]);

    return (
        <div className="autre-doc-container">
            <h2 className="autre-doc-title">Autres Documents</h2>
            
            <div className="autre-doc-table">
                <div className="table-header">
                    <div className="header-cell nom">Nom</div>
                    <div className="header-cell date">Date</div>
                </div>
                
                <div className="table-body">
                    {documents.map((doc) => (
                        <div key={doc.id} className="table-row">
                            <div className="cell nom">
                                <span className="doc-icon">📄</span>
                                <span className="doc-name">{doc.nom}</span>
                            </div>
                            <div className="cell date">{doc.date}</div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="voir-plus-container">
                <button className="voir-plus-link">+ Voir plus</button>
            </div>
        </div>
    );
};

export default AutreDoc;