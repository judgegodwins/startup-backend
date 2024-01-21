import { Router } from 'express';
import authRouter from './auth/router';
import filesRouter from './fileUpload/router';
import orgRouter from './organization/router';

const router = Router();

router.use('/auth', authRouter);
router.use('/files', filesRouter);
router.use('/organization', orgRouter);

export default router;
