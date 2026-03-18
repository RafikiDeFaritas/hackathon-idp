import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import DocumentCard from '../components/DocumentCard';

const DocumentDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const doc = location.state?.doc;

    if (!doc) {
        return (
            <div className="page-container">
                <p style={{ marginBottom: '20px' }}>Document introuvable. Veuillez retourner à la liste.</p>
                <button className="btn-upload-primary btn-icon" onClick={() => navigate(-1)}>Retour</button>
            </div>
        );
    }

    return (
        <div className="page-container">
            <button className="btn-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Retour
            </button>

            <h1 className="page-title page-title-icon">
                <FileText color="#0ea5e9" size={32} /> Détails du Document
            </h1>
            
            <DocumentCard doc={doc} />
        </div>
    );
};

export default DocumentDetails;
