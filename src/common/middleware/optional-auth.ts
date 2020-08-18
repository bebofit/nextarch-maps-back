import { NextFunction, Response } from 'express';
import { UNAUTHORIZED } from 'http-status';
import { extractToken, isAuthenticated } from '../../api/auth/service';
import { IRequest } from '../types';

async function middleware(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = extractToken(req.headers.authorization);
  if (token) {
    const authInfo = await isAuthenticated(token);
    req.authInfo = authInfo;
  }
  next();
}

export default middleware;
