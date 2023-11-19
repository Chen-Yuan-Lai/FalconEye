import pool from './databasePool.js';

export const createSourceMap = async (path, projectId, hashValue, version) => {
  const query = {
    text: 'INSERT INTO source_maps(path, project_id, hash_value, version) VALUES($1, $2, $3, $4) RETURNING *',
    values: [path, projectId, hashValue, version],
  };

  const res = await pool.query(query);
  return res.rows[0];
};

export const findSourceMap = async column => {
  const query = {
    text: 'SELECT * FROM source_maps WHERE client_token = $1',
    values: [column],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

export const getNewestSourceMap = async projectId => {
  const query = {
    text: `SELECT * FROM source_maps WHERE version = 
          (
            SELECT MAX(version) FROM source_maps
            WHERE project_id = $1
          )`,
    values: [projectId],
  };
  const res = await pool.query(query);
  return res.rows[0];
};
