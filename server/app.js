import express from 'express';
import cors from 'cors';
import fs from 'fs';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import eventRouter from './routes/event.js';
import sourceMapRouter from './routes/sourceMap.js';
import userRouter from './routes/user.js';
import projectRouter from './routes/project.js';

// read json file
const rawData = fs.readFileSync('swagger_output.json');
const swaggerOutput = JSON.parse(rawData);

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Enable CORS
app.use(cors());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// static file
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/1.0', [eventRouter, sourceMapRouter, userRouter, projectRouter]);

app.use((err, req, res, next) => {
  const error = Object.assign(err);
  error.statusCode = err.statusCode || 500;
  res.status(error.statusCode).json({
    status: error.status || 'error',
    data: error.message,
  });
});

app.listen(port, () => {
  console.log('Listening on port 3000');
});
