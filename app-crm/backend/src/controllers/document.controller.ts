import fs from "fs";
import { Request, Response } from "express";
import DocumentModel from "../model/document.model";
import { AuthRequest } from "../middleware/auth";

const OCR_API_URL = process.env.OCR_API_URL || "http://localhost:8000";

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

    const data = await response.json() as { extracted_data: Record<string, any> };
    return data.extracted_data;
}

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Utilisateur non authentifie" });
            return;
        }

        const file = req.file;

        if (!file) {
            res.status(400).json({ message: "Aucun fichier n'a été téléchargé" });
            return;
        }

        const document = await DocumentModel.create({
            ownerId: req.user.userId,
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            status: "processing",
        });

        try {
            const extractedData = await callOcrApi(file.path, file.originalname);
            document.extractedData = extractedData;
            document.status = "done";
        } catch (err) {
            console.error("OCR échoué :", err);
            document.status = "ocr_failed";
        }

        await document.save();

        res.json({ message: "Fichier téléchargé avec succès", document });
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

        const query = req.user.role === "ADMIN" ? {} : { ownerId: req.user.userId };
        const documents = await DocumentModel.find(query).sort({ createdAt: -1 });
        res.json(documents);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
