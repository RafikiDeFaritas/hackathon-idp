import { Request, Response } from 'express';
import User from '../model/user.model';
import DocumentModel from '../model/document.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-mdpHash');
        const usersWithCount = await Promise.all(
            users.map(async (user) => {
                const documentCount = await DocumentModel.countDocuments({ ownerId: user._id });
                return { ...user.toObject(), documentCount };
            })
        );
        res.status(200).json(usersWithCount);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-mdpHash');
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { mdp, email, name, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(mdp, 10);

        const newUser = new User({
            name,
            email,
            role: role || 'USER',
            mdpHash: hashedPassword
        });

        const savedUser = await newUser.save();

        const { mdpHash, ...userResponse } = savedUser.toObject();

        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { mdp, ...rest } = req.body;
        const dataToUpdate = mdp ? { ...rest, mdpHash: await bcrypt.hash(mdp, 10) } : rest;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            dataToUpdate,
            { new: true }
        ).select('-mdpHash');

        if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, mdp } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const isPasswordValid = await bcrypt.compare(mdp, user.mdpHash);
        if (!isPasswordValid) return res.status(401).json({ message: 'Mot de passe incorrect' });

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion de l'utilisateur", error });
    }
};
