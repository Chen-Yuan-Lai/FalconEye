import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import pool from './databasePool.js';

export const createUser = async (firstName, secondName, email, password) => {
  const token = await argon2.hash(password);
  const uuid = uuidv4();
  const query = {
    text: 'INSERT INTO users(first_name, second_name, email, password, user_key) VALUES($1, $2, $3, $4, $5) RETURNING id, first_name, second_name, email, user_key',
    values: [firstName, secondName, email, token, uuid],
  };

  const res = await pool.query(query);
  return res.rows[0];
};

export const findUser = async email => {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

export const checkPassword = async (email, password) => {
  const user = await findUser(email);
  const token = user.password;

  return argon2.verify(token, password);
};
