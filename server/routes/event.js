import { Router } from 'express';
import createEvent from '../controllers/event.js';
import parseDSN from '../middlewares/parseDSN.js';
import processEvent from '../middlewares/processEvent.js';

const router = Router();

router.route('/event').post(parseDSN, processEvent, createEvent);

export default router;
