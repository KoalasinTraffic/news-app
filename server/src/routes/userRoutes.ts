import { getUser, loginUser, registerUser } from '@/controllers/userController.ts';
import { authUser } from '@/middlewares/authUser.ts';
import { Router } from 'express';

const router = Router();

router.get('/', authUser, getUser);
router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;
