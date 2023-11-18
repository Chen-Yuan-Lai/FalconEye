import * as ProjectModel from '../models/project.js';
import AppError from '../utils/appError.js';

export const getProjects = (req, res, next) => {};
export const getProject = (req, res, next) => {};

export const createProject = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    const { framework } = req.body;
    const project = await ProjectModel.createProject(framework, userId);

    res.status(200).json({
      data: project,
    });
  } catch (err) {
    if (err instanceof Error) {
      return next(new AppError(err.message, 400));
    }
    next(err);
  }
};

export const updateProject = (req, res, next) => {};

export const deleteProject = (req, res, next) => {};
