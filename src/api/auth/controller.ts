import { addDays } from 'date-fns';
import { Response } from 'express';
import {
  CONFLICT,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  NO_CONTENT,
  OK,
  UNAUTHORIZED
} from 'http-status';
import { IRequest } from '../../common/types';
import { genToken, hashPassword, validateBody } from '../../common/utils';
import { startTransaction } from '../../database';
import * as usersService from '../users/service';
import * as adminsService from '../admins/service';
import * as authService from './service';
import * as authValidations from './validations';
// import { emailsService } from '../../common/services';

async function registerUser(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.REGISTER_USER);
  const existingAuthUser = await authService.getAuthUserByEmail(body.email);
  if (existingAuthUser) {
    throw {
      statusCode: CONFLICT,
      errorCode: 'Email already Exists'
    };
  }
  const tomorrow = addDays(new Date(), 1);
  Object.assign(body, {
    password: hashPassword(body.password),
    emailVerificationToken: await genToken(),
    emailVerificationTokenExpiry: tomorrow
  });
  const user = await usersService.createUser(body);
  // await emailsService.sendVerificationMail(
  //   body.email,
  //   body.emailVerificationToken,
  //   'ar'
  // );
  await authService.updateLastLoginAt(user.id);
  const {
    accessToken,
    refreshToken
  } = await authService.createAuthUserTokenPair(user, body.device);
  res.status(CREATED).json({
    data: {
      user,
      accessToken,
      refreshToken
    }
  });
}

async function login(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.LOGIN);
  const authUser = await authService.getAuthUserByEmail(body.email);
  if (!authUser) {
    throw {
      statusCode: UNAUTHORIZED,
      errorCode: 'Invalid username or password'
    };
  }
  const passwordMatches = authService.checkForCorrectPassword(
    body.password,
    authUser.password
  );
  if (!passwordMatches) {
    throw {
      statusCode: UNAUTHORIZED,
      errorCode: 'Invalid username or password'
    };
  }
  await authService.updateLastLoginAt(authUser.id);
  const {
    accessToken,
    refreshToken
  } = await authService.createAuthUserTokenPair(authUser, body.device);
  res.status(OK).json({
    data: {
      accessToken,
      refreshToken,
      user: authUser
    }
  });
}

async function loginDashboard(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.LOGIN);
  const admin = await adminsService.getAdminByUsername(body.username);
  if (!admin) {
    throw {
      statusCode: UNAUTHORIZED,
      message: "Admin or password doesn't exist"
    };
  }
  const passwordMatches = authService.checkForCorrectPassword(
    body.password,
    admin.password
  );
  if (!passwordMatches) {
    throw {
      statusCode: UNAUTHORIZED,
      message: "Admin or password doesn't exist"
    };
  }
  await adminsService.updateLastLoginAt(admin.id);
  const {
    accessToken,
    refreshToken
  } = await adminsService.createAdminTokenPair(admin);
  res.status(OK).json({
    data: {
      accessToken,
      refreshToken,
      user: admin
    }
  });
}

async function registerSocialUser(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.REGISTER_SOCIAL_USER);
  const existingAuthUser = await authService.getAuthUserByEmail(body.email);
  if (existingAuthUser) {
    throw {
      statusCode: CONFLICT,
      errorCode: 'Email already Exists'
    };
  }
  const isVerified = authService.verifyFirebaseToken(
    body.firebaseToken,
    body.firebaseId
  );
  if (!isVerified) {
    throw {
      statusCode: UNAUTHORIZED,
      message: 'The token provided is incorrect'
    };
  }
  body.isEmailVerified = true;
  body.isSocial = true;
  if (body.photoUrl) {
    body.photo = {
      type: 'Image',
      size: '18',
      path: 'external',
      url: body.photoUrl
    };
  }
  const user = await usersService.createUser(body);
  // await emailsService.welcomeMail(body.email, 'ar');
  await authService.updateLastLoginAt(user.id);
  const {
    accessToken,
    refreshToken
  } = await authService.createAuthUserTokenPair(user, body.device);
  res.status(CREATED).json({
    data: {
      user,
      accessToken,
      refreshToken
    }
  });
}

async function loginSocial(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.LOGIN_SOCIAL);
  const isVerified = authService.verifyFirebaseToken(
    body.firebaseToken,
    body.firebaseId
  );
  if (!isVerified) {
    throw {
      statusCode: UNAUTHORIZED,
      message: 'The token provided is incorrect'
    };
  }
  const authUser = await authService.getAuthUserByEmail(body.email);
  if (!authUser) {
    throw {
      statusCode: UNAUTHORIZED,
      errorCode: "Email Doesn't exist!"
    };
  }
  await authService.updateLastLoginAt(authUser.id);
  const {
    accessToken,
    refreshToken
  } = await authService.createAuthUserTokenPair(authUser, body.device);
  res.status(OK).json({
    data: {
      accessToken,
      refreshToken,
      user: authUser
    }
  });
}

