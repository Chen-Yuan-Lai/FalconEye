import pool from './databasePool.js';

export const createEvent = async (
  userId,
  projectId,
  name,
  message,
  stack,
  osType,
  osRelease,
  architecture,
  nodeVersion,
  rss,
  heapTotal,
  heapUsed,
  external,
  arrayBuffers,
  uptime,
  timestamp,
  fingerprints,
  workspacePath,
) => {
  const query = {
    text: `INSERT INTO events(
          user_id, 
          project_id,
          name,
          stack,
          message,
          os_type,
          os_release,
          architecture,
          version,
          mem_rss,
          mem_heap_total,
          mem_heap_used,
          mem_external,
          mem_array_buffers,
          up_time,
          created_at,
          fingerprints,
          work_space_path
          ) VALUES($1, $2, $3, $4, $5, $6,$7, $8, $9,$10, $11, $12, $13, $14, $15,$16, $17, $18) RETURNING *`,
    values: [
      userId,
      projectId,
      name,
      message,
      stack,
      osType,
      osRelease,
      architecture,
      nodeVersion,
      rss,
      heapTotal,
      heapUsed,
      external,
      arrayBuffers,
      uptime,
      timestamp,
      fingerprints,
      workspacePath,
    ],
  };

  const res = await pool.query(query);
  return res.rows[0];
};

export const createCodeBlock = async (
  eventId,
  fileName,
  block,
  errorLine,
  errorColumnNum,
  errorLineNum,
) => {
  const query = {
    text: 'INSERT INTO code_blocks(event_id, file_name, block, error_line, error_column_num, error_line_num) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
    values: [eventId, fileName, block, errorLine, errorColumnNum, errorLineNum],
  };

  const res = await pool.query(query);
  return res.rows[0];
};
export const createRequestInfo = async (
  eventId,
  url,
  method,
  host,
  userAgent,
  accept,
  queryParas,
) => {
  const query = {
    text: 'INSERT INTO request_info(event_id, url, method, host, useragent, accept, query_paras) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    values: [eventId, url, method, host, userAgent, accept, queryParas],
  };

  const res = await pool.query(query);
  return res.rows[0];
};

export const getEvent = id => {};
