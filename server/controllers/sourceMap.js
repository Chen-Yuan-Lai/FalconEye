import { GetObjectCommand } from '@aws-sdk/client-s3';
import AppError from '../utils/appError.js';
import * as sourceMapModel from '../models/sourceMap.js';
import s3 from '../utils/S3.js';
import genHash from '../utils/hash.js';

const createSourceMap = async (req, res, next) => {
  try {
    const { version, fileName, comingMapContent } = req.body;

    const { projectId } = res.locals;
    const hashValue = genHash(comingMapContent);

    const result = await sourceMapModel.createSourceMap(fileName, projectId, hashValue, version);

    res.status(200).json({
      message: 'Uploading new version!',
      data: result,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getSourceMap = async (req, res, next) => {
  try {
    const { projectId } = req.body;

    const mapData = await sourceMapModel.findSourceMap(projectId);

    if (!mapData) {
      return next(new AppError('source map not found', 404));
    }
    const { path } = mapData;

    const bucketName = process.env.S3_BUCKET_NAME;
    const params = {
      Bucket: bucketName,
      Key: path,
    };
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    const mapStr = await response.Body.transformToString();

    const mapObj = JSON.parse(mapStr);
  } catch (err) {
    console.error(err);
    next();
  }
};

export default createSourceMap;
