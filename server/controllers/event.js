import { GetObjectCommand } from '@aws-sdk/client-s3';
import locateMap from '../utils/locateMap.js';
import * as sourceMapModel from '../models/sourceMap.js';
import * as eventModel from '../models/event.js';
import s3 from '../utils/S3.js';

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

    const { file_name: keyString } = await sourceMapModel.getNewestSourceMap(projectId);

    // pull source map file from S3
    const bucketName = process.env.S3_BUCKET_NAME;
    const params = {
      Bucket: bucketName,
      Key: keyString,
    };
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    const map = await response.Body.transformToString();

    const codeBlocksPromises = stackObjs.map(el => locateMap(map, el.fileName, el.line));
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
      const { fileName, line: errorColumnNum, column: errorLineNum } = stackObjs[i];
      return eventModel.createCodeBlock(
        event.id,
        fileName,
        block,
        errorLine,
        errorColumnNum,
        errorLineNum,
      );
    });

    const codeBlockResult = await Promise.all(createCodeBlockPromises);

    let requestInfoResult = {};
    if (requestInfo) {
      const { url, method, host, userAgent, accept, queryParas } = requestInfo;
      requestInfoResult = await eventModel.createRequestInfo(
        event.id,
        url,
        method,
        host,
        userAgent,
        accept,
        JSON.stringify(queryParas),
      );
    }
    const data = {
      event,
      codeBlockResult,
      requestInfoResult,
    };
    console.log(data);
    res.status(200).json({
      status: 'insert successfully',
      data,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getEventByUserId = async (req, res, next) => {
  try {
    const event = await eventModel.getEventByUserId(res.locals.userId);

    res.status(200).json({
      status: 'get event successfully',
      data: event,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
