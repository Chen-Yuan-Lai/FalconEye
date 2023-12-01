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

    const promise = fetch('https://notify-api.line.me/api/notify', option);
    notifyPromises.push(promise);
  });

  return await Promise.all(notifyPromises);
};

export default sendNotification;
