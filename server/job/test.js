import { connectProducer, sendMessage, disconnectProducer } from './kafka.js';

(async () => {
  await connectProducer();
  await sendMessage('notification', 'hihi');
  await disconnectProducer();
})();
