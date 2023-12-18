import { Router } from 'express';
import { query, body } from 'express-validator';
import handleResult from '../middlewares/validator.js';
import authenticate from '../middlewares/authenticate.js';
import { getTriggerTypes } from '../controllers/trigger.js';

const router = Router();
router.route('/triggers/types').get(authenticate, getTriggerTypes);
export default router;
