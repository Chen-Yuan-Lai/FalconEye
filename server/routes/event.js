import { Router } from 'express';
import createEvent from '../controllers/event.js';
import checkDSN from '../middlewares/checkDSN.js';
import trimError from '../middlewares/processEvent.js';

const router = Router();

router.route('/event').post(trimError, createEvent);
router.route('/event/validate').post(checkDSN, (req, res) => {
  res.status(200).json({
    data: 'ok',
  });
});

export default router;
