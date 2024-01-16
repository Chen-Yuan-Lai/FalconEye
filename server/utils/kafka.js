import { Kafka } from 'kafkajs';

const brokers = [process.env.KAFKA_BROKER];

const kafka = new Kafka({
  clientId: 'message-app',
  brokers,
  retry: {
    initialRetryTime: 500, // Initial delay between retries in milliseconds
    retries: Infinity, // Set retries to Infinity for indefinite retries
    factor: 2, // Exponential factor by which the retry time will be increased
    multiplier: 1.5, // Multiplier to calculate retry delay
    maxRetryTime: 60000, // Maximum wait time for a retry in milliseconds
  },
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
