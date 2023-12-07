import { Router } from 'express';
import { query, param } from 'express-validator';
import { createEvent, getEventsByUserId, getEventByFingerprints } from '../controllers/event.js';
import parseDSN from '../middlewares/parseDSN.js';
import processEvent from '../middlewares/processEvent.js';
import authenticate from '../middlewares/authenticate.js';
import handleResult from '../middlewares/validator.js';

const router = Router();

// mark 寫swagger doc
router.route('/SDK/event').post(parseDSN, processEvent, createEvent);

// mark 寫swagger doc
router.route('/events').get(authenticate, getEventsByUserId);

router
  .route('/event/:fingerprints')
  .get(
    authenticate,
    param('fingerprints').exists().notEmpty(),
    query('page').optional({ checkFalsy: true }).notEmpty().trim().isInt(),
    handleResult,
    getEventByFingerprints,
  );

export default router;
