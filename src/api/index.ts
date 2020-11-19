import { Router } from 'express';
import authRoutes from './auth';
import usersRoutes from './users';
import reportsRoutes from './reports';
import { isAuthenticated } from '../common/middleware';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/reports', isAuthenticated, reportsRoutes);

export default router;
