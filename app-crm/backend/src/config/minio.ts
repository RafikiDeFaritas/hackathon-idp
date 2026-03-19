import { Client } from "minio";

export const DATA_LAKE_BUCKET =
  process.env.MINIO_BUCKET || "document-datalake";

const requiredEnv = [
  "MINIO_ENDPOINT",
  "MINIO_PORT",
  "MINIO_ACCESS_KEY",
  "MINIO_SECRET_KEY"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`variable env manquante: ${key}`);
  }
});

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const ensureBucketExists = async (): Promise<void> => {
  try {
    const exists = await minioClient.bucketExists(DATA_LAKE_BUCKET);

    if (!exists) {
      await minioClient.makeBucket(DATA_LAKE_BUCKET, "us-east-1");
      console.log(`Bucket '${DATA_LAKE_BUCKET}' créé.`);
    }
  } catch (error) {
    console.error("Erreur MinIO :", error);
  }
};