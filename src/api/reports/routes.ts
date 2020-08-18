import { Router } from 'express';
import errorHandler from 'express-async-handler';
import * as controller from './controller';

const router = Router();

router.get('/', errorHandler(controller.getReports));
router.get('/:reportId', errorHandler(controller.getReportById));
router.post('/', errorHandler(controller.createReport));
router.patch('/:reportId', errorHandler(controller.updateReport));
router.delete('/:reportId', errorHandler(controller.softDeleteReport));

export default router;
