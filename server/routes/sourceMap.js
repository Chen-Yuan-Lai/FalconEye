import { Router } from 'express';
import createSourceMap from '../controllers/sourceMap.js';
import parseDSN from '../middlewares/parseDSN.js';
import branch from '../middlewares/branch.js';
import {
  uploadToMemory,
  uploadToS3,
  checkSourceMapExisted,
  checkSourceMapVersion,
} from '../middlewares/upload.js';

const router = Router();

router.route('/sourceMap').post([
  uploadToMemory.single('map'),
  parseDSN,
  checkSourceMapExisted,
  branch(
    req => req.body.newestMap,
    [
      checkSourceMapVersion,
      branch(
        req => req.body.isSame,
        (req, res) => {
          res.status(200).json({ data: 'source map file already has the newest version' });
        },
        [uploadToS3, createSourceMap],
      ),
    ],
    [uploadToS3, createSourceMap],
  ),
]);

export default router;
