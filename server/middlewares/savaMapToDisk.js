import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

import { writeFileAsync } from '../utils/fsOperation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, `../public/sourceMap/`);

const uploadToDisk = async (req, res, next) => {
  try {
    const map = req.body;
    const filePath = `${imagePath}${nanoid(12)}.map`;
    req.body.path = filePath;
    writeFileAsync(filePath, JSON.stringify(map));
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default uploadToDisk;
