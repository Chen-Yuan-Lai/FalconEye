import { EventEmitter } from 'events';
import { Kafka } from 'kafkajs';

const messageEmitter = new EventEmitter();

const brokers = [process.env.KAFKA_BROKER];
const kafka = new Kafka({
  clientId: 'notification-service',
  brokers,
});

const consumer = kafka.consumer({
  groupId: 'notification-service',
});

export const connectConsumer = async topic => {
  await consumer.connect();
  console.log('Consumer connected');

  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ tpic, partition, message }) => {
      if (!message || !message.value) return;

      // const data = JSON.parse(message.value.toString());
      const data = message.value.toString();
      messageEmitter.emit('message', data);
    },
  });

  return messageEmitter;
};

export const disconnectConsumer = async () => {
  await consumer.disconnect();
  console.log('Consumer disconnected');
};
