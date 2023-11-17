import os from 'os';

class ErrorExporterSDK {
  constructor() {
    this.host = 'http://localhost:3000';
  }

  init() {
    process.on('uncaughtException', error => {
      this.captureError(error);
    });

    process.on('unhandledRejection', error => {
      this.captureError(error);
    });
  }

  extractRequestInfo(req) {
    return {
      url: req.originalUrl,
      method: req.method,
      headers: req.headers,
      queryParas: req.query,
    };
  }

  extractSystemInfo() {
    return {
      osType: os.type(),
      osRelease: os.release(),
      architecture: os.arch(),
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: os.uptime(),
    };
  }

  processStack(stack) {
    const trimStacks = error.stack
      .split('\n')
      .map(el => el.trim())
      .filter(el => el.startsWith('at'))
      .map(el => {
        const trimStacks = el.split(' ');
        const trimStack = trimStacks[trimStacks.length - 1];
        if (trimStack.startsWith('f')) {
          return trimStack.replace(/file:\/\//g, '');
        } else {
          return trimStack.slice(1, trimStack.length - 2);
        }
      });

    return trimStacks;
  }

  captureError(error, req = null) {
    const trimStacks = this.processStack(error.stack);

    const topStackArr = trimStacks[0].split(':');
    const errorLine = topStackArr[1];
    const errorColumn = topStackArr[2];
    const errData = {
      message: error.message,
      stack: trimStacks,
      errorLine,
      errorColumn,
      name: error.name,
      timestamp: new Date().toISOString(),
      systemInfo: this.extractSystemInfo(),
      requestInfo: req ? req.reqInfo : null,
    };

    this.sendError(errData);
  }

  async sendError(errorData) {
    try {
      const res = await fetch(`${this.host}/api/1.0/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });

      if (!res.ok && `${res.status}`.startsWith('4')) {
        throw new Error('Network response was not ok');
      }

      return await res.json();
    } catch (err) {
      console.error('There was a problem with the POST request:', err);
    }
  }

  requestHandler() {
    return (req, res, next) => {
      req.reqInfo = this.extractRequestInfo(req);
      next();
    };
  }

  errorHandler() {
    return (err, req, res, next) => {
      this.captureError(err, req);
      next(err);
    };
  }
}

export default ErrorExporterSDK;
