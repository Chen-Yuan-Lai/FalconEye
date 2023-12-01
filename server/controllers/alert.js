import * as AlertModel from '../models/alert.js';
import * as ChannelModel from '../models/channel.js';
import * as TriggerModel from '../models/trigger.js';
import pool from '../models/databasePool.js';
import AppError from '../utils/appError.js';
import { sendMessage, connectProducer } from '../utils/kafka.js';
import setCronJob from '../utils/cronJob.js';

const jobs = {};
await connectProducer();

// todo
export const createAlert = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { projectId } = req.query;
    const { triggers, channels, filter, actionInterval, name, active } = req.body;
    const alertRes = await AlertModel.createAlert(
      client,
      projectId,
      filter,
      actionInterval,
      name,
      active,
    );
    const ruleId = alertRes.id;
    const triggerRes = await TriggerModel.createTriggers(client, ruleId, triggers);
    const channelRes = await ChannelModel.createChannels(client, ruleId, channels);
    await client.query('COMMIT');

    const job = setCronJob(actionInterval, async () => {
      await sendMessage('notification', `${ruleId}`);
    });

    jobs[ruleId] = job;
    console.log(jobs);

    res.status(200).json({
      data: {
        alertRes,
        triggerRes,
        channelRes,
      },
    });
  } catch (err) {
    console.error(err);
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};
export const updateAlert = async (req, res, next) => {
  try {
    const { ruleId } = req.query;
    const fields = req.body;

    const updateRes = await AlertModel.updateAlert(ruleId, fields);

    // create a job
    if (updateRes.active && !jobs[updateRes.id]) {
      const job = setCronJob(updateRes.action_interval, async () => {
        await sendMessage('notification', `${updateRes.id}`);
      });

      jobs[updateRes.id] = job;
    }
    // delete a job
    if (!updateRes.active && jobs[updateRes.id]) {
      jobs[updateRes.id].cancel();

      delete jobs[updateRes.id];
    }

    res.status(200).json({
      data: updateRes,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteAltert = async (req, res, next) => {
  const client = await pool.connect();
  try {
    client.query('BEGIN');
    const ruleId = req.query;
    const alertRes = await AlertModel.deleteAlert(client, ruleId);

    client.query('COMMIT');
    res.status(200).json({
      data: alertRes,
    });
  } catch (err) {
    console.error(err);
    client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};
