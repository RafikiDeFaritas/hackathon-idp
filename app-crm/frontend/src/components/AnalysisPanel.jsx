import { FileText } from 'lucide-react';

const AnalysisPanel = () => {
    return (
        <div className="analysis-panel">
            <div className="icon-box light-dark">
                <FileText size={40} />
            </div>
            <h2 className="panel-title white">Analyse en attente</h2>
            <p className="panel-description gray">
                Les résultats apparaîtront ici après traitement
            </p>
        </div>
    );
};

export default AnalysisPanel;
