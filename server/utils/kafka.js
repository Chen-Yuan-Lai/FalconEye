import { Kafka } from 'kafkajs';

const brokers = [process.env.KAFKA_BROKER];

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

export const sendMessage = async (topic, message) => {
  const res = await producer.send({
    topic,
    messages: [{ value: message }],
  });
  return res;
};
