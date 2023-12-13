import { v4 as uuidv4 } from 'uuid';
import pool from './databasePool.js';
import format from 'pg-format';

export const createProject = async (framework, userId, name) => {
  const uuid = uuidv4();
  const query = {
    text: `INSERT INTO projects(
              framework, 
              user_id,
              client_token,
              name,
              members) 
            VALUES($1, $2, $3, $4, $5) RETURNING *`,
    values: [framework, userId, uuid, name, [userId]],
  };

  const res = await pool.query(query);
  return res.rows[0];
};

export const checkProject = async (userKey, clientToken) => {
  const query = {
    text: `SELECT
              u.id AS user_id,
              p.id AS project_id 
          FROM 
              users AS u
          LEFT JOIN 
              projects AS p ON u.id = p.user_id 
          WHERE 
              u.user_key = $1
              AND p.client_token = $2`,
    values: [userKey, clientToken],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

export const deleteProject = async projectId => {
  const query = {
    text: `UPDATE FROM projects SET delete = true WHERE id = $1`,
    values: [projectId],
  };
  const res = await pool.query(query);
  return res;
};

export const findProject = async clientToken => {
  const query = {
    text: 'SELECT * FROM projects WHERE client_token = $1 AND delete = false',
    values: [clientToken],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

export const checkMemberByProjectId = async (userId, projectId) => {
  const query = {
    text: `SELECT
              *
          FROM 
              projects
          WHERE 
              $1 = ANY(members)
              AND id = $2
              AND delete = false`,
    values: [userId, projectId],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

export const updateProjectMember = async (userId, projectId, action) => {
  const arrFun = action === 'add' ? 'ARRAY_APPEND' : 'ARRAY_REMOVE';
  const queryStr = format(
    `UPDATE projects SET members = %s(members, $1) WHERE id = $2 AND delete = false`,
    arrFun,
  );
  const query = {
    text: queryStr,
    values: [userId, projectId],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

export const getProjectsByMembers = async userId => {
  const query = {
    text: `SELECT
              p.*,
              COUNT(e.id) AS errors
          FROM 
              projects AS p
          LEFT JOIN
              events AS e 
              ON e.project_id = p.id 
          WHERE 
              $1 = ANY(members)
              AND p.delete = false
          GROUP BY
              p.id`,
    values: [userId],
  };
  const res = await pool.query(query);
  return res.rows;
};

export const getProject = async projectId => {
  const query = {
    text: 'SELECT * FROM projects WHERE id = $1 AND delete = false',
    values: [projectId],
  };

  const res = await pool.query(query);
  return res.rows[0];
};

// todo 參數以小時為單位
export const getErrorsPerHoursByProjectId = async (projectId, bin, interval) => {
  const queryStr = format(
    `SELECT
        TO_CHAR(series.hour, 'MM/DD HH24:MI') || '-' || TO_CHAR((series.hour + INTERVAL %L), 'HH24:MI') AS hourly_interval,
        COALESCE(COUNT(e.id), 0) AS event_count
      FROM 
        (SELECT generate_series(NOW() - INTERVAL %L, NOW() - interval %L, %L) AS hour) AS series
      LEFT JOIN
        events AS e ON e.created_at >= series.hour
        AND e.created_at < series.hour + INTERVAL %L
        AND e.project_id = $1
        AND e.delete = false       
      GROUP BY
        series.hour
      ORDER BY
        series.hour`,
    bin,
    interval,
    bin,
    bin,
    bin,
  );

  const query = {
    text: queryStr,
    values: [projectId],
  };
  const res = await pool.query(query);
  return res.rows;
};

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
                      e.fingerprints,
                      p.id as project_id,
                      p.framework as project_framework,
                      AGE(NOW(), MAX(e.created_at)) AS latest_seen,
                      AGE(NOW(), MIN(e.created_at)) AS first_seen,
                      ARRAY_AGG(DISTINCT e.id) AS event_ids,
                      ARRAY_AGG(DISTINCT r.ip) AS user_ips,
                      COUNT(e.fingerprints) AS events, 
                      COUNT(DISTINCT r.ip) AS users
                    FROM 
                      projects AS p 
                    LEFT JOIN 
                      events AS e ON e.project_id = p.id
                    LEFT JOIN 
                      request_info AS r ON r.event_id = e.id 
                    WHERE 
                      $1 = ANY(p.members)
                      AND p.delete = false
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
