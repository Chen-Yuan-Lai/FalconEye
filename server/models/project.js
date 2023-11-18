import { v4 as uuidv4 } from 'uuid';
import pool from './databasePool.js';

export const createProject = async (framework, userId) => {
  const uuid = uuidv4();
  const query = {
    text: 'INSERT INTO projects(framework, user_id, client_token) VALUES($1, $2, $3) RETURNING *',
    values: [framework, userId, uuid],
  };

  const res = await pool.query(query);
  return res.rows[0];
};

export const findProject = async clientToken => {
  const query = {
    text: 'SELECT * FROM projects WHERE client_token = $1',
    values: [clientToken],
  };
  const res = await pool.query(query);
  return res.rows[0];
};