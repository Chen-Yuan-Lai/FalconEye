import pg from 'pg';
import express from 'express';
import cors from 'cors';

import ErrorExporterSDK from '../sdk/index.js';

const app = express();
const port = 3001;
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'personal_project',
  password: '0913',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;

const er = new ErrorExporterSDK();

await er.init({
  apiHost: 'http://localhost',
  userKey: 'f7da9241-4308-4a97-81c1-e25819140532',
  clientToken: '5dee0e38-54ec-4c87-b7f1-b95eea7cfaba',
});

// await er.init({
//   apiHost: 'https://handsomelai.shop',
//   userKey: 'aceefc85-1a30-4829-ad0d-f3efc38ee0e8',
//   clientToken: '02a90cb4-afa8-44b5-9682-eae63a8bc1c1',
// });

app.use(cors());

app.use(er.requestHandler());
app.get('/programError', async (req, res, next) => {
  try {
    console.log('Hi');
    throw new Error('This is the error!');
  } catch (e) {
    // er.captureError(e);
    next(e);
  }
});

app.get('/typeError', async (req, res, next) => {
  try {
    console.logg('Hi');
  } catch (e) {
    // er.captureError(e);
    next(e);
  }
});

app.get('/referenceError', async (req, res, next) => {
  try {
    console.logg('Hi');
  } catch (e) {
    // er.captureError(e);
    next(e);
  }
});

app.get('/databaseError', async (req, res, next) => {
  try {
    console.log('That is database error');
    const query1 = {
      text: 'INSERTT INTO projects(framework, user_id, client_token) VALUES($1, $2, $3) RETURNING *',
      values: ['express', 10, 'jbhjvcvjhjb'],
    };

    const query2 = {
      text: `INSERT INTO users(first_name, second_name, email, password, user_key) VALUES($1, $2, $3, $4, $5) RETURNING id, first_name, second_name, email, user_key`,
      values: [
        'kenvin',
        'Lee',
        'kevin@gmail.com',
        'gndgnfgnfmnfghmfgndfgh',
        'dhdgjfgyhjmgbs',
      ],
    };
    // const res = await pool.query(query1);
    const res = await pool.query(query2);
  } catch (e) {
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
