import { Gender, ReportType, ReportStatus } from '../../common/enums';
import joi from '../../lib/joi';

const CREATE = joi.object({
  type: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(ReportType))
    .required(),
  userInfo: joi.object({
    homeNumber: joi
      .string()
      .trim()
      .required(),
    nId: joi
      .string()
      .trim()
      .required()
  }),
  address: joi.object({
    street: joi
      .string()
      .trim()
      .required(),
    building: joi
      .string()
      .trim()
      .required(),
    city: joi
      .string()
      .trim()
      .required()
  }),
  long: joi.number().required(),
  lat: joi.number().required(),
  desc: joi.string().required()
});

const UPDATE = joi.object({
  type: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(ReportType)),
  userInfo: joi.object({
    mobile: joi.string().trim(),
    email: joi
      .string()
      .email()
      .trim(),
    name: joi.string().trim(),
    nId: joi.string().trim()
  }),
  address: joi.object({
    street: joi.string().trim(),
    building: joi.string().trim(),
    city: joi.string().trim()
  }),
  status: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(ReportStatus)),
  long: joi.number(),
  lat: joi.number(),
  desc: joi.string()
});

export { CREATE, UPDATE };
