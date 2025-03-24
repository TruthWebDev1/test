const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('postProcessing');
    console.log('RabbitMQ connected');
  } catch (err) {
    console.error('RabbitMQ connection error:', err);
  }
};

const publishToQueue = async (queue, message) => {
  if (!channel) await connectRabbitMQ();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};

const consumeFromQueue = async (queue, callback) => {
  if (!channel) await connectRabbitMQ();
  channel.consume(queue, (msg) => {
    if (msg) {
      const message = JSON.parse(msg.content.toString());
      callback(message);
      channel.ack(msg);
    }
  });
};

module.exports = { publishToQueue, consumeFromQueue };
