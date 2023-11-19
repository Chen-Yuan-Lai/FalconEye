import { Router } from 'express';
import createSourceMap from '../controllers/sourceMap.js';
import uploadToDisk from '../middlewares/savaMapToDisk.js';
import checkDSN from '../middlewares/checkDSN.js';

const router = Router();

router.route('/sourceMap').post(checkDSN, uploadToDisk, createSourceMap);

export default router;
