import { Router } from 'express';
import { param, query, body } from 'express-validator';

import handleResult from '../middlewares/validator.js';
import { getProjects, getProject, createProject, deleteProject } from '../controllers/project.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

router
  .route('/projects/:category')
  .get(param('category').isIn(['all', 'handled', 'unhandled']), getProjects);
router
  .route('/project')
  .post([body('framework').exists().notEmpty().trim(), handleResult, authenticate, createProject]);

router.route('/project/validation').post();

export default router;
