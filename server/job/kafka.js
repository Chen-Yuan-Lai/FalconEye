import { Kafka } from 'kafkajs';

const brokers = [process.env.KAFKA_BROKER];
const kafka = new Kafka({
  clientId: 'message-app',
  brokers,
  retry: {
    initialRetryTime: 100, // Initial delay between retries in milliseconds
    retries: 30, // Maximum number of retries
    maxRetryTime: 30000, // Maximum delay between retries in milliseconds
    factor: 2, // Exponential factor by which the retry time will be increased
    multiplier: 1.5, // Multiplier to calculate retry delay
    maxInFlightRequests: 1, // Maximum number of in-flight requests during retry
    retryForever: false, // Whether to retry forever
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

// const topics = ['notification'];

export const sendMessage = async (topic, message) => {
  const res = await producer.send({
    topic,
    messages: [{ value: message }],
  });
  return res;
};
