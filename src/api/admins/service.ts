import { addDays } from 'date-fns';
import { IAuthInfo, IDBQuery, IDBQueryOptions } from '../../common/types';
import { genToken } from '../../common/utils';
import { IAdmin } from '../../database/models';
import { signJWT } from '../auth/service';
import repository from './repository';

const getAdminByEmail = (
  email: string,
  options?: IDBQueryOptions
): IDBQuery<IAdmin> => repository.findByEmail(email, options);

const getAdminByUsername = (
  username: string,
  options?: IDBQueryOptions
): IDBQuery<IAdmin> => repository.findByUsername(username, options);

const updateLastLoginAt = (
  userId: string,
  options?: IDBQueryOptions
): Promise<boolean> => repository.updateLastLoginAt(userId, options);

const createAdmin = (body: any, options?: IDBQueryOptions): Promise<IAdmin> =>
  repository.create(body, options);

async function createAdminTokenPair(
  admin: IAdmin,
  options?: IDBQueryOptions
): Promise<{ accessToken: string; refreshToken: string }> {
  const createdAt = new Date();
  const refreshTokenId = await genToken(16);
  const accessExpiresAt = addDays(createdAt, 30);
  const refreshExpiresAt = addDays(createdAt, 120);
  const authInfo: IAuthInfo = {
    userId: admin.id,
    isSuperAdmin: admin.isSuperAdmin,
    isAdmin: true
  };
  await repository.addRefreshToken(
    admin.id,
    {
      createdAt,
      id: refreshTokenId,
      expiresAt: refreshExpiresAt
    },
    options
  );
  const [accessToken, refreshToken] = await Promise.all([
    signJWT({
      ...authInfo,
      iat: createdAt.valueOf(),
      exp: accessExpiresAt.valueOf()
    }),
    signJWT({
      ...authInfo,
      iat: createdAt.valueOf(),
      exp: refreshExpiresAt.valueOf()
    })
  ]);
  return { accessToken, refreshToken };
}

export {
  getAdminByEmail,
  getAdminByUsername,
  updateLastLoginAt,
  createAdmin,
  createAdminTokenPair
};
