import { Router } from 'express';
import { param, query, body } from 'express-validator';

import handleResult from '../middlewares/validator.js';
import { getProjects, getProject, createProject, deleteProject } from '../controllers/project.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

router.route('/projects').get(authenticate, getProjects);
router
  .route('/project')
  .post([body('framework').exists().notEmpty().trim(), handleResult, authenticate, createProject]);

export default router;
