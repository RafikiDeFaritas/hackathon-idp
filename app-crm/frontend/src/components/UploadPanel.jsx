import { Upload as UploadIcon } from 'lucide-react';

const UploadPanel = ({ file, onFileChange }) => {
    return (
        <div className="dropzone-panel">
            <div className="icon-box dark">
                <UploadIcon size={32} />
            </div>
            <h2 className="panel-title">Téléchargeur de documents</h2>
            <p className="panel-description">
                Glissez-déposez votre fichier PDF ou cliquez pour sélectionner
            </p>
            <label className="btn-upload-primary">
                Sélectionner un fichier
                <input
                    type="file"
                    className="hidden-input"
                    accept=".pdf"
                    onChange={onFileChange}
                />
            </label>
            {file && (
                <p className="selected-file" style={{ marginTop: '15px', color: '#2c3444', fontSize: '0.8rem' }}>
                    Fichier : {file.name}
                </p>
            )}
        </div>
    );
};

export default UploadPanel;
