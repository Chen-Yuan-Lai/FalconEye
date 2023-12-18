import * as TriggerModel from '../models/trigger.js';
import AppError from '../utils/appError.js';

export const getTriggerTypes = async (req, res, next) => {
  try {
    const triggerTypes = await TriggerModel.getTriggerTypes();
    if (triggerTypes.length === 0) {
      return next(new AppError('triggers types not found'));
    }

    res.status(200).json({
      data: triggerTypes,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getTriggers = async () => {};
