import pool from './databasePool.js';

export const createChannels = async (client, ruleId, channels) => {
  const modifyChannels = channels.flatMap(el => [ruleId, el.userId, el.type, el.token]);

  const placeholders = channels
    .map(
      (_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`,
    )
    .join(', ');
  const queryText = `INSERT INTO channels(rule_id, user_id, type, token) VALUES ${placeholders} RETURNING *`;
  const res = await client.query(queryText, modifyChannels);

  return res.rows;
};

export const getTokens = async ruleId => {
  const query = {
    text: `SELECT
            c.rule_id,
            c.token
          FROM channels c 
          WHERE 
            rule_id = $1 
            AND delete = false`,
    values: [ruleId],
  };
  const res = await pool.query(query);
  const tokens = res.rows;
  return tokens;
};

export const deleteChannel = async (client, ruleId) => {
  const query = {
    text: `UPDATE channels SET delete = true WHERE rule_id = $1 RETURNING delete`,
    values: [ruleId],
  };

  const res = await client.query(query);

  return res.rows[0];
};

export const updateChannel = async () => {};
