const API_HOST = "http://localhost:3000";
const SOURCE_MAP_ENDPOINT = "/api/1.0/validate";

const validate = async (userKey, clientToken) => {
  if (!userKey || !clientToken) {
    throw new Error("Missing required parameters");
  }
  const content = {
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

  if (!res.ok && `${res.status}`.startsWith("4")) {
    const errorMessage = await res.text();
    const msg = JSON.parse(errorMessage);
    throw new Error(`Failed to validation: ${msg.data}`);
  }

  return await res.json();
};

export default validate;
