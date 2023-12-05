import { connectProducer, sendMessage, disconnectProducer } from '../job/kafka.js';

(async () => {
  await connectProducer();
  await sendMessage('notification', 'hihi');
  await disconnectProducer();
})();
