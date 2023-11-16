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
    console.log(stack);
    // const stackArr = stack.split('\n').map(el => {
    //   console.log(el, typeof el);
    //   console.log(el.trim());
    // });
    // const minifiedStackArr = stackArr.map(el => );

    return stackArr;
  }

  captureError(error, req = null) {
    // const stack = this.processStack(error.stack);
    console.log(error.stack);

    const errData = {
      message: error.message,
      // stack,
      // stack: error.stack,
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
      console.error('There was a problem with the POST request:', error);
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
