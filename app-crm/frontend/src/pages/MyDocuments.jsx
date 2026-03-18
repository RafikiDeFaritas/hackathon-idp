import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Filter } from 'lucide-react';
import { getDocuments } from '../api/document';

const MyDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const navigate = useNavigate();

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
        const loadDocuments = async () => {
            setLoading(true);
            setError('');

            try {
                const items = await getDocuments();
                setDocuments(items);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur de chargement des documents');
            } finally {
                setLoading(false);
            }
        };

        loadDocuments();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <p>Chargement des documents...</p>;
        }

        if (error) {
            return <p style={{ color: '#b91c1c' }}>{error}</p>;
        }

        if (documents.length === 0) {
            return <p>Aucun document charge pour le moment.</p>;
        }

        return (
            <ul className="doc-list">
                {filteredDocuments.map((doc) => (
                    <li key={doc._id || doc.filename} className="doc-list-item">
                        <div className="doc-list-info">
                            <strong className="doc-list-title">{doc.originalName}</strong>
                            <div className="doc-list-meta">
                                <span className={`role-badge ${doc.status === 'done' ? 'badge-success' : 'user'}`}>
                                    {doc.status || 'uploaded'}
                                </span>
                                {doc.createdAt && `Ajouté le ${new Date(doc.createdAt).toLocaleDateString('fr-FR')}`}
                            </div>
                        </div>
                        <button
                            className="btn-upload-primary btn-icon"
                            onClick={() => navigate('/documents/details', { state: { doc } })}
                        >
                            <Eye size={18} /> Voir les détails
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title no-margin">Mes documents</h1>

                {documents.length > 0 && uniqueTypes.length > 0 && (
                    <div className="input-wrapper">
                        <Filter className="input-icon" size={18} />
                        <select
                            className="form-input filter-select"
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
            <div className="content-card">
                {renderContent()}
            </div>
        </div>
    );
};

export default MyDocuments;
