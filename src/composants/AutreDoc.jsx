import React from 'react';
import './AutreDoc.css';

const documents = [
    { id: 1, nom: 'Cahier des charges', date: '02/11/2025' },
    { id: 2, nom: 'Photo 1', date: '27/11/2025' },
    { id: 3, nom: 'Photo 2', date: '22/09/2025' }
];

const ExternalLinkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#0f172a" strokeWidth="1.6">
        <path d="M7.5 5H5a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2V13" strokeLinecap="round" />
        <path d="M11.5 3.5h5v5" strokeLinecap="round" />
        <path d="M16.5 3.5 8 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AutreDoc = () => (
    <section className="autre-doc-card">
        <div className="doc-card-header">
            <p className="doc-label">Documents</p>
            <h2 className="doc-title">Autres Documents</h2>
        </div>

        <div className="doc-table">
            <div className="doc-row doc-row-head">
                <span className="doc-cell">Nom</span>
                <span className="doc-cell doc-cell-date">Date</span>
            </div>
            {documents.map((doc) => (
                <div key={doc.id} className="doc-row">
                    <span className="doc-cell doc-name-wrapper">
                        <span className="doc-dot" />
                        <span className="doc-name">{doc.nom}</span>
                        <button className="doc-open" aria-label={`Ouvrir ${doc.nom}`}>
                            <ExternalLinkIcon />
                        </button>
                    </span>
                    <span className="doc-cell doc-cell-date">{doc.date}</span>
                </div>
            ))}
        </div>

        <button className="doc-more-btn">+ Voir plus</button>
    </section>
);

export default AutreDoc;