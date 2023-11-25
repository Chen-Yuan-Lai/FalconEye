import * as projectModel from '../models/project.js';
import * as eventModel from '../models/event.js';
import AppError from '../utils/appError.js';

export const getIssues = async (req, res, next) => {
  try {
    const { userId } = res.locals;
    const issues = await projectModel.getIssues(userId, req.query);

    if (issues.length === 0) return next(new AppError('issues not found', 404));

    res.status(200).json({
      data: issues,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateIssue = async (req, res, next) => {
  try {
    const { eventIds, status } = req.body;
    console.log(eventIds, status);
    await eventModel.updateEvents(eventIds, status);

    res.status(200).json({
      data: 'ok',
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
