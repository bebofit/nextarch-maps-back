import { Document, model, Schema } from 'mongoose';
import { Gender, Language } from '../../common/enums';

interface IRefreshToken {
  id: string;
  createdAt?: Date;
  expiresAt: Date;
}

interface IFileUpload {
  type: string;
  size: number;
  path: string;
  url: string;
}

type IAuthUserType = 'User' | 'Artist';

type IAuthUserGender = 'M' | 'F';

interface IAuthUser extends Document {
  _id: string;
  type: IAuthUserType;
  isEmailVerified: boolean;
  mobile: string;
  name: string;
  email: string;
  clientLanguage: string;
  gender: IAuthUserGender;
  password: string;
  photo: IFileUpload;
  dob?: Date;
  city?: string;
  referrer?: string;
  landline?: string;
  facebookId?: string;
  facebookToken?: string;
  googleId?: string;
  googleToken?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  refreshToken: IRefreshToken;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  deletedAt?: Date;
}

const refreshTokenSchema = new Schema(
  {
    id: { type: String, required: true },
    createdAt: Date,
    expiresAt: Date
  },
  { _id: false, id: false }
);

const fileUploadSchema = new Schema(
  {
    type: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    url: { type: String, required: true }
  },
  { _id: false, id: false }
);

const authUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, sparse: true },
    password: {
      type: String,
      // tslint:disable-next-line: object-literal-shorthand
      required: function(): Boolean {
        return !this.firebaseId && !this.firebaseToken;
      }
    },
    mobile: String,
    landline: String,
    dob: Date,
    city: String,
    referrer: String,
    gender: {
      type: String,
      enum: Object.values(Gender)
    },
    clientLanguage: {
      type: String,
      enum: Object.values(Language),
      default: Language.Arabic
    },
    photo: {
      type: fileUploadSchema,
      default: () => ({
        type: 'Image',
        size: '18',
        path: 'misc/default-profile.png',
        url:
          'https://test-21222.s3.us-east-2.amazonaws.com/misc/funank-logo+copy.jpg'
      })
    },
    firebaseId: String,
    firebaseToken: String,
    facebookId: String,
    facebookToken: String,
    googleId: String,
    googleToken: String,
    lastLoginAt: Date,
    deletedAt: Date,
    isEmailVerified: { type: Boolean, default: false },
    isSocial: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    emailVerificationToken: String,
    emailVerificationTokenExpiry: Date,
    refreshToken: refreshTokenSchema,
    lock: String
  },
  {
    timestamps: true,
    discriminatorKey: 'type',
    useNestedStrict: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.deletedAt;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordTokenExpiry;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationTokenExpiry;
        delete ret.lastLoginAt;
        delete ret.refreshToken;
        delete ret.facebookId;
        delete ret.facebookToken;
        delete ret.googleId;
        delete ret.googleToken;
        delete ret.lock;
        delete ret.__v;
        delete ret.isLocked;
        delete ret.password;
        delete ret.updatedAt;
      }
    }
  }
);

authUserSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phoneNumber: 'text'
});

// tslint:disable-next-line: variable-name
const AuthUser = model<IAuthUser>('AuthUser', authUserSchema);

export { AuthUser, IAuthUser, IAuthUserType, IAuthUserGender, IRefreshToken };
