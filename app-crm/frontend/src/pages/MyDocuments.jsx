
import { useEffect, useState } from 'react';
import { getDocuments } from '../api/document';

const MyDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
                {documents.map((doc) => (
                    <li key={doc._id || doc.filename} style={{ padding: '12px', borderRadius: '10px', background: '#f7f8fa', border: '1px solid #e5e7eb' }}>
                        <strong>{doc.originalName}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '6px' }}>
                            Statut: {doc.status || 'uploaded'}
                        </div>
                        {doc.createdAt && (
                            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
                                Ajoute le {new Date(doc.createdAt).toLocaleString('fr-FR')}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Mes documents</h1>
            <div className="content-card">
                {renderContent()}
            </div>
        </div>
    );
};

export default MyDocuments;
