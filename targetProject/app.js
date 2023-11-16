import express from 'express';
import cors from 'cors';

import ErrorExporterSDK from '../sdk/index.js';

const app = express();
const port = 3001;

const er = new ErrorExporterSDK();
er.init();

app.use(cors());

app.use(er.requestHandler());
app.get('/', async (req, res, next) => {
  try {
    console.log('Hi');
    throw new Error('This is the error!');
  } catch (e) {
    // er.captureError(e);
    next(e);
  }
});

app.use(er.errorHandler());

app.use((err, req, res, next) => {
  const error = Object.assign(err);
  error.statusCode = err.statusCode || 500;
  res.status(error.statusCode).json({
    status: error.status || 'error',
    data: error.message,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
