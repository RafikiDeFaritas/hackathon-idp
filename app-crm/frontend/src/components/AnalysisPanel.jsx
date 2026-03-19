import { FileText } from 'lucide-react';

const AnalysisPanel = ({ status, message, extractedData }) => {
    const title =
        status === 'success'
            ? 'Analyse terminée'
            : status === 'error'
            ? 'Upload en erreur'
            : status === 'uploading'
            ? 'Upload en cours...'
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

            {extractedData && (
                <div style={{ marginTop: '1.5rem', width: '100%', textAlign: 'left' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {Object.entries(extractedData).filter(([key]) => key !== 'siret_info').map(([key, value]) => (
                                <tr key={key} style={{ borderBottom: '1px solid #374151' }}>
                                    <td style={{ padding: '8px', color: '#9ca3af', fontWeight: 'bold', width: '40%' }}>
                                        {key}
                                    </td>
                                    <td style={{ padding: '8px', color: '#f3f4f6' }}>
                                        {value || '—'}
                                    </td>
                                </tr>
                            ))}
                            {extractedData.siret_info && (
                                <tr style={{ borderBottom: '1px solid #374151' }}>
                                    <td style={{ padding: '8px', color: '#9ca3af', fontWeight: 'bold' }}>siret_valide</td>
                                    <td style={{ padding: '8px' }}>
                                        {extractedData.siret_info.valide
                                            ? <span style={{ color: '#22c55e' }}>{extractedData.siret_info.nomEntreprise} ({extractedData.siret_info.etatAdministratif === 'A' ? 'Active' : extractedData.siret_info.etatAdministratif})</span>
                                            : <span style={{ color: '#ef4444' }}>SIRET introuvable</span>
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AnalysisPanel;
