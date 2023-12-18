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
  stack,
) => {
  const query = {
    text: `INSERT INTO code_blocks(
              event_id,
              block,
              file_name,
              error_line,
              error_column_num,
              error_line_num,
              stack)
              VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    values: [eventId, block, fileName, errorLine, errorColumnNum, errorLineNum, stack],
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

export const updateEventsByFingerprints = async (fingerprintsArr, userId, status) => {
  const placeholders = fingerprintsArr.map((_, i) => `$${i + 3}`).join(', ');

  const query = {
    text: `UPDATE 
              events 
          SET 
              status = $1
          WHERE
              user_id = $2
              AND fingerprints IN (${placeholders})
          RETURNING *
    `,
    values: [status, userId, ...fingerprintsArr],
  };
  console.log(query);
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
              e.fingerprints,
              r.url,
              r.method,
              r.useragent AS browser,
              JSON_AGG(JSON_BUILD_OBJECT(
                'id', c.id,
                'event_id', c.event_id,
                'stack', c.stack,
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

export const getEventsByFingerprints = async (fingerprints, pageSize, offsetValue) => {
  const dataQuery = {
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
              e.fingerprints,
              to_char(e.created_at, 'Mon DD, HH12:MIAM') as occurred_time,
              r.url,
              r.method,
              r.useragent AS browser,
              JSON_AGG(JSON_BUILD_OBJECT(
                'id', c.id,
                'event_id', c.event_id,
                'stack', c.stack,
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
              e.fingerprints = $1
          GROUP BY
              e.id, e.project_id, e.name, e.status, e.stack, e.message, 
              e.os_type, e.os_release, e.work_space_path, e.version, r.url, r.method, r.useragent
          LIMIT $2
          OFFSET $3
          `,
    values: [fingerprints, pageSize, offsetValue],
  };

  const countQuery = {
    text: `SELECT COUNT(*) FROM events AS e WHERE e.fingerprints = $1`,
    values: [fingerprints],
  };

  const dataRes = await pool.query(dataQuery);
  const countRes = await pool.query(countQuery);

  const totalCount = parseInt(countRes.rows[0].count, 10);

  return {
    rows: dataRes.rows,
    totalCount,
  };
};
