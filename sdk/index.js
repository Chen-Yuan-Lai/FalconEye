import os from 'os';

class ErrorExporterSDK {
  constructor() {
    this.validate = false;
    this.EVENT_ENDPOINT = '/api/1.0/capture/SDK/event';
    this.VALIDATION_ENDPOINT = '/api/1.0/capture/validate';
  }

  async init(options = {}) {
    try {
      this.API_HOST = options.apiHost;
      this.userKey = options.userKey;
      this.clientToken = options.clientToken;
      await this.validateSDK();
      console.log('initialize SDK successfully');
      process.on('uncaughtException', error => {
        this.captureError(error);
      });

      process.on('unhandledRejection', error => {
        this.captureError(error);
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  extractRequestInfo(req) {
    const { host, 'user-agent': userAgent, accept } = req.headers;

    return {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      host,
      userAgent,
      accept,
      queryParas: Object.keys(req.query).length || null,
    };
  }

  extractSystemInfo() {
    const { rss, heapTotal, heapUsed, external, arrayBuffers } =
      process.memoryUsage();

    return {
      osType: os.type(),
      osRelease: os.release(),
      architecture: os.arch(),
      nodeVersion: process.version,
      rss,
      heapTotal,
      heapUsed,
      external,
      arrayBuffers,
      uptime: os.uptime(),
    };
  }

  captureError(error, req = null) {
    const errData = {
      workspacePath: process.cwd(),
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toUTCString(),
      systemInfo: this.extractSystemInfo(),
      requestInfo: req ? req.reqInfo : null,
    };
    if (this.validate) {
      this.sendError(errData);
    }
  }

  async sendError(errorData) {
    try {
      const content = {
        userKey: this.userKey,
        clientToken: this.clientToken,
        errorData,
      };
      const res = await fetch(`${this.API_HOST}${this.EVENT_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (!res.ok && `${res.status}`.startsWith('4')) {
        const errorMessage = await res.text();
        const msg = JSON.parse(errorMessage);
        throw new Error(`Error ${res.status}: ${msg.data}`);
      }
      return await res.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  async validateSDK() {
    if (!this.API_HOST) {
      throw new Error("host name can't be empty");
    }

    if (!this.userKey || !this.clientToken) {
      throw new Error("user key and client token can't be empty");
    }

    const content = {
      userKey: this.userKey,
      clientToken: this.clientToken,
    };

    const res = await fetch(`${this.API_HOST}${this.VALIDATION_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    if (!res.ok && `${res.status}`.startsWith('4')) {
      const errorMessage = await res.text();
      const msg = JSON.parse(errorMessage);
      throw new Error(`Failed to initialize SDK: ${msg.data}`);
    }
    this.validate = true;
    return await res.json();
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
