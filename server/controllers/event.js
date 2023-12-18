import * as eventModel from '../models/event.js';
import { PAGE_SIZE } from './alert.js';

export const getEventsByUserId = async (req, res, next) => {
  try {
    const { userId } = res.locals;
    const events = await eventModel.getEventsByUserId(userId);

    res.status(200).json({
      status: 'get events successfully',
      data: events,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getEventByFingerprints = async (req, res, next) => {
  try {
    const { fingerprints } = req.params;
    const page = req.query.page || 1;

    const offsetValue = (page - 1) * PAGE_SIZE;

    const events = await eventModel.getEventsByFingerprints(fingerprints, PAGE_SIZE, offsetValue);
    const totalPage = Math.ceil(events.totalCount / PAGE_SIZE);

    res.status(200).json({
      data: events.rows,
      total: events.totalCount,
      nextPage: totalPage < page + 1 ? null : page + 1,
      previousPage: page - 1 < 1 ? null : page - 1,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
