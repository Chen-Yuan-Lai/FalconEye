import { v4 as uuidv4 } from 'uuid';
import pool from './databasePool.js';

export const createProject = async (framework, userId) => {
  const uuid = uuidv4();
  const query = {
    text: `INSERT INTO projects(
              framework, 
              user_id,
              client_token,
              members) 
            VALUES($1, $2, $3, $4) RETURNING *`,
    values: [framework, userId, uuid, [userId]],
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

export const addProjectMember = async (userId, projectId) => {
  const query = {
    text: `UPDATE projects SET members = ARRAY_APPEND(members, $1) WHERE id = $2`,
    values: [userId, projectId],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

export const deleteProjectMember = async userId => {
  const query = {
    text: `UPDATE projects SET members = ARRAY_REMOVE(members, $1)`,
    values: [userId],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

export const checkProject = async (userKey, clientToken) => {
  const query = {
    text: `SELECT users.id AS user_id, projects.id AS project_id  FROM users 
          LEFT JOIN projects ON users.id = projects.user_id 
          WHERE user_key = $1 AND client_token = $2 `,
    values: [userKey, clientToken],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

// TODO 可能不會用到的model function
export const getProjectsByMembers = async userId => {
  const query = {
    text: `SELECT * FROM projects WHERE $1 = ANY(members)`,
    values: [userId],
  };
  const res = await pool.query(query);
  return res.rows;
};

// todo
export const getIssues = async (userId, queryParams) => {
  let i = 2;
  let project = '';
  let statsPeriod = '';
  let status = '';
  let sort = '';
  const queryValue = [];

  if (queryParams.project) {
    project = `AND p.id = $${i}`;
    queryValue.push(queryParams.project);
    i += 1;
  }

  if (queryParams.statsPeriod) {
    statsPeriod = `AND e.created_at >= NOW() - $${i}::INTERVAL`;
    queryValue.push(queryParams.statsPeriod);
    i += 1;
  }

  if (queryParams.status) {
    status = `AND e.status = $${i}`;
    queryValue.push(queryParams.status);
    i += 1;
  }

  if (queryParams.sort === 'first_seen') {
    sort = `ORDER BY age(NOW(), MIN(e.created_at))`;
  }
  sort = `ORDER BY age(NOW(), MIN(e.created_at))`;

  const queryStr = `SELECT 
                      e.name,
                      e.status,
                      p.id as project_id,
                      p.framework as project_framework,
                      AGE(NOW(), MAX(e.created_at)) AS latest_seen,
                      AGE(NOW(), MAX(e.created_at)) AS first_seen,
                      ARRAY_AGG(DISTINCT e.id) AS event_ids,
                      ARRAY_AGG(DISTINCT r.ip) AS user_ips,
                      COUNT(e.fingerprints) AS events, 
                      COUNT(DISTINCT r.ip) AS users
                    FROM 
                      projects AS p 
                    INNER JOIN 
                      events as e on e.project_id = p.id
                    INNER JOIN 
                      request_info as r on r.event_id = e.id 
                    WHERE 
                      $1 = ANY(p.members)
                      ${project}
                      ${statsPeriod}
                      ${status}
                    GROUP BY 
                      e.fingerprints, e.name, e.status, p.id
                    ${sort}`;
  const query = {
    text: queryStr,
    values: [userId, ...queryValue],
  };
  const res = await pool.query(query);
  return res.rows;
};
