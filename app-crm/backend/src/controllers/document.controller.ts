import fs from "fs";
import { Request, Response } from "express";
import DocumentModel from "../model/document.model";
import { AuthRequest } from "../middleware/auth";
import { minioClient, DATA_LAKE_BUCKET, ensureBucketExists } from "../config/minio";

const OCR_API_URL = process.env.OCR_API_URL || "http://localhost:8000";
const DATA_LAKE_RAW = process.env.DATA_LAKE_RAW || "/data-lake/raw";

async function validateSiret(siret: string) {
    if (!siret || siret.length !== 14) return null;
    try {
        const res = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${siret}&per_page=1`);
        const data = await res.json() as any;
        const company = data.results?.[0];
        if (!company) return { valide: false };
        return {
            valide: true,
            etatAdministratif: company.siege?.etat_administratif || "A",
            nomEntreprise: company.nom_complet || company.denomination || "",
        };
    } catch {
        return null;
    }
}

async function callOcrApi(filePath: string, originalName: string) {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: "application/pdf" });
    formData.append("file", blob, originalName);

    const response = await fetch(`${OCR_API_URL}/extract`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error(`OCR API error: ${response.status}`);

    const data = await response.json();
    return data.extracted_data || data;
}

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Utilisateur non authentifie" });
            return;
        }

        const files = Array.isArray(req.files) ? req.files : req.file ? [req.file] : [];
        if (!files || files.length === 0) {
            res.status(400).json({ message: "Aucun fichier n'a été téléchargé" });
            return;
        }

        await ensureBucketExists();
        fs.mkdirSync(DATA_LAKE_RAW, { recursive: true });

        const results = [];

        for (const file of files) {
            const objectName = `raw/${file.filename}`;
            await minioClient.fPutObject(DATA_LAKE_BUCKET, objectName, file.path);

            const document = await DocumentModel.create({
                ownerId: req.user.userId,
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                objectPath: objectName,
                status: "processing",
            });

            fs.copyFileSync(file.path, `${DATA_LAKE_RAW}/${file.originalname}`);

            try {
                const extractedData = await callOcrApi(file.path, file.originalname);
                const siretInfo = await validateSiret(extractedData?.siret);
                (document as any).extractedData = { ...extractedData, siret_info: siretInfo };
                document.status = "done";
            } catch (err) {
                console.error("OCR échoué :", err);
                document.status = "ocr_failed";
            }

            await document.save();
            results.push(document);
        }

        res.json({ message: `${results.length} fichiers téléchargés avec succès`, documents: results });
    } catch (err: any) {
        console.error("Erreur lors de l'upload :", err);
        res.status(500).json({ error: err.message });
    }
};

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Utilisateur non authentifie" });
            return;
        }
        const query = { ownerId: req.user.userId };
        const documents = await DocumentModel.find(query).sort({ createdAt: -1 });
        res.json(documents);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getDocumentsByUserId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            res.status(403).json({ message: "Accès refusé" });
            return;
        }
        const documents = await DocumentModel.find({ ownerId: req.params.userId }).sort({ createdAt: -1 });
        res.json(documents);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};