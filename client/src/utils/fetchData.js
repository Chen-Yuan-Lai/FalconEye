// const host = "http://localhost/api/1.0/";
const host = "/api/1.0/";

export const getEvent = async (category) => {
  const products = await fetchData(`${host}products/${category}`);

  return products.data;
};
