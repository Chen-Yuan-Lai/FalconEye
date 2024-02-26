const sendNotification = async (message, tokens) => {
  const notifyPromises = [];

  tokens.forEach(token => {
    const option = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body: `message=${message}`,
      method: 'POST',
    };

    const promise = fetch(process.env.LINE_NOTIFY_API, option);
    notifyPromises.push(promise);
  });

  return Promise.all(notifyPromises);
};

export default sendNotification;
