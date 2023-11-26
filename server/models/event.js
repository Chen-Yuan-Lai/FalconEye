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
          message,
          stack,
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
    text: `INSERT INTO code_blocks(
              event_id,
              file_name,
              block,
              error_line,
              error_column_num,
              error_line_num) 
              VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
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
  ip,
) => {
  const query = {
    text: 'INSERT INTO request_info(event_id, url, method, host, useragent, accept, query_paras, ip) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    values: [eventId, url, method, host, userAgent, accept, queryParas, ip],
  };

  const res = await pool.query(query);
  return res.rows[0];
};

export const updateEvents = async (eventIds, status) => {
  const ids = eventIds.map((el, i) => `$${i + 2}`).join(', ');
  const query = {
    text: `UPDATE 
              events 
          SET 
              status = $1
          WHERE
              id IN (${ids})
    `,
    values: [status, ...eventIds],
  };
  const res = await pool.query(query);
  return res.rows[0];
};

export const getEventsByIssue = async queryParams => {
  let { id: eventIds } = queryParams;
  let referrer = '';

  if (typeof eventIds === 'string') eventIds = [eventIds];
  if (queryParams.referrer === 'oldest') {
    referrer = 'ORDER BY created_at LIMIT 1';
  }

  const placeholder = eventIds.map((el, i) => `$${i + 1}`).join(', ');
  referrer = 'ORDER BY created_at DESC LIMIT 1';

  const query = {
    text: `SELECT 
              e.id,
              e.project_id,
              e.name,
              e.status,
              e.stack,
              e.message,
              e.os_type,
              e.os_release,
              e.work_space_path,
              e.version AS runtime,
              r.url,
              r.method,
              r.useragent AS browser,
              JSON_AGG(JSON_BUILD_OBJECT(
                'id', c.id,
                'event_id', c.event_id,
                'block', c.block,
                'error_line', c.error_line,
                'error_column_num', c.error_column_num,
                'error_line_num', c.error_line_num,
                'file_name', c.file_name
              )) AS code_blocks_data
          FROM 
              events AS e
          LEFT JOIN
              request_info AS r ON r.event_id = e.id
          LEFT JOIN
              code_blocks AS c ON c.event_id = e.id
          WHERE 
              e.id IN (${placeholder})
          GROUP BY
              e.id, e.project_id, e.name, e.status, e.stack, e.message, 
              e.os_type, e.os_release, e.work_space_path, e.version, r.url, r.method, r.useragent
          ${referrer}
          `,
    values: [...eventIds],
  };
  const res = await pool.query(query);
  return res.rows[0];
};
