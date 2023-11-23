const host = import.meta.env.VITE_HOST;

const headers = {
  "Content-Type": "application/json",
};

export const signin = async (email, password) => {
  const body = JSON.stringify({
    email,
    password,
  });
  const res = await fetch(`${host}user/signin`, {
    method: "POST",
    headers,
    body,
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
};

export const getUser = async (jwt) => {
  headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(`${host}user/userProfile`, { headers });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
};

export const getEvents = async (jwt) => {
  headers.Authorization = `Bearer ${jwt}`;
  const res = await fetch(`${host}events`, { headers });
  return await res.json();
};
