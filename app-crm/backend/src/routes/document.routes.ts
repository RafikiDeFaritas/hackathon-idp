import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { uploadDocument, getDocuments, getDocumentsByUserId } from "../controllers/document.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();
const uploadDir = process.env.DATA_LAKE_RAW || path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes pour les documents
// On peut ajouter authenticate ici si on veut restreindre l'accès
router.post("/upload", authenticate, upload.array("files", 20), uploadDocument);
router.get("/", authenticate, getDocuments);
router.get("/user/:userId", authenticate, getDocumentsByUserId);

export default router;
