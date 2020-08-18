import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IDBQuery, IDBQueryOptions } from '../../common/types';
import { AuthUser, IAuthUser, IRefreshToken } from '../../database/models';

class AuthUserRepository extends BaseDBRepository<IAuthUser> {
  constructor(protected model: Model<IAuthUser>) {
    super(model);
  }

  findByEmail(email: string, options?: IDBQueryOptions): IDBQuery<IAuthUser> {
    return super.findOne({ email }, options);
  }

  findByMobile(mobile: string, options?: IDBQueryOptions): IDBQuery<IAuthUser> {
    return super.findOne({ mobile }, options);
  }

  updateEmailVerificationToken(
    email: string,
    emailVerificationToken: string,
    emailVerificationTokenExpiry: Date,
    options?: IDBQueryOptions
  ): IDBQuery<IAuthUser> {
    return super.findOneAndUpdate(
      { email, isEmailVerified: false },
      { emailVerificationToken, emailVerificationTokenExpiry },
      options
    );
  }

  changeEmail(
    id: string,
    email: string,
    emailVerificationToken: string,
    emailVerificationTokenExpiry: Date,
    options?: IDBQueryOptions
  ): IDBQuery<IAuthUser> {
    return super.findByIdAndUpdate(
      id,
      {
        email,
        emailVerificationToken,
        emailVerificationTokenExpiry,
        isEmailVerified: false
      },
      options
    );
  }

  verifyEmail(
    emailVerificationToken: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateOne(
      {
        emailVerificationToken,
        emailVerificationTokenExpiry: { $gte: new Date() }
      },
      {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiry: null
      },
      options
    );
  }

  updateResetPasswordToken(
    email: string,
    resetPasswordToken: string,
    resetPasswordTokenExpiry: Date,
    options?: IDBQueryOptions
  ): IDBQuery<IAuthUser> {
    return super.findOneAndUpdate(
      { email },
      { resetPasswordToken, resetPasswordTokenExpiry },
      options
    );
  }

  resetPassword(
    resetPasswordToken: string,
    password: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateOne(
      {
        resetPasswordToken,
        resetPasswordTokenExpiry: { $gte: new Date() }
      },
      {
        password,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null
      },
      options
    );
  }

  updatePassword(
    userId: string,
    password: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateById(
      userId,
      {
        password
      },
      options
    );
  }

  updateLastLoginAt(
    userId: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.updateById(
      userId,
      {
        lastLoginAt: new Date()
      },
      options
    );
  }

  updatePhoto(
    userId: string,
    body: any,
    options?: IDBQueryOptions
  ): IDBQuery<IAuthUser> {
    return super.findByIdAndUpdate(userId, { photo: body }, options);
  }

  addRefreshToken(
    userId: string,
    token: IRefreshToken,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.flexibleUpdateById(
      userId,
      {
        refreshToken: token,
        lastLoginAt: new Date()
      },
      options
    );
  }

  deleteRefreshToken(
    userId: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.flexibleUpdateOne(
      { _id: userId },
      { refreshToken: null, lastLoginAt: new Date() },
      options
    );
  }

  revokeRefreshToken(
    resetPasswordToken: string,
    options?: IDBQueryOptions
  ): Promise<boolean> {
    return super.flexibleUpdateOne(
      { resetPasswordToken },
      { refreshToken: null, lastLoginAt: new Date() },
      options
    );
  }
}

const authUserRepository = new AuthUserRepository(AuthUser);

export default authUserRepository;