async function resendVerificationEmail(
  req: IRequest,
  res: Response
): Promise<any> {
  const body = validateBody(req.body, authValidations.RESEND_VERIFICATION);
  const tomorrow = addDays(new Date(), 1);
  const emailVerificationToken = await genToken();
  const emailVerificationTokenExpiry = tomorrow;
  const authUser = await authService.updateEmailVerificationToken(
    body.email,
    emailVerificationToken,
    emailVerificationTokenExpiry
  );
  if (!authUser) {
    throw {
      statusCode: NOT_FOUND,
      errorCode: "User with that email doesn't exist"
    };
  }
  // await emailsService.sendVerificationMail(
  //   body.email,
  //   emailVerificationToken,
  //   authUser.clientLanguage
  // );
  res.status(NO_CONTENT).send();
}

async function verifyEmail(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.VERIFY_EMAIL);
  const isUpdated = await authService.verifyEmail(body.emailVerificationToken);
  if (!isUpdated) {
    throw {
      statusCode: NOT_FOUND,
      errorCode: "User with that email doesn't exist"
    };
  }
  res.status(NO_CONTENT).send();
}

async function forgotPassword(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.FORGOT_PASSWORD);
  const tomorrow = addDays(new Date(), 1);
  const resetPasswordToken = await genToken();
  const resetPasswordTokenExpiry = tomorrow;
  const authUser = await authService.updateResetPasswordToken(
    body.email,
    resetPasswordToken,
    resetPasswordTokenExpiry
  );
  if (!authUser) {
    throw {
      statusCode: NOT_FOUND,
      errorCode: "User with that email doesn't exist"
    };
  }
  // await emailsService.sendForgotPasswordMail(
  //   body.email,
  //   resetPasswordToken,
  //   authUser.clientLanguage
  // );
  res.status(NO_CONTENT).send();
}

async function resetPassword(req: IRequest, res: Response): Promise<any> {
  const body = validateBody(req.body, authValidations.RESET_PASSWORD);
  const password = await authService.encryptPassword(body.password);
  await startTransaction(async trx => {
    const isRevoked = await authService.revokeRefreshToken(
      body.resetPasswordToken,
      { trx }
    );
    if (!isRevoked) {
      throw {
        statusCode: NOT_FOUND
      };
    }
    const isUpdated = await authService.resetPassword(
      body.resetPasswordToken,
      password,
      { trx }
    );
    if (!isUpdated) {
      throw { statusCode: NOT_FOUND };
    }
  });
  res.status(NO_CONTENT).send();
}

async function changePassword(req: IRequest, res: Response): Promise<any> {
  const { userId } = req.authInfo;
  const body = validateBody(req.body, authValidations.CHANGE_PASSWORD);
  await startTransaction(async trx => {
    const authUser = await authService.getAuthUserByIdAndLock(userId, { trx });
    if (!authUser) {
      throw {
        statusCode: UNAUTHORIZED,
        errorCode: 'Invalid username or password'
      };
    }
    const currentPasswordMatches = authService.checkForCorrectPassword(
      body.currentPassword,
      authUser.password
    );
    if (!currentPasswordMatches) {
      throw {
        statusCode: UNAUTHORIZED,
        errorCode: 'Invalid username or password'
      };
    }
    const password = authService.encryptPassword(body.password);
    const isUpdated = await authService.updatePassword(userId, password, {
      trx
    });
    if (!isUpdated) {
      throw {
        statusCode: NOT_FOUND
      };
    }
  });
  res.status(NO_CONTENT).send();
}

async function refreshAuthUserToken(
  req: IRequest,
  res: Response
): Promise<any> {
  try {
    const body = validateBody(req.body, authValidations.REFRESH_TOKEN);
    const decodedRefreshToken = await authService.verifyToken(
      body.refreshToken
    );
    const authUser = await authService.getAuthUserById(
      decodedRefreshToken.userId
    );
    if (!authUser) {
      throw { statusCode: UNAUTHORIZED };
    }
    const existingRefreshToken = authUser.refreshTokens.find(
      (t: any) => t.id === decodedRefreshToken.jti
    );
    if (existingRefreshToken) {
      await authService.deleteRefreshToken(
        authUser.id,
        decodedRefreshToken.jti
      );
      const {
        accessToken,
        refreshToken
      } = await authService.createAuthUserTokenPair(
        authUser,
        existingRefreshToken.device
      );
      return res.status(OK).json({
        data: { accessToken, refreshToken }
      });
    }
    res.sendStatus(UNAUTHORIZED);
  } catch (err) {
    throw { statusCode: UNAUTHORIZED };
  }
}

export {
  registerUser,
  registerSocialUser,
  refreshAuthUserToken,
  changePassword,
  resetPassword,
  forgotPassword,
  verifyEmail,
  resendVerificationEmail,
  login,
  loginDashboard,
  loginSocial
};
