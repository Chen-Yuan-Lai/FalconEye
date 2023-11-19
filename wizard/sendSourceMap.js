const API_HOST = "http://localhost:3000";
const SOURCE_MAP_ENDPOINT = "/api/1.0/sourceMap";

const sendSourceMap = async (map, userKey, clientToken) => {
  if (!map || !userKey || !clientToken) {
    throw new Error("Missing required parameters");
  }

  let parsedMap;
  try {
    parsedMap = JSON.parse(map);
  } catch (error) {
    throw new Error("Invalid JSON in map");
  }

  const content = {
    map: parsedMap,
    userKey,
    clientToken,
  };
  const res = await fetch(`${API_HOST}${SOURCE_MAP_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });

  if (!res.ok) {
    const errorMessage = await response.text();
    throw new Error(`Error ${response.status}: ${errorMessage}`);
  }

  return await res.json();
};

export default sendSourceMap;
