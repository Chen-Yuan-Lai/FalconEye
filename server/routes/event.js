import { Router } from 'express';
import { createEvent, getEventByUserId } from '../controllers/event.js';
import parseDSN from '../middlewares/parseDSN.js';
import processEvent from '../middlewares/processEvent.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

router
  .route('/event')
  .get(authenticate, getEventByUserId)
  .post(parseDSN, processEvent, createEvent);

export default router;
