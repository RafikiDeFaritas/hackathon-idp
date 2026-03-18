import { FileText } from 'lucide-react';

const AnalysisPanel = ({ status, message }) => {
    const title =
        status === 'success'
            ? 'Upload termine'
            : status === 'error'
            ? 'Upload en erreur'
            : status === 'uploading'
            ? 'Upload en cours'
            : 'Analyse en attente';

    return (
        <div className="analysis-panel">
            <div className="icon-box light-dark">
                <FileText size={40} />
            </div>
            <h2 className="panel-title white">{title}</h2>
            <p className="panel-description gray">
                {message || 'Les resultats apparaitront ici apres traitement'}
            </p>
        </div>
    );
};

export default AnalysisPanel;
