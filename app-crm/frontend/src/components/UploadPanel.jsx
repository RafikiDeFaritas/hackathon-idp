import { Upload as UploadIcon } from 'lucide-react';

const UploadPanel = ({ files, onFileChange, onUpload, isUploading }) => {
    return (
        <div className="dropzone-panel">
            <div className="icon-box dark">
                <UploadIcon size={32} />
            </div>
            <h2 className="panel-title">Téléchargeur de documents</h2>
            <p className="panel-description">
                Glissez-déposez vos fichiers PDF ou cliquez pour sélectionner
            </p>
            <label className="btn-upload-primary">
                Sélectionner des fichiers
                <input
                    type="file"
                    className="hidden-input"
                    accept=".pdf"
                    multiple
                    onChange={onFileChange}
                />
            </label>
            <button
                type="button"
                className="btn-upload-primary"
                onClick={onUpload}
                disabled={!files?.length || isUploading}
                style={{ marginTop: '10px', opacity: !files?.length || isUploading ? 0.6 : 1 }}
            >
                {isUploading ? 'Upload en cours...' : 'Lancer upload'}
            </button>
            {files?.length > 0 && (
                <div className="selected-file" style={{ marginTop: '15px', color: '#2c3444', fontSize: '0.8rem' }}>
                    <strong>{files.length}</strong> fichier(s) sélectionné(s)
                    <ul style={{ margin: '8px 0 0', paddingLeft: '16px' }}>
                        {files.map((f) => (
                            <li key={f.name + f.size}>{f.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadPanel;
