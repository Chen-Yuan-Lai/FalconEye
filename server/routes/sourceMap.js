import { Router } from 'express';
import getSourceMap from '../controllers/sourceMap.js';

const router = Router();

router.route('/sourceMap').post(getSourceMap);

export default router;
