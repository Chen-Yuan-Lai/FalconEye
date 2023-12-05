const API_HOST = process.env.API_HOST;
const SOURCE_MAP_ENDPOINT = process.env.SOURCE_MAP_ENDPOINT;

const sendSourceMap = async (map, userKey, clientToken) => {
  if (!map || !userKey || !clientToken) {
    throw new Error("Missing required parameters");
  }

  // send multi-form request
  const formData = new FormData();
  // The contentType is set to application/octet-stream, which is a generic binary stream.
  const blob = new Blob([map]);
  formData.append("map", blob, "bundle.js.map");
  formData.append("userKey", userKey);
  formData.append("clientToken", clientToken);
  const res = await fetch(`${API_HOST}${SOURCE_MAP_ENDPOINT}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok && `${res.status}`.startsWith("4")) {
    const errorMessage = await res.text();
    const msg = JSON.parse(errorMessage);
    throw new Error(`Failed to upload source map: ${msg.data}`);
  }

  return await res.json();
};

export default sendSourceMap;
