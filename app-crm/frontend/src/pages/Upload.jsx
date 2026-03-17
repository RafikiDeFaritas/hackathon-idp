import { useState } from 'react';
import UploadPanel from '../components/UploadPanel';
import AnalysisPanel from '../components/AnalysisPanel';

const Upload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-container">
                <UploadPanel file={file} onFileChange={handleFileChange} />
                <AnalysisPanel />
            </div>
        </div>
    );
};

export default Upload;
