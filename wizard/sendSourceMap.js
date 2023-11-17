const host = "http://localhost:3000";

const sendSourceMap = async (map) => {
  const res = await fetch(`${host}/api/1.0/sourceMap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: map,
  });

  if (!res.ok && `${res.status}`.startsWith("4")) {
    throw new Error("Network response was not ok");
  }
  return await res.json();
};

export default sendSourceMap;
