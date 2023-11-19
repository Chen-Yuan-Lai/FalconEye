import * as argon2 from 'argon2';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

import { writeFileAsync } from '../utils/fsOperation.js';
import * as sourceMapModel from '../models/sourceMap.js';
import AppError from '../utils/appError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, `../public/sourceMap/`);

const uploadToDisk = async (req, res, next) => {
  try {
    const { map } = req.body;
    const { projectId } = res.locals;
    console.log(map);

    const newestMap = await sourceMapModel.getNewestSourceMap(projectId);
    console.log(newestMap);

    if (newestMap) {
      const isSame = await argon2.verify(newestMap.hash_value, JSON.stringify(map));
      if (isSame) {
        res.status(200).json({
          data: 'source map file has newest version',
        });
        return;
      }
      res.locals.newestMap = newestMap;
    }

    const filePath = `${imagePath}${nanoid(12)}.map`;
    res.locals.path = filePath;
    writeFileAsync(filePath, JSON.stringify(map));
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default uploadToDisk;
