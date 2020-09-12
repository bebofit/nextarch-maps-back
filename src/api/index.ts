import { Router } from 'express';
import authRoutes from './auth';
import usersRoutes from './users';
import reportsRoutes from './reports';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/reports', reportsRoutes);

export default router;
