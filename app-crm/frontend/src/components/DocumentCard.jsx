const DocumentCard = ({ doc }) => {
    return (
        <div className="content-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: 0, boxShadow: 'none' }}>
            <div className="doc-card" style={{ marginBottom: 0 }}>
                <div className="doc-header">
                    <h2 className="doc-header-title">
                        {doc.originalName || doc.filename}
                    </h2>
                    <span className={`role-badge ${doc.status === 'done' ? 'badge-success' : 'user'}`}>
                        {doc.status || 'en cours'}
                    </span>
                </div>
                <div className="doc-date">
                    <strong>Date d'ajout :</strong> {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('fr-FR') : 'Date non disponible'}
                </div>
            </div>

            <div className="extracted-data-card">
                <h3 className="extracted-data-title">
                    Données extraites
                </h3>
                
                {doc.extractedData ? (
                    <div className="extracted-data-grid">
                        <div className="data-item">
                            <small className="data-label">Type de document</small>
                            <strong className="data-value">{doc.extractedData.document_type || 'N/A'}</strong>
                        </div>
                        <div className="data-item">
                            <small className="data-label">Nom / Entreprise</small>
                            <strong className="data-value">{doc.extractedData.nom || 'N/A'}</strong>
                        </div>
                        <div className="data-item">
                            <small className="data-label">N° SIRET</small>
                            <strong className="data-value">{doc.extractedData.siret || 'N/A'}</strong>
                        </div>
                        <div className="data-item">
                            <small className="data-label">Date d'émission</small>
                            <strong className="data-value">{doc.extractedData.date_emission || 'N/A'}</strong>
                        </div>
                        <div className="data-item">
                            <small className="data-label">Date d'expiration</small>
                            <strong className="data-value">{doc.extractedData.date_expiration || 'N/A'}</strong>
                        </div>
                        <div className="data-item">
                            <small className="data-label">Numéro TVA</small>
                            <strong className="data-value">{doc.extractedData.montant_tva || 'N/A'}</strong>
                        </div>
                        <div className="data-item full-width">
                            <small className="data-label">Adresse postale</small>
                            <strong className="data-value">{doc.extractedData.adresse || 'N/A'}</strong>
                        </div>
                    </div>
                ) : (
                    <div className="data-unavailable">
                        Les données de ce document sont en cours d'extraction ou indisponibles.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentCard;
