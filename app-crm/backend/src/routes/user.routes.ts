import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();


router.post('/login', loginUser);
router.post('/register', createUser);

router.use(authenticate);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
