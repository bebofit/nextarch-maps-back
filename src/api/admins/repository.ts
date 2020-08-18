import { Model } from 'mongoose';
import { BaseDBRepository } from '../../common/classes';
import { IDBQueryOptions, IDBQuery } from '../../common/types';
import { Admin, IAdmin, IRefreshToken } from '../../database/models';

class AdminRepository extends BaseDBRepository<IAdmin> {
  constructor(protected model: Model<IAdmin>) {
    super(model);
  }

  findByEmail(email: string, options?: IDBQueryOptions): IDBQuery<IAdmin> {
    return super.findOne({ email }, options);
  }

  findByUsername(
    username: string,
    options?: IDBQueryOptions
  ): IDBQuery<IAdmin> {
    return super.findOne({ username }, options);
  }

  updateResetPasswordToken(
    email: string,
    resetPasswordToken: string,
    resetPasswordTokenExpiry: Date,
    options?: IDBQueryOptions
  ): IDBQuery<IAdmin> {
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

const adminRepository = new AdminRepository(Admin);

export default adminRepository;
