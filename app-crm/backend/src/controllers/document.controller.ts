import { Request, Response } from "express";
import DocumentModel from "../model/document.model";
import { AuthRequest } from "../middleware/auth";

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
