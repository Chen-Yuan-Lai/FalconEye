import { Router } from 'express';
import { query, body, param } from 'express-validator';

import handleResult from '../middlewares/validator.js';
import {
  getProjects,
  getProject,
  createProject,
  deleteProject,
  updateProjectMember,
  getProjectMembers,
} from '../controllers/project.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

// mark 寫swagger doc
router.route('/projects').get(authenticate, getProjects);

// mark 寫swagger doc
router
  .route('/project')
  .post([
    authenticate,
    body('framework').exists().notEmpty().trim(),
    body('name').exists().notEmpty().trim(),
    handleResult,
    createProject,
  ])
  .delete([
    authenticate,
    body('projectId').exists().notEmpty().trim().isInt(),
    handleResult,
    deleteProject,
  ])
  .get([
    authenticate,
    query('projectId').exists().notEmpty().trim().isInt(),
    query('bin').optional({ checkFalsy: true }).isIn(['1h', '4h']),
    query('interval').optional({ checkFalsy: true }).isIn(['24h', '7d', '14d', '30d']),
    handleResult,
    getProject,
  ]);

// mark 寫swagger doc
router
  .route('/project/:id/members')
  .get(
    authenticate,
    param('id').exists().notEmpty().trim().isInt(),
    handleResult,
    getProjectMembers,
  )
  .patch([
    authenticate,
    param('id').exists().notEmpty().trim().isInt(),
    body('email').isEmail().normalizeEmail(),
    body('action').exists().notEmpty().trim().isIn(['add', 'remove']),
    handleResult,
    updateProjectMember,
  ]);

export default router;
