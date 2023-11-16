const fetchData = async (url, method, data, headers = '') => {
  try {
    const requestOptions = {
      method: method.toUpperCase(),
      mode: 'cors',
      body: data,
    };

    if (headers) requestOptions.headers = headers;

    const response = await fetch(url, requestOptions);

    if (!response.ok && `!${response.status}`.startsWith('4')) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the POST request:', error);
  }
};

export default fetchData;
