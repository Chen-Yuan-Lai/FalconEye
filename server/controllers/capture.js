import locateMap from '../utils/locateMap.js';
import * as sourceMapModel from '../models/sourceMap.js';
import * as eventModel from '../models/event.js';
import { getObject } from '../aws/S3.js';

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

    if (newestMap) {
      const keyString = newestMap.file_name;

      // pull source map file from S3
      const response = await getObject(keyString);
      const map = await response.Body.transformToString();

      const codeBlocksPromises = stackObjs.map(el => locateMap(map, el.fileName, el.line, stack));
      const codeBlocks = await Promise.all(codeBlocksPromises);

      const createCodeBlockPromises = new Array(stackObjs.length).fill(null).map((_, i) => {
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
    res.status(200).json({
      status: 'insert successfully',
      data,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createSourceMap = async () => {};
