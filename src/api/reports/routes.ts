import { Router } from 'express';
import errorHandler from 'express-async-handler';
import * as controller from './controller';
import { uploadUserReportPhotos, isSuperAdmin } from '../../common/middleware';

const router = Router();

router.get('/', isSuperAdmin, errorHandler(controller.getReports));
router.get('/user', errorHandler(controller.getReportsByUser));
router.get('/:reportId', errorHandler(controller.getReportById));
router.post('/', errorHandler(controller.createReport));
router.delete(
  '/:reportId',
  isSuperAdmin,
  errorHandler(controller.softDeleteReport)
);
router.patch('/addImgs', uploadUserReportPhotos, controller.addImgs);

router.patch('/:reportId', isSuperAdmin, errorHandler(controller.updateReport));

export default router;
