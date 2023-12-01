import { Router } from 'express';
import { query, body } from 'express-validator';
import handleResult from '../middlewares/validator.js';
import { createAlert, updateAlert } from '../controllers/alert.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();
// await connectProducer();

// todo
router.route('/alert').post(authenticate, createAlert).patch(authenticate, updateAlert);

export default router;
