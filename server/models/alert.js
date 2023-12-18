import pool from './databasePool.js';
import format from 'pg-format';

export const createAlert = async (client, projectId, filter, actionInterval, name, active) => {
  const query = {
    text: `INSERT INTO alert_rules(project_id,filter, action_interval, name, active)
          VALUES($1, $2, $3, $4, $5) RETURNING *`,
    values: [projectId, filter, actionInterval, name, active],
  };

  const res = await client.query(query);
  return res.rows[0];
};

export const createAlertHistory = async (client, ruleId) => {
  const query = {
    text: `INSERT INTO alert_histories(ruleI)
          VALUES($1) RETURNING *`,
    values: [ruleId],
  };

  const res = await client.query(query);
  return res.rows[0];
};

export const getAlerts = async (projectId, pageSize, offsetValue) => {
  const query = {
    text: `SELECT 
              r.id,
              r.project_id,
              r.active,
              r.name,
              (
                SELECT framework
                FROM projects
                WHERE id = r.project_id
              ),
              (
                SELECT AGE(NOW(), MAX(trigger_time))
                FROM alert_histories
                WHERE rule_id = r.id
              ) AS latest_triggered_time
          FROM 
              alert_rules AS r
          WHERE 
              r.project_id = $3
              AND r.delete = false
          ORDER BY 
              r.created_at DESC
          LIMIT $1
          OFFSET $2`,
    values: [pageSize, offsetValue, projectId],
  };

  const res = await pool.query(query);
  return res.rows;
};

export const getAlert = async alertId => {
  const query = {
    text: `
          SELECT
              *
          FROM
              alert_rules
          WHERE
              id = $1
              AND delete = false
          `,
    values: [alertId],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

export const getAlertPerHour = async (alertId, interval) => {
  const bin = '1h';
  const queryStr = format(
    `SELECT
        TO_CHAR(series.hour, 'MM/DD HH24:MI') || '-' || TO_CHAR((series.hour + INTERVAL %L), 'HH24:MI') AS hourly_interval,
        COALESCE(COUNT(h.id), 0) AS triggered_times
      FROM 
        (SELECT generate_series(NOW() - INTERVAL %L, NOW() - interval %L, %L) AS hour) AS series
      LEFT JOIN
        alert_histories AS h ON h.trigger_time >= series.hour
        AND h.trigger_time < series.hour + INTERVAL %L
        AND h.rule_id = $1
        AND h.delete = false         
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
    values: [alertId],
  };
  const res = await pool.query(query);

  const modifiedRows = res.rows.map(row => ({
    ...row,
    triggered_times: parseInt(row.triggered_times, 10),
  }));

  return modifiedRows;
};

// tag 因為要多表一起刪 controller會用transaction
export const deleteAlert = async (client, ruleId) => {
  const query = {
    text: `UPDATE 
              alert_rules 
          SET 
              delete = true 
          WHERE 
              id = $1
          RETURNING delete`,
    values: [ruleId],
  };

  const res = await client.query(query);

  return res.rows[0];
};

export const deleteAlertHistories = async (client, ruleId) => {
  const query = {
    text: `UPDATE 
              alert_histories
          SET 
              delete = true 
          WHERE 
              rule_id = $1
          RETURNING delete`,
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
    text: `UPDATE 
              alert_rules 
          SET ${columns.join(', ')} 
          WHERE
              id = ${ruleId}
              AND delete = false
          RETURNING *`,
    values: Object.values(fields),
  };

  const res = await pool.query(query);

  return res.rows[0];
};
