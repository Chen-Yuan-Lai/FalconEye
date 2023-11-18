import { Router } from 'express';
import createSourceMap from '../controllers/sourceMap.js';
import uploadToDisk from '../middlewares/savaMapToDisk.js';

const router = Router();

router.route('/sourceMap').post(uploadToDisk, createSourceMap);

export default router;
