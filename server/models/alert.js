import pool from './databasePool.js';

export const createAlert = async (client, projectId, filter, actionInterval, name, active) => {
  const query = {
    text: `INSERT INTO alert_rules(project_id,filter, action_interval, name, active)
          VALUES($1, $2, $3, $4, $5) RETURNING *`,
    values: [projectId, filter, actionInterval, name, active],
  };

  const res = await client.query(query);
  return res.rows[0];
};

export const createAlertHistory = async () => {};

export const getAlerts = async () => {};

export const getAlert = async () => {};

export const getAlertHistories = async () => {};

// tag 因為要多表一起刪 controller會用transaction
export const deleteAlert = async (client, ruleId) => {
  const query = {
    text: `DELETE FROM alert_rules WHERE id = $1 RETURNING *`,
    values: [ruleId],
  };

  const res = await client.query(query);

  return res.rows[0];
};

export const updateAlert = async (ruleId, fields) => {
  const columns = [];

  Object.keys(fields).forEach((el, i) => {
    columns.push(`${el} = $${i + 1}`);
  });

  const query = {
    text: `UPDATE alert_rules SET ${columns.join(', ')} WHERE id = ${ruleId} RETURNING *`,
    values: Object.values(fields),
  };

  const res = await pool.query(query);

  return res.rows[0];
};
