import { Router } from 'express';
import { query, body } from 'express-validator';

import handleResult from '../middlewares/validator.js';
import {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  updateProjectMember,
} from '../controllers/project.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

// mark 寫swagger doc
router.route('/projects').get(authenticate, getProjects);

// mark 寫swagger doc
router
  .route('/project')
  .post([body('framework').exists().notEmpty().trim(), handleResult, authenticate, createProject])
  .delete([
    body('projectId').exists().notEmpty().trim().isInt(),
    handleResult,
    authenticate,
    deleteProject,
  ])
  .get([
    query('projectId').exists().notEmpty().trim().isInt(),
    query('bin').exists().notEmpty().trim().isIn(['1h', '4h']),
    query('interval').exists().notEmpty().trim().isIn(['24h', '7d', '14d', '30d']),
    handleResult,
    authenticate,
    getProject,
  ]);

// mark 寫swagger doc
router
  .route('/project/members')
  .patch([
    body('email').isEmail().normalizeEmail(),
    body('projectId').exists().notEmpty().trim().isInt(),
    body('action').exists().notEmpty().trim().isIn(['add', 'remove']),
    handleResult,
    authenticate,
    updateProjectMember,
  ]);

export default router;
