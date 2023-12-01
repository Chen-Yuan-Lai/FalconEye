import { Kafka } from 'kafkajs';

const brokers = ['0.0.0.0:9092'];
const kafka = new Kafka({
  clientId: 'message-app',
  brokers,
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log('Producer connected');
};

export const disconnectProducer = async () => {
  await producer.disconnect();
  console.log('Porducer disconnected');
};

// const topics = ['notification'];

export const sendMessage = async (topic, message) => {
  const res = await producer.send({
    topic,
    messages: [{ value: message }],
  });
  return res;
};

// (async () => {
//   await connectProducer();
//   await sendMessage('notification', 'hihi');
//   await disconnectFromKafka();
// })();
