import * as AlertModel from '../models/alert.js';
import * as ChannelModel from '../models/channel.js';
import * as TriggerModel from '../models/trigger.js';
import pool from '../models/databasePool.js';
import AppError from '../utils/appError.js';

import {
  createRule,
  createTarget,
  deleteRule,
  disableRule,
  enableRule,
  removeTargets,
} from '../aws/eventBridge.js';
import { addPermission, removePermission } from '../aws/lambda.js';

export const PAGE_SIZE = 6;

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

    const eventBridgeRes = await createRule(ruleId, actionInterval);
    const targetRes = await createTarget(ruleId);
    const addPermissionRes = await addPermission(ruleId);
    await client.query('COMMIT');

    res.status(200).json({
      data: {
        alertRes,
        triggerRes,
        channelRes,
        eventBridgeRes,
        targetRes,
        addPermissionRes,
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
    const { id } = req.params;
    const { interval } = req.query;
    const alert = await AlertModel.getAlert(+id);
    if (!alert) {
      return next(new AppError('alert not found', 404));
    }

    const alertTriggeredPerHour = await AlertModel.getAlertPerHour(+id, interval);

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

    const updateRes = await AlertModel.updateAlert(ruleId, fields);
    if (!updateRes) {
      return next(new AppError('the alert was already be deleted', 400));
    }

    let eventBridgeRes;
    if (updateRes.active) {
      eventBridgeRes = await enableRule(ruleId);
    } else {
      eventBridgeRes = await disableRule(ruleId);
    }

    res.status(200).json({
      data: {
        updateRes,
        eventBridgeRes,
      },
    });
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

    const removeTargetsRes = await removeTargets(ruleId);
    const removePermissionRes = await removePermission(ruleId);
    const eventBridgeRes = await deleteRule(ruleId);

    client.query('COMMIT');
    res.status(200).json({
      data: {
        alertRes,
        channelRes,
        triggerRes,
        removeTargetsRes,
        eventBridgeRes,
        removePermissionRes,
      },
    });
  } catch (err) {
    console.error(err);
    client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};
