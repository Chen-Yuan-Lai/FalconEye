import { Router } from 'express';
import { createEvent, getEventsByUserId } from '../controllers/event.js';
import parseDSN from '../middlewares/parseDSN.js';
import processEvent from '../middlewares/processEvent.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

// mark 寫swagger doc
router.route('/SDK/event').post(parseDSN, processEvent, createEvent);

// mark 寫swagger doc
router.route('/events').get(authenticate, getEventsByUserId);

export default router;
