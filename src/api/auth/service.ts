import { addDays, addHours, differenceInMilliseconds } from 'date-fns';
import jwt, { VerifyErrors } from 'jsonwebtoken';
// import { AccountType, Role } from '../../common/enums';
import { IAuthInfo, IDBQuery, IDBQueryOptions } from '../../common/types';
import {
  comparePasswordToHash,
  genToken,
  hashPassword,
  isString
} from '../../common/utils';
import config from '../../config';
import { IAuthUser } from '../../database/models';
import repository from './repository';
// import firebaseAdmin from '../../lib/firbase-admin';

const { JWT_SECRET } = config;

function extractToken(authHeader: string): string {
  if (!isString(authHeader)) {
    return null;
  }
  const headerParts = authHeader.trim().split(' ');
  if (!(headerParts.length === 2 && headerParts[0] === 'Bearer')) {
    return null;
  }
  return headerParts[1];
}

const verifyToken = (token: string): Promise<any> =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      JWT_SECRET,
      (err: VerifyErrors, authInfo: string | object) => {
        if (err) {
          return reject(err);
        }
        resolve(authInfo);
      }
    );
  });

const decodeToken = (token: string): any => jwt.decode(token);

const isAuthenticated = (token: string): Promise<any> => verifyToken(token);

async function isNotAuthenticated(token: string): Promise<void> {
  try {
    await verifyToken(token);
    return Promise.reject();
  } catch (err) {
    return Promise.resolve();
  }
}

const getAuthUserById = (id: string): IDBQuery<IAuthUser> =>
  repository.findById(id);

const encryptPassword = hashPassword;

const checkForCorrectPassword = (
  candidatePassword: string,
  hash: string
): boolean => comparePasswordToHash(candidatePassword, hash);

function signJWT(
  data?: any,
  expiresIn: string | number = '24h'
): Promise<string> {
  const options = data.exp ? {} : { expiresIn };
  return new Promise((resolve, reject) => {
    jwt.sign(data, JWT_SECRET, options, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

const updateEmailVerificationToken = (
  email: string,
  emailVerificationToken: string,
  emailVerificationTokenExpiry: Date,
  options?: IDBQueryOptions
): IDBQuery<IAuthUser> =>
  repository.updateEmailVerificationToken(
    email,
    emailVerificationToken,
    emailVerificationTokenExpiry,
    options
  );

const updateLastLoginAt = (
  userId: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.updateLastLoginAt(userId, options);

const getAuthUserByEmail = (
  email: string,
  options?: IDBQueryOptions
): IDBQuery<IAuthUser> => repository.findByEmail(email, options);

const getAuthUserByIdAndLock = (
  id: string,
  options?: IDBQueryOptions
): IDBQuery<IAuthUser> => repository.findByIdAndLock(id, options);

async function createAuthUserTokenPair(
  authUser: IAuthUser,
  options?: IDBQueryOptions
): Promise<{ accessToken: string; refreshToken: string }> {
  const authInfo: IAuthInfo = {
    userId: authUser.id,
    accountType: authUser.type
  };
  const refreshTokenId = await genToken(16);
  const createdAt = new Date();
  const accessExpiresAt = addHours(createdAt, 24);
  const refreshExpiresAt = addDays(createdAt, 30);
  await repository.addRefreshToken(
    authUser.id,
    {
      createdAt,
      id: refreshTokenId,
      expiresAt: refreshExpiresAt
    },
    options
  );
  const [accessToken, refreshToken] = await Promise.all([
    signJWT(
      {
        ...authInfo,
        jti: refreshTokenId,
        iat: createdAt.valueOf()
      },
      differenceInMilliseconds(accessExpiresAt, createdAt)
    ),
    signJWT(
      {
        ...authInfo,
        jti: refreshTokenId,
        iat: createdAt.valueOf()
      },
      differenceInMilliseconds(refreshExpiresAt, createdAt)
    )
  ]);
  return { accessToken, refreshToken };
}

const updateEmail = (
  id: string,
  email: string,
  emailVerificationToken: string,
  emailVerificationTokenExpiry: Date,
  options?: IDBQueryOptions
): IDBQuery<IAuthUser> =>
  repository.changeEmail(
    id,
    email,
    emailVerificationToken,
    emailVerificationTokenExpiry,
    options
  );

const verifyEmail = (
  emailVerificationToken: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.verifyEmail(emailVerificationToken, options);

const updateResetPasswordToken = (
  email: string,
  resetPasswordToken: string,
  resetPasswordTokenExpiry: Date,
  options?: IDBQueryOptions
): IDBQuery<IAuthUser> =>
  repository.updateResetPasswordToken(
    email,
    resetPasswordToken,
    resetPasswordTokenExpiry,
    options
  );

const resetPassword = (
  resetPasswordToken: string,
  password: string,
  options?: IDBQueryOptions
): Promise<boolean> =>
  repository.resetPassword(resetPasswordToken, password, options);

const updatePassword = (
  userId: string,
  password: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.updatePassword(userId, password, options);

const updatePhoto = (
  userId: string,
  body: any,
  options?: IDBQueryOptions
): IDBQuery<IAuthUser> => repository.updatePhoto(userId, body, options);

const revokeRefreshToken = (
  resetPasswordToken: string,
  options?: IDBQueryOptions
): Promise<boolean> =>
  repository.revokeRefreshToken(resetPasswordToken, options);

const deleteRefreshToken = (userId: string, options?: IDBQueryOptions) =>
  repository.deleteRefreshToken(userId, options);

// const verifyFirebaseToken = (token: string, uid: string): Promise<boolean> =>
//   firebaseAdmin.verifyToken(token, uid);

export {
  extractToken,
  decodeToken,
  verifyToken,
  // verifyFirebaseToken,
  updateEmailVerificationToken,
  isAuthenticated,
  isNotAuthenticated,
  getAuthUserById,
  encryptPassword,
  checkForCorrectPassword,
  signJWT,
  createAuthUserTokenPair,
  updateLastLoginAt,
  getAuthUserByEmail,
  getAuthUserByIdAndLock,
  updateEmail,
  verifyEmail,
  updateResetPasswordToken,
  updatePhoto,
  resetPassword,
  updatePassword,
  revokeRefreshToken,
  deleteRefreshToken
};
