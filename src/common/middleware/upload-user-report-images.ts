import sharp from 'sharp';
import config from '../../config';
import multerFactory from '../../lib/multer';
import { IRequest } from '../types';

const { S3_BUCKET } = config;

const folder = (req: IRequest): string => `report-imgs`;

const transformations = {
  image: () => sharp().jpeg({ quality: 60, progressive: true })
};

const multerInstance = multerFactory(
  S3_BUCKET,
  folder,
  'public-read',
  ['image'],
  transformations
);

const middleware = multerInstance.array('files', 3);

export default middleware;
