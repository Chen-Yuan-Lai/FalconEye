import { Router } from 'express';
import { body } from 'express-validator';

import { getProject, createProject, deleteProject, updateProject } from '../controllers/project.js';

const router = Router();

router.use('/projects');

export default router;
