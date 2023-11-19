import * as argon2 from 'argon2';
import AppError from '../utils/appError.js';
import * as sourceMapModel from '../models/sourceMap.js';

const createSourceMap = async (req, res, next) => {
  try {
    const { path, projectId, newestMap } = res.locals;
    const { map } = req.body;
    const hashValue = await argon2.hash(JSON.stringify(map));

    let updatedMap;
    // if the project has no map, create a new one
    if (!newestMap) {
      updatedMap = await sourceMapModel.createSourceMap(path, projectId, hashValue, 1);
    } else {
      // the map has updated, create a new version
      const newVersion = newestMap.version + 1;
      updatedMap = await sourceMapModel.createSourceMap(path, projectId, hashValue, newVersion);
    }

    res.status(200).json({
      data: updatedMap,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getSourceMap = async (req, res, next) => {};

export default createSourceMap;
