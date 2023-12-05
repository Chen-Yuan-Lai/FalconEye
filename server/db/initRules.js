import 'dotenv/config';
import pkg from 'pg';

const { Client } = pkg;
const client = new Client({
  host: process.env.POSTGRESQL_HOST,
  user: process.env.POSTGRESQL_USER,
  database: process.env.POSTGRESQL_DATABASE,
  password: process.env.POSTGRESQL_PASSWORD,
  port: parseInt(process.env.POSTGRESQL_PORT, 10),
  ssl: {
    rejectUnauthorized: false, // For self-signed certificates; set to true for production
  },
});

console.log('====== init alert triggers ======');

const triggers = [
  'A new issue is created',
  'The issue is seen more than {value} times in {interval}',
  'the issue is seen by more than {value} users in {interval}',
];

const insertTrigger = async rows => {
  try {
    await client.connect();
    const queryText = `INSERT INTO trigger_types(description) VALUES ${rows
      .map((_, i) => `($${i + 1})`)
      .join(', ')}`;
    console.log(queryText, rows);
    await client.query(queryText, rows);
    console.log('Insertion successful');
  } catch (err) {
    console.error(err);
  } finally {
    client.end();
  }
};

insertTrigger(triggers);
