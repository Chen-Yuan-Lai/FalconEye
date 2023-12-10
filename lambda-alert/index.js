const { Kafka } = require("kafkajs");

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  const ruleId = event.ruleId;
  const brokers = [process.env.KAFKA_BROKER];

  const kafka = new Kafka({
    clientId: "message-app",
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
  try {
    await producer.connect();
    console.log("Producer connected");

    await producer.send({
      topic: "notification",
      messages: [{ value: `${ruleId}` }],
    });
    console.log("Message sent");
  } catch (error) {
    console.error("Error in Kafka producer", error);
    return { statusCode: 500, body: "Error in sending message" };
  } finally {
    try {
      await producer.disconnect();
      console.log("Producer disconnected");
    } catch (disconnectError) {
      console.error("Error disconnecting producer", disconnectError);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Function executed successfully!",
      inputRuleId: ruleId,
    }),
  };
};
