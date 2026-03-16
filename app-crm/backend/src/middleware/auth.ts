import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../model/user.model";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: Role;
    };
}

interface TokenPayload extends JwtPayload {
    id: string;
    role: Role;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token manquant ou format invalide" });
        return;
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const jwtSecret = process.env.JWT_SECRET || 'your_secret_key';

    try {
        const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

        if (!decoded.id || !decoded.role) {
            res.status(401).json({ message: "Token invalide : informations manquantes" });
            return;
        }

        // On injecte les données du token dans la requête
        req.user = {
            userId: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
};
