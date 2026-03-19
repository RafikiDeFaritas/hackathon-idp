import { FileText } from 'lucide-react';

const DocumentResult = ({ doc }) => {
    const data = doc.extractedData;
    if (!data) return null;

    return (
        <div style={{ marginBottom: '1.5rem', border: '1px solid #374151', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#1f2937', padding: '8px 12px', color: '#9ca3af', fontSize: '0.85rem' }}>
                {doc.originalName}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {Object.entries(data).filter(([key]) => key !== 'siret_info').map(([key, value]) => (
                        <tr key={key} style={{ borderBottom: '1px solid #374151' }}>
                            <td style={{ padding: '8px', color: '#9ca3af', fontWeight: 'bold', width: '40%' }}>
                                {key}
                            </td>
                            <td style={{ padding: '8px', color: '#f3f4f6' }}>
                                {String(value) || '—'}
                            </td>
                        </tr>
                    ))}
                    {data.siret_info && (
                        <tr style={{ borderBottom: '1px solid #374151' }}>
                            <td style={{ padding: '8px', color: '#9ca3af', fontWeight: 'bold' }}>siret_valide</td>
                            <td style={{ padding: '8px' }}>
                                {data.siret_info.valide
                                    ? <span style={{ color: '#22c55e' }}>{data.siret_info.nomEntreprise} ({data.siret_info.etatAdministratif === 'A' ? 'Active' : data.siret_info.etatAdministratif})</span>
                                    : <span style={{ color: '#ef4444' }}>SIRET introuvable</span>
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const AnalysisPanel = ({ status, message, documents = [] }) => {
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

            {documents.length > 0 && (
                <div style={{ marginTop: '1.5rem', width: '100%', textAlign: 'left' }}>
                    {documents.map((doc, i) => (
                        <DocumentResult key={doc._id || i} doc={doc} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnalysisPanel;
