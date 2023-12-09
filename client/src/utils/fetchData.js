const host = import.meta.env.VITE_HOST;

const headers = {
  'Content-Type': 'application/json',
};

export const signin = async (email, password) => {
  const body = JSON.stringify({
    email,
    password,
  });
  const res = await fetch(`${host}user/signin`, {
    method: 'POST',
    headers,
    body,
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
};

export const getUser = async jwt => {
  headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(`${host}user/userProfile`, { headers });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
};

export const getIssues = async (jwt, projectId = '', status = '', statsPeriod = '', sort = '') => {
  headers.Authorization = `Bearer ${jwt}`;
  const url =
    `${host}issues?` +
    `status=${status || 'unhandled'}&` +
    `statsPeriod=${statsPeriod || '30d'}&` +
    `sort=${sort || 'latest_seen'}&` +
    `project=${projectId || ''}`;
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return {};
  }
  return await res.json();
};

export const getProjects = async jwt => {
  headers.Authorization = `Bearer ${jwt}`;
  const res = await fetch(`${host}projects`, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};

export const getProject = async (jwt, projectId, bin = '', interval = '') => {
  headers.Authorization = `Bearer ${jwt}`;
  let url = `${host}project?projectId=${projectId}`;
  if (bin && interval) {
    url += `&bin=${bin}&interval=${interval}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};

export const getProjectMembers = async (jwt, projectId) => {
  headers.Authorization = `Bearer ${jwt}`;
  let url = `${host}project/${projectId}/members`;
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};

export const createProject = async (jwt, framework, name) => {
  headers.Authorization = `Bearer ${jwt}`;
  let url = `${host}project/`;
  const body = JSON.stringify({
    framework,
    name,
  });
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
};

export const getEvent = async (jwt, eventIds) => {
  headers.Authorization = `Bearer ${jwt}`;
  const query = eventIds.map(el => `id=${el}`).join('&');
  const url = `${host}/issue?${query}`;
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};

export const getEventsByFingerprints = async (jwt, fingerprints, page = null) => {
  headers.Authorization = `Bearer ${jwt}`;
  const url = `${host}event/${fingerprints}?page=${page || 1}`;
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};

export const getTriggersTypes = async jwt => {
  headers.Authorization = `Bearer ${jwt}`;
  const url = `${host}/triggers/types`;
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};

export const createAlert = async (jwt, projectId, data) => {
  headers.Authorization = `Bearer ${jwt}`;

  const url = `${host}/alert?projectId=${projectId}`;
  const res = await fetch(url, { headers, method: 'POST', body: JSON.stringify(data) });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    const { errors } = await res.json();
    throw new Error(errors);
  }
  return await res.json();
};

export const getAlerts = async (jwt, projectId) => {
  headers.Authorization = `Bearer ${jwt}`;
  const url = `${host}alerts${projectId ? `?projectId=${projectId}` : ''}`;
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};

export const getAlert = async (jwt, ruleId, interval = null) => {
  headers.Authorization = `Bearer ${jwt}`;
  const url = `${host}alert/${ruleId}?interval=${interval || '7d'}`;
  const res = await fetch(url, { headers });
  if (!res.ok && `${res.status}`.startsWith('4')) {
    return null;
  }
  return await res.json();
};
