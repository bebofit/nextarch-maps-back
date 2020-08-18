import { subYears } from 'date-fns';
import { Gender } from '../../common/enums';
import joi from '../../lib/joi';

const REGISTER_USER = joi.object({
  name: joi
    .string()
    .trim()
    .required(),
  email: joi
    .string()
    .trim()
    .email()
    .lowercase()
    .required(),
  mobile: joi
    .string()
    .trim()
    .required(),
  dob: joi.date().max(subYears(new Date(), 10)),
  city: joi.string().trim(),
  gender: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(Gender))
    .required(),
  password: joi
    .string()
    .trim()
    .min(8)
    .required()
});

const REFRESH_TOKEN = joi.object({
  refreshToken: joi
    .string()
    .trim()
    .required()
});

const RESEND_VERIFICATION = joi.object({
  email: joi
    .string()
    .email()
    .trim()
    .min(8)
    .lowercase()
    .required()
});

const VERIFY_EMAIL = joi.object({
  emailVerificationToken: joi
    .string()
    .trim()
    .required()
});

const FORGOT_PASSWORD = joi.object({
  email: joi
    .string()
    .email()
    .trim()
    .min(8)
    .required()
});

const RESET_PASSWORD = joi.object({
  password: joi
    .string()
    .trim()
    .min(8)
    .required(),
  resetPasswordToken: joi
    .string()
    .trim()
    .required()
});

const CHANGE_PASSWORD = joi.object({
  currentPassword: joi
    .string()
    .trim()
    .required(),
  password: joi
    .string()
    .trim()
    .disallow(joi.ref('currentPassword'))
    .required()
});

const LOGIN = joi.object({
  email: joi
    .string()
    .trim()
    .email()
    .lowercase()
    .required(),
  password: joi
    .string()
    .trim()
    .min(8)
    .required()
});

const LOGIN_SOCIAL = joi.object({
  email: joi
    .string()
    .trim()
    .email()
    .lowercase()
    .required(),
  firebaseId: joi
    .string()
    .trim()
    .required(),
  firebaseToken: joi
    .string()
    .trim()
    .required()
});

const REGISTER_SOCIAL_USER = joi.object({
  firebaseId: joi
    .string()
    .trim()
    .required(),
  firebaseToken: joi
    .string()
    .trim()
    .required(),
  name: joi
    .string()
    .trim()
    .required(),
  mobile: joi
    .string()
    .trim()
    .required(),
  email: joi
    .string()
    .trim()
    .email()
    .lowercase()
    .required(),
  dob: joi.date().max(subYears(new Date(), 10)),
  photoUrl: joi.string().trim(),
  gender: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(Gender))
    .required()
});

export {
  REGISTER_USER,
  RESEND_VERIFICATION,
  VERIFY_EMAIL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  CHANGE_PASSWORD,
  LOGIN,
  LOGIN_SOCIAL,
  REFRESH_TOKEN,
  REGISTER_SOCIAL_USER
};
