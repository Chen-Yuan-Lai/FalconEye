import { Router } from 'express';
import { query, body } from 'express-validator';
import { getIssues, updateIssue, getEventsByIssue } from '../controllers/issue.js';
import authenticate from '../middlewares/authenticate.js';
import handleResult from '../middlewares/validator.js';

const router = Router();

// mark 寫swagger doc
router
  .route('/issues')
  .get([
    authenticate,
    query('project').optional({ checkFalsy: true }).notEmpty(),
    query('status').optional({ checkFalsy: true }).isIn(['unhandled', 'handled']),
    query('statsPeriod').optional({ checkFalsy: true }).isIn(['24h', '7d', '14d', '30d']),
    query('sort').optional({ checkFalsy: true }).isIn(['latest_seen', 'first_seen']),
    handleResult,
    getIssues,
  ]);

// mark 寫swagger doc
router
  .route('/issue')
  .get(authenticate, getEventsByIssue)
  .patch([
    authenticate,
    body('eventIds').exists().notEmpty(),
    body('status').exists().notEmpty(),
    handleResult,
    updateIssue,
  ]);

export default router;
