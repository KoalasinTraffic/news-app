import { Router } from 'express';
import { getUser, loginUser, registerUser } from '../controllers/userController.js';
import { authUser } from '../middlewares/authUser.js';

const router = Router();

router.get('/', authUser, getUser);
router.post('/login', loginUser);
router.post('/register', registerUser);

export default router;
