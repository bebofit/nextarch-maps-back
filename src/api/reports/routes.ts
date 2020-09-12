import { Router } from 'express';
import errorHandler from 'express-async-handler';
import * as controller from './controller';
import { isAuthenticated } from '../../common/middleware';

const router = Router();

router.get('/', errorHandler(controller.getReports));
router.get('/user', isAuthenticated, errorHandler(controller.getReportsByUser));
router.get('/:reportId', errorHandler(controller.getReportById));
router.post('/', isAuthenticated, errorHandler(controller.createReport));
router.patch('/:reportId', errorHandler(controller.updateReport));
router.delete('/:reportId', errorHandler(controller.softDeleteReport));

export default router;
