import { useState } from 'react';
import UploadPanel from '../components/UploadPanel';
import AnalysisPanel from '../components/AnalysisPanel';
import { uploadDocuments } from '../api/document';

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [uploadedDocs, setUploadedDocs] = useState([]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
            setUploadStatus('idle');
            setStatusMessage('');
        }
    };

    const handleUpload = async () => {
        if (!files.length || isUploading) return;

        setIsUploading(true);
        setUploadStatus('uploading');
        setStatusMessage('Envoi du document en cours...');
        setUploadedDocs([]);

        try {
            const documents = await uploadDocuments(files);
            setUploadStatus('success');
            setStatusMessage(`${documents.length} document(s) envoyé(s) avec succès`);
            setUploadedDocs(documents);
        } catch (error) {
            setUploadStatus('error');
            setStatusMessage(error instanceof Error ? error.message : 'Erreur pendant upload');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-container">
                <UploadPanel
                    files={files}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    isUploading={isUploading}
                />
                <AnalysisPanel status={uploadStatus} message={statusMessage} documents={uploadedDocs} />
            </div>
        </div>
    );
};

export default Upload;
