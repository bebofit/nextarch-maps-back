import { Router } from 'express';
import errorHandler from 'express-async-handler';
import { isAuthenticated } from '../../common/middleware';
import * as controller from './controller';

const router = Router();

router.post('/register', errorHandler(controller.registerUser));
router.post(
  '/email/resend-verification',
  errorHandler(controller.resendVerificationEmail)
);
router.post('/email/verify', errorHandler(controller.verifyEmail));
router.post('/password/forgot', errorHandler(controller.forgotPassword));
router.post('/password/reset', errorHandler(controller.resetPassword));
router.post(
  '/password/change',
  isAuthenticated,
  errorHandler(controller.changePassword)
);
router.post('/login', errorHandler(controller.login));
router.post('/refresh', errorHandler(controller.refreshAuthUserToken));
// Swagger
router.post('/login-admin', errorHandler(controller.loginDashboard));
router.post('/login/social', errorHandler(controller.loginSocial));

router.post(
  '/register/user/social',
  errorHandler(controller.registerSocialUser)
);

export default router;
