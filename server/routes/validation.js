import { Router } from 'express';
import parseDSN from '../middlewares/parseDSN.js';
import validation from '../controllers/validation.js';

const router = Router();

router.route('/SDK/validate').post(parseDSN, validation);

export default router;
