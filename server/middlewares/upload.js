import * as argon2 from 'argon2';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import s3 from '../utils/S3.js';
import AppError from '../utils/appError.js';
import * as sourceMapModel from '../models/sourceMap.js';
import genHash from '../utils/hash.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mapPath = path.join(__dirname, `../public/sourceMap/`);

const multerStorage = multer.memoryStorage();
const multerLimits = {
  fieldNameSize: 100, // Max field name size in bytes
  fieldSize: 1024 * 1024 * 50, // Max field value size in bytes (e.g., 5MB)
};
export const uploadToMemory = multer({
  storage: multerStorage,
  limits: multerLimits,
});

export const uploadToDisk = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, mapPath);
    },
    filename(req, file, callback) {
      callback(null, `${mapPath}${nanoid(12)}.map`);
    },
  }),
});

export const uploadToS3 = async (req, res, next) => {
  try {
    const { mimetype, buffer } = req.file;
    const fileName = `${nanoid(12)}.map`;
    console.log(fileName);
    // upload to s3
    const bucketName = process.env.S3_BUCKET_NAME;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: mimetype,
    };

    const command = new PutObjectCommand(params);
    const result = await s3.send(command);
    req.body.fileName = fileName;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const checkSourceMapExisted = async (req, res, next) => {
  try {
    const { buffer } = req.file;
    const { projectId } = res.locals;

    const newestMap = await sourceMapModel.getNewestSourceMap(projectId);

    req.body.newestMap = newestMap;
    req.body.comingMap = buffer.toString();
    req.body.version = 1;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const checkSourceMapVersion = async (req, res, next) => {
  try {
    const { newestMap, comingMap } = req.body;

    const isSame = newestMap.hash_value === genHash(comingMap);
    req.body.newestMap = '';
    if (!isSame) req.body.version += newestMap.version;
    req.body.isSame = isSame;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};
