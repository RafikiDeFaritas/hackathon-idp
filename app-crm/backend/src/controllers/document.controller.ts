import { Request, Response } from "express";
import DocumentModel from "../model/document.model";

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: "Aucun fichier n'a été téléchargé" });
            return;
        }

        const document = await DocumentModel.create({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path
        });

        res.json({
            message: "Fichier téléchargé avec succès",
            document
        });
    } catch (err: any) {
        console.error("Erreur lors de l'upload :", err);
        res.status(500).json({ error: err.message });
    }
};

export const getDocuments = async (_req: Request, res: Response): Promise<void> => {
    try {
        const documents = await DocumentModel.find().sort({ createdAt: -1 });
        res.json(documents);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
