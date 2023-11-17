import { Router } from 'express';
import getSourceMap from '../controllers/sourceMap.js';
import uploadToDisk from '../middlewares/savaMapToDisk.js';

const router = Router();

router.route('/sourceMap').post(uploadToDisk, getSourceMap);

export default router;
