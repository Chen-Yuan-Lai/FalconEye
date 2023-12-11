import { Router } from 'express';
import { createEvent } from '../controllers/capture.js';
import branch from '../middlewares/branch.js';
import parseDSN from '../middlewares/parseDSN.js';
import processEvent from '../middlewares/processEvent.js';
import { eventProducer } from '../controllers/producer/producer.js';
import validation from '../controllers/validation.js';

const router = Router();

// mark 寫swagger doc
router.route('/capture/SDK/event').post(
  parseDSN,
  branch(req => req.body.kafkaMode, eventProducer, [processEvent, createEvent]),
);

router.route('/capture/validate').post(parseDSN, validation);

export default router;
