import { Router } from 'express';
import getEvent from '../controllers/event.js';

const router = Router();

router.route('/event').post(getEvent);

export default router;
