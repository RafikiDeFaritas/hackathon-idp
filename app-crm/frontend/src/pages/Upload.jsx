import { useState } from 'react';
import UploadPanel from '../components/UploadPanel';
import AnalysisPanel from '../components/AnalysisPanel';
import { uploadDocument } from '../api/document';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [extractedData, setExtractedData] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadStatus('idle');
            setStatusMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file || isUploading) return;

        setIsUploading(true);
        setUploadStatus('uploading');
        setStatusMessage('Envoi du document en cours...');
        setExtractedData(null);

        try {
            const document = await uploadDocument(file);
            setUploadStatus('success');
            setStatusMessage(`Document envoye: ${document.originalName}`);
            setExtractedData(document.extractedData || null);
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
                    file={file}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    isUploading={isUploading}
                />
                <AnalysisPanel status={uploadStatus} message={statusMessage} extractedData={extractedData} />
            </div>
        </div>
    );
};

export default Upload;
