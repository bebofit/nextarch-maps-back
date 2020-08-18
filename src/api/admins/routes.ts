import { Router } from 'express';
import errorHandler from 'express-async-handler';
import { isAuthenticated, isNotAuthenticated } from '../../common/middleware';
// import * as controller from './controller';

const router = Router();

export default router;
