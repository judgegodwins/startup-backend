import { Router } from 'express';
import FileController from './controller';
import isAuthenticatedUser from '../../middleware/auth/isAuthenticatedUser';

const router = Router();

router.get('/signed-url', isAuthenticatedUser(), FileController.getUploadSignedUrl);

export default router;
