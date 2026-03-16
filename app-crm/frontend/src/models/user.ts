export type Role = 'USER' | 'ADMIN';

export interface User {
    _id?: string;
    role: Role;
    name: string;
    email: string;
    mdp?: string;
    mdpHash?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export const UserInitial: User = {
    name: '',
    email: '',
    mdp: '',
    role: 'USER'
};