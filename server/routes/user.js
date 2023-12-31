import { Router } from 'express';
import { body } from 'express-validator';

import handleResult from '../middlewares/validator.js';
import authenticate from '../middlewares/authenticate.js';
import { signup, signin, getUser } from '../controllers/user.js';

const router = Router();

router
  .route('/user/signup')
  .post([
    body('email').isEmail().normalizeEmail(),
    body('firstName').exists().notEmpty().trim(),
    body('secondName').exists().notEmpty().trim(),
    body('password').exists().notEmpty(),
    handleResult,
    signup,
  ]);

router
  .route('/user/signin')
  .post([
    body('email').isEmail().normalizeEmail(),
    body('password').exists().notEmpty(),
    handleResult,
    signin,
  ]);

router.route('/user/userProfile').get(authenticate, getUser);

export default router;
