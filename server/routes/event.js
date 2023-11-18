import { Router } from 'express';
import createEvent from '../controllers/event.js';

const router = Router();

router.route('/event').post(createEvent);

export default router;
