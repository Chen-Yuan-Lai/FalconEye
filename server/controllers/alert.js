import * as AlertModel from '../models/alert.js';
import * as ChannelModel from '../models/channel.js';
import * as TriggerModel from '../models/trigger.js';
import pool from '../models/databasePool.js';
import AppError from '../utils/appError.js';
import AlertCronJob from '../utils/AlertCronJob.js';

import {
  createRule,
  createTarget,
  deleteRule,
  disableRule,
  enableRule,
  removeTargets,
} from '../aws/eventBridge.js';
import { addPermission, removePermission } from '../aws/lambda.js';

const mode = process.env.KAFKA_MODE;
const jobs = new AlertCronJob();

export const PAGE_SIZE = 6;

console.log(`Current system is ${mode === '1' ? 'distributed' : 'monolithic'} architecture`);
if (mode === '0') {
  console.log(`========== Corn Jobs Table ============\n`);
  await jobs.loadJobs();
  console.log(jobs.jobs);
}

const decideMode = async (executeMode, ruleId, job) => {
  let data;
  if (executeMode === '1') {
    const eventBridgeRes = await createRule(ruleId, job.actionInterval);
    const targetRes = await createTarget(ruleId);
    const addPermissionRes = await addPermission(ruleId);
    data = {
      mode: 'distributed',
      eventBridgeRes,
      targetRes,
      addPermissionRes,
    };
  } else {
    const cronJob = jobs.setCronJob(ruleId, job);
    jobs.addCronJob(ruleId, { ...job, cronJob });
    console.log(jobs.jobs);

    data = {
      mode: 'monolithic',
      currentJobs: jobs,
    };
  }
  return data;
};

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
    const tokens = channelRes.map(channel => channel.token);
    await client.query('COMMIT');

    const job = {
      projectId,
      filter,
      actionInterval,
      name,
      active,
      tokens,
      triggers,
    };
    // console.log(job);

    const data = await decideMode(mode, ruleId, job);
    data.ruleId = ruleId;
    data[triggerRes] = triggerRes;
    data[channelRes] = channelRes;

    res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const page = req.query.page || 1;
    const offsetValue = (page - 1) * PAGE_SIZE;

    const alerts = await AlertModel.getAlerts(projectId, PAGE_SIZE, offsetValue);
    let totalPage = 0;
    if (alerts.length !== 0) {
      totalPage = Math.ceil(Number(alerts[0].total_count) / PAGE_SIZE);
    }

    res.status(200).json({
      data: alerts,
      totalPage,
      nextPage: (page + 1 && totalPage) >= totalPage ? page : page + 1,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAlert = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { interval } = req.query;
    const alert = await AlertModel.getAlert(id);
    if (!alert) {
      return next(new AppError('alert not found', 404));
    }

    const alertTriggeredPerHour = await AlertModel.getAlertPerHour(id, interval);

    res.status(200).json({
      data: {
        alert,
        alertTriggeredPerHour,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateAlert = async (req, res, next) => {
  try {
    const { id: ruleId } = req.params;
    const fields = req.body;
    console.log(fields);

    const updateRes = await AlertModel.updateAlert(ruleId, fields);
    if (!updateRes) {
      return next(new AppError('the alert was already be deleted', 400));
    }

    const data = { updateRes };
    if (mode === '1') {
      let eventBridgeRes;
      if (updateRes.active) {
        eventBridgeRes = await enableRule(ruleId);
      } else {
        eventBridgeRes = await disableRule(ruleId);
      }
      data.eventBridgeRes = eventBridgeRes;
    } else {
      jobs.updateJob(ruleId, fields);
    }

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteAlert = async (req, res, next) => {
  const client = await pool.connect();
  try {
    client.query('BEGIN');
    const ruleId = Number(req.params.id);
    const channelRes = await ChannelModel.deleteChannel(client, ruleId);
    const triggerRes = await TriggerModel.deleteTrigger(client, ruleId);
    const alertRes = await AlertModel.deleteAlert(client, ruleId);
    client.query('COMMIT');

    const data = { alertRes, triggerRes, channelRes };
    if (mode === '1') {
      data.removeTargetsRes = await removeTargets(ruleId);
      data.removePermissionRes = await removePermission(ruleId);
      data.eventBridgeRes = await deleteRule(ruleId);
    } else {
      jobs.deleteJob(ruleId);
    }

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};
