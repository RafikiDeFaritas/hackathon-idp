import { Client } from "minio";

export const DATA_LAKE_BUCKET = process.env.MINIO_BUCKET || "document-datalake";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT || 9000),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "admin",
  secretKey: process.env.MINIO_SECRET_KEY || "password123"
});

export const ensureBucketExists = async (): Promise<void> => {
  try {
    const exists = await minioClient.bucketExists(DATA_LAKE_BUCKET);
    if (!exists) {
      await minioClient.makeBucket(DATA_LAKE_BUCKET, "us-east-1");
      console.log(`Bucket '${DATA_LAKE_BUCKET}' créé.`);
    }
  } catch (error) {
    console.error("Erreur lors de la vérification/creation du bucket MinIO :", error);
  }
};
