import { connectProducer, sendMessage } from '../../utils/kafka.js';

if (process.env.KAFKA_MODE === '1') connectProducer();

export const eventProducer = async (req, res, next) => {
  try {
    const { projectId, userId } = res.locals;
    const eventData = req.body;

    delete eventData.userKey;
    delete eventData.clientToken;

    eventData.userId = userId;
    eventData.projectId = projectId;

    await sendMessage('eventData', JSON.stringify(eventData));

    res.status(200).json({
      data: {
        eventData,
        projectId,
        userId,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const notificationProducer = async (req, res, next) => {
  await sendMessage('notification', JSON.stringify(6));
  res.status(200).json({ message: 'ok' });
};
