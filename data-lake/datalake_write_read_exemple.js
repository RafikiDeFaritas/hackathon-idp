const path = require('path');
const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'admin',
  secretKey: 'password123'
});

const localFile = path.join(__dirname, 'invoice.pdf');
const bucketName = 'document-datalake';
const objectName = 'raw/invoices/invoice.pdf';

//write file on datalake
minioClient.fPutObject(bucketName, objectName, localFile, (err, etag) => {
  if (err) {
    console.error('Erreur upload Minio :', err);
    process.exit(1);
  }
  console.log('Upload reussi', { bucket: bucketName, object: objectName, etag });


  // Exemple de lecture du fichier uploade 
  const source_file = 'raw/invoices/invoice.pdf';
  minioClient.getObject(bucketName, source_file, (err2, stream) => {
    if (err2) {
      console.error('Erreur lecture Minio :', err2);
      return;
    }
    let chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => {
      const fileBuffer = Buffer.concat(chunks);
      console.log('Lecture reussie du chemin', source_file, '- taille:', fileBuffer.length);
      // Exemple sauvegarde en local pour verif
      const fs = require('fs');
      const localOut = path.join(__dirname, 'invoice_downloaded.pdf');
      fs.writeFileSync(localOut, fileBuffer);
      console.log('Fichier ecrit localement dans', localOut);
    });
    stream.on('error', (streamErr) => {
      console.error('Erreur stream Minio :', streamErr);
    });
  });
});