import { GetObjectCommand } from '@aws-sdk/client-s3';
import locateMap from '../utils/locateMap.js';
import * as sourceMapModel from '../models/sourceMap.js';
import * as eventModel from '../models/event.js';
import s3 from '../utils/S3.js';
import AppError from '../utils/appError.js';

export const createEvent = async (req, res, next) => {
  try {
    const { projectId, userId } = res.locals;
    const {
      workspacePath,
      name,
      message,
      timestamp,
      stack,
      systemInfo,
      requestInfo,
      stackObjs,
      fingerprints,
    } = req.body.eventData;
    const {
      osType,
      osRelease,
      architecture,
      nodeVersion,
      rss,
      heapTotal,
      heapUsed,
      external,
      arrayBuffers,
      uptime,
    } = systemInfo;

    const event = await eventModel.createEvent(
      userId,
      projectId,
      name,
      message,
      stack,
      osType,
      osRelease,
      architecture,
      nodeVersion,
      rss,
      heapTotal,
      heapUsed,
      external,
      arrayBuffers,
      uptime,
      timestamp,
      fingerprints,
      workspacePath,
    );

    const newestMap = await sourceMapModel.getNewestSourceMap(projectId);

    let codeBlockResult = {};

    // mark if source map existed, produce code block
    if (newestMap) {
      const keyString = newestMap.file_name;

      // pull source map file from S3
      const bucketName = process.env.S3_BUCKET_NAME;
      const params = {
        Bucket: bucketName,
        Key: keyString,
      };
      const command = new GetObjectCommand(params);
      const response = await s3.send(command);
      const map = await response.Body.transformToString();

      const codeBlocksPromises = stackObjs.map(el =>
        locateMap(map, el.fileName, el.line, el.column, stack),
      );
      const codeBlocks = await Promise.all(codeBlocksPromises);

      const createCodeBlockPromises = new Array(stackObjs.length).fill(null).map((el, i) => {
        let block;
        let errorLine;
        if (!codeBlocks[i]) {
          block = null;
          errorLine = null;
        } else {
          block = codeBlocks[i].codeBlock;
          errorLine = codeBlocks[i].errorLine;
        }
        // todo 可以優化成bulk insert
        const {
          fileName,
          line: errorLineNum,
          column: errorColumnNum,
          stack: errStack,
        } = stackObjs[i];
        return eventModel.createCodeBlock(
          event.id,
          fileName,
          block,
          errorLine,
          errorColumnNum,
          errorLineNum,
          errStack,
        );
      });

      codeBlockResult = await Promise.all(createCodeBlockPromises);
      // console.log(codeBlockResult);
    }

    let requestInfoResult = {};
    if (requestInfo) {
      const { url, method, host, userAgent, accept, queryParas, ip } = requestInfo;
      requestInfoResult = await eventModel.createRequestInfo(
        event.id,
        url,
        method,
        host,
        userAgent,
        accept,
        JSON.stringify(queryParas),
        ip,
      );
    }
    const data = {
      event,
      codeBlockResult,
      requestInfoResult,
    };
    // console.log(data);
    res.status(200).json({
      status: 'insert successfully',
      data,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

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
