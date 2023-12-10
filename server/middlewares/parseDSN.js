import * as ProjectModel from '../models/project.js';
import AppError from '../utils/appError.js';

const parseDSN = async (req, res, next) => {
  try {
    const { userKey, clientToken } = req.body;
    const ids = await ProjectModel.checkProject(userKey, clientToken);
    if (!ids) {
      return next(new AppError('invalid userKey or clientToken', 400));
    }
    res.locals.projectId = +ids.project_id;
    res.locals.userId = +ids.user_id;
    req.body.kafkaMode = Boolean(Number(process.env.KAFKA_MODE));

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default parseDSN;
