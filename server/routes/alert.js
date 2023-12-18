import { Router } from 'express';
import { query, body } from 'express-validator';
import handleResult from '../middlewares/validator.js';
import {
  createAlert,
  deleteAlert,
  getAlert,
  getAlerts,
  updateAlert,
} from '../controllers/alert.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();
// await connectProducer();

// todo
router
  .route('/alert/:id')
  .get(authenticate, getAlert)
  .patch(authenticate, updateAlert)
  .delete(authenticate, deleteAlert);
router
  .route('/alerts')
  .get(
    authenticate,
    query('projectId').optional({ checkFalsy: false }).trim().isInt(),
    handleResult,
    getAlerts,
  );

router
  .route('/alert')
  .post([
    authenticate,
    query('projectId').exists().notEmpty().trim(),
    body('triggers').exists().notEmpty().isArray().withMessage('Triggers must be an array'),
    body('triggers.*.triggerTypeId')
      .exists()
      .notEmpty()
      .isInt()
      .withMessage('Trigger Type ID must be an integer'),
    body('triggers.*.threshold').optional({ checkFalsy: true }).trim().isInt(),
    body('triggers.*.timeWindow')
      .optional({ checkFalsy: true })
      .trim()
      .isIn(['1m', '5m', '10m', '1hr', '3hr', '24hr', '1w']),
    body('channels').exists().notEmpty().isArray().withMessage('Channels must be an array'),
    body('channels.*.userId')
      .exists()
      .notEmpty()
      .trim()
      .isInt()
      .withMessage('User ID must be an integer'),
    body('channels.*.type')
      .exists()
      .notEmpty()
      .trim()
      .isString()
      .withMessage('Type must be a string'),
    body('channels.*.token')
      .exists()
      .notEmpty()
      .trim()
      .isString()
      .withMessage('Token must be a string'),
    body('filter')
      .exists()
      .notEmpty()
      .trim()
      .isIn(['any', 'all'])
      .withMessage('Filter must be a string'),
    body('actionInterval')
      .exists()
      .notEmpty()
      .trim()
      .isIn(['1m', '5m', '10m', '1hr', '3hr', '24hr', '1w'])
      .withMessage('Action Interval must be a string'),
    body('name').exists().notEmpty().trim().isString().withMessage('Name must be a string'),
    body('active').exists().notEmpty().trim().isBoolean().withMessage('Active must be a boolean'),
    handleResult,
    createAlert,
  ]);

export default router;
