import React, { useState } from 'react';
import { storage } from '../services/firebase';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleUpload = () => {
        if (file) {
            const storageRef = storage.ref();
            const uploadTask = storageRef.child(file.name).put(file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Erro no upload:', error);
                },
                () => {
                    console.log('Upload completo.');
                    // O arquivo foi carregado com sucesso
                    // Você pode adicionar aqui o código para processar o arquivo carregado
                }
            );
        }
    };

    return (
        <div>
            <input type="file" onChange={handleChange} accept="application/pdf" />
            <button onClick={handleUpload}>Upload</button>
            {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
        </div>
    );
};

export default FileUpload;
