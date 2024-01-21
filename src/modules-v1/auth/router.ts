import { Router } from 'express';
import AuthController from './controller';
import isAuthenticatedUser from '../../middleware/auth/isAuthenticatedUser';
import { TokenFlag } from '../../database/entities/enum';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/email/verify', AuthController.verifyEmail);

router.get('/user', isAuthenticatedUser(), AuthController.getUser);
router.get('/user/organizations', isAuthenticatedUser(), AuthController.getUserOrganizations);

router.patch('/profile', isAuthenticatedUser(TokenFlag.AUTH), AuthController.updateProfile);

export default router;
