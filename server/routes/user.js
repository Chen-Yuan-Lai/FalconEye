import { Router } from 'express';
import { body } from 'express-validator';

import handleResult from '../middlewares/validator.js';

const router = Router();

router
  .route('/signup')
  .post([
    body('email').isEmail().normalizeEmail(),
    body('firstName').exists().notEmpty().trim(),
    body('firstName').exists().notEmpty().trim(),
    body('password').exists().notEmpty(),
    handleResult,
  ]);

router.route('/signin').post();
