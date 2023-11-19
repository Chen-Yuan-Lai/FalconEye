import * as ProjectModel from '../models/project.js';
import AppError from '../utils/appError.js';

const checkDSN = async (req, res, next) => {
  try {
    const { userKey, clientToken } = req.body;
    const project = await ProjectModel.checkProject(userKey, clientToken);
    if (!project) {
      return next(new AppError('invalid userKey or clientToken', 400));
    }
    res.locals.projectId = project.id;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default checkDSN;
