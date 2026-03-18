import { useState, useEffect } from 'react';
import { getDocumentsByUserId } from '../api/document';
import { X, FileText, Loader2, Filter } from 'lucide-react';
import DocumentCard from './DocumentCard';

const UserDocumentsModal = ({ userId, userName, onClose }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    let uniqueTypes = [];
    documents.forEach(doc => {
        const type = doc.extractedData?.document_type;
        if (type && !uniqueTypes.includes(type)) {
            uniqueTypes.push(type);
        }
    });

    let filteredDocuments = documents;
    if (filterType !== 'ALL') {
        filteredDocuments = documents.filter(doc =>
            doc.extractedData?.document_type === filterType
        );
    }

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const data = await getDocumentsByUserId(userId);
                setDocuments(data);
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement des documents');
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, [userId]);

    return (
        <div className="modal-overlay">
            <div className="content-card modal-content">
                <button onClick={onClose} className="modal-close-btn">
                    <X size={24} />
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingRight: '40px' }}>
                    <h2 className="modal-header" style={{ marginBottom: 0 }}>
                        <FileText size={24} color="#0ea5e9" /> Documents de {userName}
                    </h2>

                    {documents.length > 0 && uniqueTypes.length > 0 && (
                        <div className="input-wrapper">
                            <Filter className="input-icon" size={18} />
                            <select
                                className="form-input"
                                style={{ paddingLeft: '35px', minWidth: '180px' }}
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="ALL">Tous les types</option>
                                {uniqueTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spin" size={32} color="#0ea5e9" /></div>
                ) : error ? (
                    <div className="data-unavailable" style={{ color: 'red', backgroundColor: '#fee2e2' }}>
                        {error}
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="data-unavailable">
                        Aucun document de ce type trouvé pour cet utilisateur.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {filteredDocuments.map((doc) => (
                            <DocumentCard key={doc._id} doc={doc} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDocumentsModal;
