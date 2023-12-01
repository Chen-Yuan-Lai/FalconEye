export const getAlertRule = async (client, ruleId) => {
  const query = {
    text: `SELECT filter, action_interval FROM alert_rules WHERE id = $1`,
    values: [ruleId],
  };
  const res = await client.query(query);

  return res.rows[0];
};

export const getTriggers = async (client, ruleId) => {
  const query = {
    text: `SELECT * FROM triggers WHERE rule_id = $1`,
    values: [ruleId],
  };
  const res = await client.query(query);

  return res.rows;
};

export const getTokens = async (client, ruleId) => {
  const query = {
    text: `SELECT token FROM channels WHERE rule_id = $1`,
    values: [ruleId],
  };
  const res = await client.query(query);
  const tokens = res.rows.map(el => el.token);
  return tokens;
};

export const getIssues = async (client, interval = null) => {
  const query = {
    text: `SELECT 
              COUNT(DISTINCT(e.fingerprints)) AS issues_num,
              COUNT(DISTINCT(r.ip)) AS users_num
            FROM 
              events AS e
            LEFT JOIN request_info as r on r.event_id = e.id
            ${interval ? `WHERE created_at >= NOW() - $1::INTERVAL` : ''}
            `,
  };

  if (interval) query.values = [interval];
  const res = await client.query(query);
  return res.rows[0];
};

export const createAlertHistory = async (client, ruleId) => {
  const query = {
    text: `INSERT INTO alert_histories(rule_id) VALUES($1) RETURNING *`,
    values: [ruleId],
  };
  const res = await client.query(query);

  return res.rows[0];
};
